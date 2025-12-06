const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const livrosRoutes = require('./routes/livrosRoutes');
const transacoesRoutes = require('./routes/transacoesRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// ROTAS DA APLICAÇÃO
app.use('/auth', authRoutes);
app.use('/livros', livrosRoutes);
app.use('/transacoes', transacoesRoutes);

// Rota teste
app.get('/', (req, res) => {
    res.send('Servidor funcionando!');
});

module.exports = app;
