const express = require('express');
const router = express.Router();
const transacoesController = require('../controllers/transacoesController');

router.post('/', transacoesController.criarTransacao); 
// Exemplo de uso para atualizar: PUT http://localhost:3000/transacoes/5
router.put('/:id', transacoesController.atualizarStatus); 

// GET http://localhost:3000/transacoes/usuario/1
router.get('/usuario/:idUsuario', transacoesController.listarHistoricoUsuario);
module.exports = router;