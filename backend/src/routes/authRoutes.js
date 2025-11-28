const express = require('express');
const router = express.Router();

// Importa o controlador onde está a lógica (o cérebro)
const authController = require('../controllers/authController');

// Rota para Cadastrar (POST http://localhost:3000/auth/cadastro)
// Quando chegar um pedido aqui, execute a função 'cadastrarUsuario'
router.post('/cadastro', authController.cadastrarUsuario);

// Rota para Login (POST http://localhost:3000/auth/login)
// Quando chegar um pedido aqui, execute a função 'loginUsuario'
router.post('/login', authController.loginUsuario);

module.exports = router;