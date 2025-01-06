const express = require('express');
const router = express.Router();

const { 
    authenticateUser, 
    addUser, 
} = require('../controllers/userControllers');

router.post('/login', authenticateUser);
router.post('/register', addUser);

module.exports = router; 
