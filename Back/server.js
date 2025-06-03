

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


const JWT_SECRET = process.env.JWT_SECRET;

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

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});