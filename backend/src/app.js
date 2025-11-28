const express = require('express');
const cors = require('cors');
const db = require('./db'); // importa o banco

const app = express();

app.use(express.json());
app.use(cors());

// rota de teste
app.get('/', (req, res) => {
  db.query('SELECT NOW() AS hora', (err, results) => {
    if (err) {
      res.status(500).json({ erro: err });
      return;
    }
    res.json({ message: "API funcionando!", banco: results[0] });
  });
});

module.exports = app;
