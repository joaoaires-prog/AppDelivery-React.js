// server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticateToken, authorizeRestaurantAdmin } from './middleware/auth.js';
import multer from 'multer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const JWT_SECRET = process.env.JWT_SECRET;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseServiceRole = createClient(supabaseUrl, SUPABASE_SERVICE_KEY);


app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });


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


    console.log("Backend LOG: Objeto 'admin' retornado do Supabase:", admin);
    console.log("Backend LOG: Valor da 'role' do admin:", admin?.role);


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


//ROTAS PARA GERENCIAMENTO DE CARDÁPIOS E PRODUTOS ---

// Nova rota para buscar cardápios de um restaurante específico
app.get('/api/cardapios/restaurante/:restauranteId', authenticateToken, async (req, res) => {
  const { restauranteId } = req.params;
  const { busca } = req.query; 

  console.log("LOG ROTA CARDAPIOS: Comparando IDs para cardápio:", { userRestaurantId: req.user?.restaurantId, paramRestauranteId: restauranteId });

  // Verifica se o usuário logado tem permissão
  if (req.user.restaurantId !== Number(restauranteId)) {
    console.log("LOG ROTA CARDAPIOS: Mismatch de IDs. req.user.restaurantId:", req.user?.restaurantId, " vs restauranteId da URL (convertido):", Number(restauranteId));
    return res.status(403).json({ success: false, message: 'Acesso negado. Você não tem permissão para visualizar cardápios deste restaurante.' });
  }

  try {
    const { data: cardapios, error } = await supabase
      .from('cardapios')
      .select('id, descricao, data')
      .eq('restaurante_id', Number(restauranteId)); // Use Number() aqui para garantir compatibilidade de tipo na query

    if (error) throw error;

    res.status(200).json({ success: true, cardapios: cardapios });

  } catch (error) {
    console.error('Erro ao buscar cardápios para o restaurante:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar cardápios.' });
  }
});


// <<<< NOVO: Rotas de produtos agora com upload de imagem e exclusão de imagem

// A rota GET não recebe arquivos, então a autenticação é direta
app.get('/api/produtos/:restauranteId', authenticateToken, authorizeRestaurantAdmin, async (req, res) => {
  const { restauranteId } = req.params;
  const { busca } = req.query; // Para o filtro de busca

  console.log("LOG ROTA PRODUTOS: Comparando IDs para produto:", { userRestaurantId: req.user?.restaurantId, paramRestauranteId: restauranteId });

  if (req.user.restaurantId !== Number(restauranteId)) {
    console.log("LOG ROTA PRODUTOS: Mismatch de IDs. req.user.restaurantId:", req.user?.restaurantId, " vs restauranteId da URL (convertido):", Number(restauranteId));
    return res.status(403).json({ success: false, message: 'Acesso negado. Você não tem permissão para visualizar produtos deste restaurante.' });
  }

  try {
    const { data: cardapiosDoRestaurante, error: cardapiosError } = await supabase
      .from('cardapios')
      .select('id')
      .eq('restaurante_id', Number(restauranteId));

    if (cardapiosError) throw cardapiosError;

    const cardapioIds = cardapiosDoRestaurante.map(c => c.id);

    if (cardapioIds.length === 0) {
      return res.status(200).json({ success: true, produtos: [], message: 'Nenhum cardápio encontrado para este restaurante, portanto nenhum produto para listar.' });
    }

    let query = supabase
      .from('itens_cardapio')
      .select('*')
      .in('cardapio_id', cardapioIds);

    if (busca) {
      query = query.ilike('nome', `%${busca}%`);
    }

    const { data: produtos, error } = await query;

    if (error) throw error;

    res.status(200).json({ success: true, produtos });
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar produtos.' });
  }
});

// POST /api/produtos - Adicionar um novo produto com upload de imagem
app.post('/api/produtos', authenticateToken, authorizeRestaurantAdmin, upload.single('imagem'), async (req, res) => {
  const { cardapio_id, nome, preco, descricao, disponivel } = req.body;
  const imageFile = req.file;

  let imageUrl = null;

  if (!cardapio_id || !nome || preco === undefined || preco === null) {
    return res.status(400).json({ success: false, message: 'cardapio_id, nome e preco são obrigatórios.' });
  }

  try {
    const { data: cardapioCheck, error: cardapioCheckError } = await supabase
      .from('cardapios')
      .select('restaurante_id')
      .eq('id', Number(cardapio_id))
      .single();

    if (cardapioCheckError || !cardapioCheck || cardapioCheck.restaurante_id !== Number(req.user.restaurantId)) {
      console.error('Tentativa de adicionar produto a cardápio não autorizado ou inexistente:', { cardapio_id, userRestaurantId: req.user.restaurantId });
      return res.status(403).json({ success: false, message: 'Acesso negado. O cardápio especificado não pertence ao seu restaurante ou não existe.' });
    }

    if (imageFile) {
        const fileExtension = imageFile.originalname.split('.').pop();
        const fileName = `${Date.now()}-${req.user.restaurantId}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
        const filePath = `product-images/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabaseServiceRole.storage
            .from('cardapio-fotos-app')
            .upload(filePath, imageFile.buffer, {
                contentType: imageFile.mimetype,
                upsert: false
            });

        if (uploadError) {
            console.error('Erro ao fazer upload da imagem para o Supabase Storage:', uploadError);
            return res.status(500).json({ success: false, message: 'Erro ao fazer upload da imagem.' });
        }

        const { data: publicUrlData } = supabaseServiceRole.storage
            .from('cardapio-fotos-app')
            .getPublicUrl(filePath);
            

        imageUrl = publicUrlData.publicUrl;
        console.log("Imagem uploaded com sucesso:", imageUrl);
    }

    const { data, error } = await supabase
      .from('itens_cardapio')
      .insert([
        {
          cardapio_id: Number(cardapio_id),
          nome,
          preco: Number.parseFloat(preco),
          descricao: descricao || null,
          disponivel: typeof disponivel === 'boolean' ? disponivel : true,
          imagem: imageUrl || null,
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json({ success: true, message: 'Produto adicionado com sucesso!', produto: data[0] });
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    res.status(500).json({ success: false, message: 'Erro ao adicionar produto.' });
  }
});

// PUT /api/produtos/:id - Editar um produto existente
app.put('/api/produtos/:id', authenticateToken, authorizeRestaurantAdmin, upload.single('imagem'), async (req, res) => {
  const { id } = req.params;
  const { nome, preco, descricao, disponivel, imagemUrlExistente } = req.body;
  const imageFile = req.file;

  let imageUrl = imagemUrlExistente;

  if (!nome || preco === undefined || preco === null) {
    return res.status(400).json({ success: false, message: 'Nome e preco são obrigatórios para atualização.' });
  }

  try {
    const { data: produtoExistente, error: produtoError } = await supabase
      .from('itens_cardapio')
      .select('cardapio_id, imagem')
      .eq('id', id)
      .single();

    if (produtoError || !produtoExistente) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado.' });
    }

    const { data: cardapioCheck, error: cardapioCheckError } = await supabase
      .from('cardapios')
      .select('restaurante_id')
      .eq('id', produtoExistente.cardapio_id)
      .single();

    if (cardapioCheckError || !cardapioCheck || cardapioCheck.restaurante_id !== Number(req.user.restaurantId)) {
      console.error('Tentativa de editar produto não autorizado:', { produtoId: id, userRestaurantId: req.user.restaurantId });
      return res.status(403).json({ success: false, message: 'Acesso negado. Você não tem permissão para editar este produto.' });
    }

    if (imageFile) {
        const fileExtension = imageFile.originalname.split('.').pop();
        const fileName = `${Date.now()}-${req.user.restaurantId}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
        const filePath = `product-images/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabaseServiceRole.storage
            .from('cardapio-fotos-app')
            .upload(filePath, imageFile.buffer, {
                contentType: imageFile.mimetype,
                upsert: true
            });

        if (uploadError) {
            console.error('Erro ao fazer upload da nova imagem para o Supabase Storage:', uploadError);
            return res.status(500).json({ success: false, message: 'Erro ao fazer upload da nova imagem.' });
        }

        const { data: publicUrlData } = supabaseServiceRole.storage
            .from('cardapio-fotos-app')
            .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
        console.log("URL da imagem gerada pelo Supabase:", imageUrl);
        console.log("Nova imagem uploaded com sucesso:", imageUrl);

        if (produtoExistente.imagem && produtoExistente.imagem.includes(supabaseUrl) && !produtoExistente.imagem.includes("via.placeholder.com")) {
            try {
                const oldFilePath = produtoExistente.imagem.split('/public/')[1];
                if (oldFilePath) {
                    await supabaseServiceRole.storage.from('cardapio-fotos-app').remove([oldFilePath]);
                    console.log("Imagem antiga removida:", oldFilePath);
                }
            } catch (removeError) {
                console.warn("Não foi possível remover a imagem antiga do storage:", removeError);
            }
        }
    }

    const { data, error } = await supabase
      .from('itens_cardapio')
      .update({
        nome,
        preco: Number.parseFloat(preco),
        descricao,
        disponivel,
        imagem: imageUrl,
      })
      .eq('id', id)
      .select();

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
app.delete('/api/produtos/:id', authenticateToken, authorizeRestaurantAdmin, async (req, res) => {
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

  if (cardapioCheckError || !cardapioCheck || cardapioCheck.restaurante_id !== req.user.restaurantId) {
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
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Rota pública para obter itens de cardápio de um restaurante
app.get('/api/public/cardapio/:restauranteId', async (req, res) => {
  const { restauranteId } = req.params;
  const { busca } = req.query; // Para futura funcionalidade de busca pública, se desejar

  try {
    // 1. Encontrar o(s) ID(s) do cardápio(s) associado(s) a este restaurante
    const { data: cardapiosDoRestaurante, error: cardapiosError } = await supabase
      .from('cardapios')
      .select('id')
      .eq('restaurante_id', Number(restauranteId)); // Garanta que o ID é tratado como número

    if (cardapiosError) {
      console.error('Erro ao buscar cardápios do restaurante (público):', cardapiosError);
      return res.status(500).json({ success: false, message: 'Erro ao buscar cardápios do restaurante.' });
    }

    if (cardapiosDoRestaurante.length === 0) {
      return res.status(200).json({ success: true, produtos: [], message: 'Nenhum cardápio encontrado para este restaurante.' });
    }

    const cardapioIds = cardapiosDoRestaurante.map(c => c.id);

    // 2. Buscar itens de cardápio (produtos) associados a esses cardápios
    let query = supabase
      .from('itens_cardapio')
      .select('*')
      .in('cardapio_id', cardapioIds)
      .eq('disponivel', true); // <<<<< NOVO: Mostrar apenas produtos disponíveis ao público

    if (busca) {
      query = query.ilike('nome', `%${busca}%`);
    }

    const { data: produtos, error: produtosError } = await query;

    if (produtosError) {
      console.error('Erro ao buscar produtos do cardápio (público):', produtosError);
      return res.status(500).json({ success: false, message: 'Erro ao buscar produtos.' });
    }

    res.status(200).json({ success: true, produtos: produtos });

  } catch (error) {
    console.error('Erro na rota pública de cardápio:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
});