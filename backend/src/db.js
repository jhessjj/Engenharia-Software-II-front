// backend/src/db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',      
    password: 'P3dr005!', // <--- CONFIRA SUA SENHA
    database: 'bookshare',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// A MÁGICA ESTÁ AQUI EMBAIXO:
// Temos que exportar com .promise() para poder usar o 'await' no controller
module.exports = pool.promise();