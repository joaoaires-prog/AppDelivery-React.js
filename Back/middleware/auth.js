// middleware/auth.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Erro na verificação do token:', err);
      return res.status(403).json({ message: 'Token inválido ou expirado.' });
    }
    req.user = user; // Armazena as informações do usuário no objeto de requisição
    console.log("LOG AUTHMIDDLEWARE: req.user (decodificado do token):", req.user); // <--- LOG ADICIONADO
    next();
  });
};

export const authorizeRestaurantAdmin = (req, res, next) => {
  console.log("LOG AUTHORIZEMIDDLEWARE: Verificando autorização..."); // <--- LOG ADICIONADO
  console.log("LOG AUTHORIZEMIDDLEWARE: req.user.role:", req.user?.role); // <--- LOG ADICIONADO
  console.log("LOG AUTHORIZEMIDDLEWARE: req.user.restaurantId:", req.user?.restaurantId); // <--- LOG ADICIONADO
  // req.params.restauranteId só existe nas rotas específicas que o utilizam, então não logamos aqui globalmente.

  if (!req.user || req.user.role !== 'admin' || !req.user.restaurantId) {
    console.log("LOG AUTHORIZEMIDDLEWARE: Acesso negado - Condição falhou."); // <--- LOG ADICIONADO
    return res.status(403).json({ message: 'Acesso negado. Apenas administradores de restaurante podem realizar esta ação.' });
  }
  console.log("LOG AUTHORIZEMIDDLEWARE: Autorização básica concedida."); // <--- LOG ADICIONADO
  next();
};