const express = require('express');
const router = express.Router();
const transacoesController = require('../controllers/transacoesController');

// 1️⃣ ROTAS ESPECÍFICAS PRIMEIRO
router.get('/usuario/:idUsuario', transacoesController.listarHistoricoUsuario);

// 2️⃣ Depois rotas gerais
router.post('/', transacoesController.criarTransacao);
router.put('/:id', transacoesController.atualizarStatus);

module.exports = router;
