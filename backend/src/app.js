const express = require('express');
const cors = require('cors');

// Importa as rotas
const authRoutes = require('./routes/authRoutes');
const livrosRoutes = require('./routes/livrosRoutes');         // <--- NOVO
const transacoesRoutes = require('./routes/transacoesRoutes'); // <--- NOVO

const app = express();

app.use(cors());
app.use(express.json());

// Define os prefixos das rotas
app.use('/auth', authRoutes);
app.use('/livros', livrosRoutes);         // <--- Tudo de livro começa com /livros
app.use('/transacoes', transacoesRoutes); // <--- Tudo de transação começa com /transacoes

module.exports = app;