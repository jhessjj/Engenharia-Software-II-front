const express = require('express');
const router = express.Router();
const livrosController = require('../controllers/livrosController');

router.get('/', livrosController.listarLivros); // GET http://localhost:3000/livros
router.post('/', livrosController.adicionarLivro); // POST http://localhost:3000/livros

router.get('/', livrosController.listarLivros); // Todos (Home)
router.post('/', livrosController.adicionarLivro); // Adicionar
router.get('/usuario/:idUsuario', livrosController.listarLivrosDoUsuario); // <--- NOVA ROTA: Meus Livros

module.exports = router;