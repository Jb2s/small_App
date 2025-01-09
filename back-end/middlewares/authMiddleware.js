require('dotenv').config();
const jwt = require('jsonwebtoken'); 
const { User } = require('../models'); 

const authenticate = (req, res, next) => {
 
  const token = req.headers['authorization']?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
  }

  try {
    
    const decoded = jwt.verify(token, process.env.SECRET_KEY); 
    req.user = { id: decoded.id };  
    next(); 
  }
   catch (error) 
  {
    console.error('Erreur d\'authentification:', error);
    return res.status(401).json({ message: 'Token invalide.' });
  }
};

module.exports = authenticate;