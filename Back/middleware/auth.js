import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Validação crítica do JWT_SECRET
if (!JWT_SECRET) {
  console.error('ERRO FATAL: JWT_SECRET não configurado nas variáveis de ambiente');
  process.exit(1);
}

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Token não fornecido.' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Erro na verificação do token:', err.name);
      
      // Tratamento específico por tipo de erro
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false,
          message: 'Token expirado. Faça login novamente.' 
        });
      } else if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({ 
          success: false,
          message: 'Token inválido.' 
        });
      }
      
      return res.status(403).json({ 
        success: false,
        message: 'Erro na autenticação.' 
      });
    }
    
    req.user = user;
    
    // Log apenas em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log("🔐 Usuário autenticado:", { 
        id: req.user.id, 
        role: req.user.role,
        restaurantId: req.user.restaurantId 
      });
    }
    
    next();
  });
};

export const authorizeRestaurantAdmin = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log("🛡️ Verificando autorização de admin...");
    console.log("👤 User role:", req.user?.role);
    console.log("🏪 Restaurant ID:", req.user?.restaurantId);
  }

  if (!req.user || req.user.role !== 'admin' || !req.user.restaurantId) {
    if (process.env.NODE_ENV === 'development') {
      console.log("❌ Acesso negado - não é admin do restaurante");
    }
    
    return res.status(403).json({ 
      success: false,
      message: 'Acesso negado. Apenas administradores de restaurante podem realizar esta ação.' 
    });
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.log("✅ Autorização concedida");
  }
  
  next();
};

// Novo middleware: Autenticação opcional (não quebra se não tiver token)
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Se não tem token, continua sem autenticação
  if (!token) {
    req.user = null;
    return next();
  }

  // Se tem token, tenta autenticar
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.warn('Token inválido fornecido opcionalmente:', err.name);
      req.user = null;
    } else {
      req.user = user;
    }
    next();
  });
};