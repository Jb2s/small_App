require('dotenv').config();
const User = require('../models/User'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const addUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
       message: 'Tous les champs sont requis.', 
       isError: true, 
       code: 'U000' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ 
        message: 'L\'utilisateur existe déjà.',
        isError: true,
        code: 'U100' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ message: 'Utilisateur créé avec succès.', user: newUser });
  } 
  catch (error) 
  {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    return res.status(500).json({ 
      message: 'Erreur interne du serveur.', 
      isError: true,
      code: 'S000' });
  }
};

const authenticateUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        return res.status(401).json({ 
          message: 'Email ou mot de passe incorrect.', 
          isError: true,
          code: 'U010' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          message: 'Email ou mot de passe incorrect.', 
          isError: true,
          code: 'U010' });
      }
  
      const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
  
      return res.status(200).json({ token });
      
    } 
    catch (error) 
    {
      console.error('Erreur lors de l\'authentification:', error);
      return res.status(500).json({ 
        message: 'Erreur interne du serveur.', 
        isError: true,
        code: 'S000' });
    }
  };

module.exports = { 
  addUser, 
  authenticateUser,
 };