// server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticateToken, authorizeRestaurantAdmin } from './middleware/auth.js'; // Importe os middlewares

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


const JWT_SECRET = process.env.JWT_SECRET; //

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('API está funcionando!');
});


app.post('/api/register', async (req, res) => {
  const { email, senha, restaurantId, nome } = req.body;

  if (!email || !senha || !restaurantId || !nome) {
    return res.status(400).json({ success: false, message: 'Todos os campos (email, senha, nome, restaurante) são obrigatórios!' });
  }

  try {
    const { data: existingAdmin, error: existingAdminError } = await supabase
      .from('administradores')
      .select('email')
      .eq('email', email);

    if (existingAdminError) throw existingAdminError;

    if (existingAdmin && existingAdmin.length > 0) {
      return res.status(409).json({ success: false, message: 'E-mail já cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const { data, error } = await supabase
      .from('administradores')
      .insert([
        {
          email: email,
          senha: hashedPassword,
          restaurant_id: restaurantId,
          nome: nome,
          role: 'admin'
        }
      ]);

    if (error) {
      console.error('Erro ao inserir administrador no Supabase:', error);
      return res.status(500).json({ success: false, message: 'Erro ao cadastrar administrador no banco de dados.' });
    }

    console.log('Administrador cadastrado com sucesso.');
    res.status(201).json({ success: true, message: 'Administrador cadastrado com sucesso!' });

  } catch (error) {
    console.error('Erro na rota de registro:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
});


app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios.' });
  }

  try {
    const { data: admin, error } = await supabase
      .from('administradores')
      .select('id, email, senha, restaurant_id, nome, role')
      .eq('email', email)
      .single();


    console.log("Backend LOG: Objeto 'admin' retornado do Supabase:", admin); //
    console.log("Backend LOG: Valor da 'role' do admin:", admin?.role); //


    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao buscar administrador no Supabase:', error);
      return res.status(500).json({ success: false, message: 'Erro ao buscar usuário no banco de dados.' });
    }

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
    }

    const passwordMatch = await bcrypt.compare(senha, admin.senha);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        restaurantId: admin.restaurant_id,
        nome: admin.nome,
        role: admin.role
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso!',
      token: token,
      data: {
        id: admin.id,
        email: admin.email,
        restaurantId: admin.restaurant_id,
        nome: admin.nome,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Erro na rota de login:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
});


// --- NOVAS ROTAS PARA GERENCIAMENTO DE CARDÁPIOS E PRODUTOS ---

// Nova rota para buscar cardápios de um restaurante específico
// Esta rota é necessária para o frontend saber qual cardapio_id usar ao adicionar produtos.
app.get('/api/cardapios/restaurante/:restauranteId', authenticateToken, async (req, res) => {
  const { restauranteId } = req.params;
  const { busca } = req.query; // Adicione esta linha para evitar o ReferenceError

  console.log("LOG ROTA CARDAPIOS: Comparando IDs para cardápio:", { userRestaurantId: req.user?.restaurantId, paramRestauranteId: restauranteId }); //

  // Verifica se o usuário logado tem permissão
  if (req.user.restaurantId !== Number(restauranteId)) { // Converta restauranteId para número!
    console.log("LOG ROTA CARDAPIOS: Mismatch de IDs. req.user.restaurantId:", req.user?.restaurantId, " vs restauranteId da URL (convertido):", Number(restauranteId)); //
    return res.status(403).json({ success: false, message: 'Acesso negado. Você não tem permissão para visualizar cardápios deste restaurante.' });
  }

  try {
    // AQUI: A rota de busca de cardápios deve apenas retornar os cardápios,
    // não a lógica de produtos. O `EditarProdutos.jsx` espera `data.cardapios[0].id`
    // para pegar o cardapio_id.

    const { data: cardapios, error } = await supabase
      .from('cardapios')
      .select('id, descricao, data') // Selecione os campos que você precisa do cardápio
      .eq('restaurante_id', Number(restauranteId)); // Use Number() aqui para garantir compatibilidade de tipo na query

    if (error) throw error;

    // Retorna os cardápios encontrados
    res.status(200).json({ success: true, cardapios: cardapios });

  } catch (error) {
    console.error('Erro ao buscar cardápios para o restaurante:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar cardápios.' });
  }
});


// Middleware de autenticação e autorização aplicado a todas as rotas de produtos
app.use('/api/produtos', authenticateToken, authorizeRestaurantAdmin); //

// GET /api/produtos/:restauranteId - Listar produtos de um restaurante
app.get('/api/produtos/:restauranteId', async (req, res) => {
  const { restauranteId } = req.params;
  const { busca } = req.query; // Para o filtro de busca

  console.log("LOG ROTA PRODUTOS: Comparando IDs para produto:", { userRestaurantId: req.user?.restaurantId, paramRestauranteId: restauranteId }); //

  // Verifique se o usuário logado tem permissão para ver os produtos deste restaurante (redundante com authorizeRestaurantAdmin, mas bom para especificidade)
  if (req.user.restaurantId !== Number(restauranteId)) { // Converta restauranteId para número!
    console.log("LOG ROTA PRODUTOS: Mismatch de IDs. req.user.restaurantId:", req.user?.restaurantId, " vs restauranteId da URL (convertido):", Number(restauranteId)); //
    return res.status(403).json({ success: false, message: 'Acesso negado. Você não tem permissão para visualizar produtos deste restaurante.' });
  }

  try {
    // 1. Pega o(s) ID(s) do cardápio(s) do `restauranteId` da tabela `cardapios`.
    const { data: cardapiosDoRestaurante, error: cardapiosError } = await supabase
      .from('cardapios')
      .select('id')
      .eq('restaurante_id', Number(restauranteId)); // Converta para Number() aqui também

    if (cardapiosError) throw cardapiosError;

    const cardapioIds = cardapiosDoRestaurante.map(c => c.id);

    if (cardapioIds.length === 0) {
      return res.status(200).json({ success: true, produtos: [], message: 'Nenhum cardápio encontrado para este restaurante, portanto nenhum produto para listar.' });
    }

    // 2. Usa esses IDs para filtrar em `itens_cardapio`.
    let query = supabase
      .from('itens_cardapio')
      .select('*')
      .in('cardapio_id', cardapioIds);

    if (busca) {
      query = query.ilike('nome', `%${busca}%`); // Busca case-insensitive
    }

    const { data: produtos, error } = await query;

    if (error) throw error;

    res.status(200).json({ success: true, produtos });
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar produtos.' });
  }
});

// POST /api/produtos - Adicionar um novo produto
app.post('/api/produtos', async (req, res) => {
  const { cardapio_id, nome, preco, descricao, disponivel, imagem } = req.body;

  // Validações básicas dos campos obrigatórios
  if (!cardapio_id || !nome || preco === undefined || preco === null) {
    return res.status(400).json({ success: false, message: 'cardapio_id, nome e preco são obrigatórios.' });
  }

  // Verifique se o cardapio_id pertence ao restaurante do usuário logado
  const { data: cardapioCheck, error: cardapioCheckError } = await supabase
    .from('cardapios')
    .select('restaurante_id')
    .eq('id', cardapio_id)
    .single();

  // Converta req.user.restaurantId para número para comparação
  if (cardapioCheckError || !cardapioCheck || cardapioCheck.restaurante_id !== Number(req.user.restaurantId)) {
    console.error('Tentativa de adicionar produto a cardápio não autorizado ou inexistente:', { cardapio_id, userRestaurantId: req.user.restaurantId });
    return res.status(403).json({ success: false, message: 'Acesso negado. O cardápio especificado não pertence ao seu restaurante ou não existe.' });
  }

  try {
    const { data, error } = await supabase
      .from('itens_cardapio')
      .insert([
        {
          cardapio_id,
          nome,
          preco: Number.parseFloat(preco), // Garante que o preço seja um número
          descricao: descricao || null, // Permite nulo se não fornecido
          disponivel: typeof disponivel === 'boolean' ? disponivel : true, // Valor padrão se não fornecido
          imagem: imagem || null, // Permite nulo se não fornecido
        }
      ])
      .select(); // Retorna o item inserido

    if (error) throw error;

    res.status(201).json({ success: true, message: 'Produto adicionado com sucesso!', produto: data[0] });
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    res.status(500).json({ success: false, message: 'Erro ao adicionar produto.' });
  }
});

// PUT /api/produtos/:id - Editar um produto existente
app.put('/api/produtos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, preco, descricao, disponivel, imagem } = req.body;

  // Validações básicas
  if (!nome || preco === undefined || preco === null) {
    return res.status(400).json({ success: false, message: 'Nome e preco são obrigatórios para atualização.' });
  }

  // Primeiro, verifique se o produto existe e se pertence ao restaurante do usuário logado
  const { data: produtoExistente, error: produtoError } = await supabase
    .from('itens_cardapio')
    .select('cardapio_id')
    .eq('id', id)
    .single();

  if (produtoError || !produtoExistente) {
    return res.status(404).json({ success: false, message: 'Produto não encontrado.' });
  }

  // Verificar se o cardápio do produto pertence ao restaurante do usuário logado
  const { data: cardapioCheck, error: cardapioCheckError } = await supabase
    .from('cardapios')
    .select('restaurante_id')
    .eq('id', produtoExistente.cardapio_id)
    .single();

  // Converta req.user.restaurantId para número para comparação
  if (cardapioCheckError || !cardapioCheck || cardapioCheck.restaurante_id !== Number(req.user.restaurantId)) {
    console.error('Tentativa de editar produto não autorizado:', { produtoId: id, userRestaurantId: req.user.restaurantId });
    return res.status(403).json({ success: false, message: 'Acesso negado. Você não tem permissão para editar este produto.' });
  }

  try {
    const { data, error } = await supabase
      .from('itens_cardapio')
      .update({
        nome,
        preco: Number.parseFloat(preco),
        descricao,
        disponivel,
        imagem,
      })
      .eq('id', id)
      .select(); // Retorna o item atualizado

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado para atualização.' });
    }

    res.status(200).json({ success: true, message: 'Produto atualizado com sucesso!', produto: data[0] });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar produto.' });
  }
});

// DELETE /api/produtos/:id - Excluir um produto
app.delete('/api/produtos/:id', async (req, res) => {
  const { id } = req.params;

  // Primeiro, verifique se o produto existe e se pertence ao restaurante do usuário logado
  const { data: produtoExistente, error: produtoError } = await supabase
    .from('itens_cardapio')
    .select('cardapio_id')
    .eq('id', id)
    .single();

  if (produtoError || !produtoExistente) {
    return res.status(404).json({ success: false, message: 'Produto não encontrado.' });
  }

  // Verificar se o cardápio do produto pertence ao restaurante do usuário logado
  const { data: cardapioCheck, error: cardapioCheckError } = await supabase
    .from('cardapios')
    .select('restaurante_id')
    .eq('id', produtoExistente.cardapio_id)
    .single();

  // Converta req.user.restaurantId para número para comparação
  if (cardapioCheckError || !cardapioCheck || cardapioCheck.restaurante_id !== Number(req.user.restaurantId)) {
    console.error('Tentativa de excluir produto não autorizado:', { produtoId: id, userRestaurantId: req.user.restaurantId });
    return res.status(403).json({ success: false, message: 'Acesso negado. Você não tem permissão para excluir este produto.' });
  }

  try {
    const { error } = await supabase
      .from('itens_cardapio')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({ success: true, message: 'Produto excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    res.status(500).json({ success: false, message: 'Erro ao excluir produto.' });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});