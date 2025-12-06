// backend/src/controllers/authController.js
const db = require('../database/db');


exports.cadastrarUsuario = async (req, res) => {
    // --- ADICIONE ESSES LOGS AQUI ---
    console.log("1. Tentativa de cadastro iniciada.");
    console.log("2. Dados recebidos do Front:", req.body);
    // --------------------------------

    const { nome, user, senha, telefone } = req.body;

    try {
        // Verifica se usuário já existe
        const [rows] = await db.query('SELECT * FROM users WHERE user = ?', [user]);
        
        if (rows.length > 0) {
            console.log("3. Erro: Usuário já existe."); // Log de erro
            return res.status(400).json({ message: 'Usuário já existe!' });
        }

        const sql = 'INSERT INTO users (nome, user, senha, telefone) VALUES (?, ?, ?, ?)';
        
        // --- ADICIONE ESTE LOG ---
        console.log("4. Tentando salvar no banco...");
        
        const [result] = await db.query(sql, [nome, user, senha, telefone]);
        
        console.log("5. Sucesso! ID gerado:", result.insertId); // Log de sucesso
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });

    } catch (error) {
        // --- LOG IMPORTANTE DE ERRO ---
        console.error("ERRO GRAVE NO BANCO:", error); 
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

exports.loginUsuario = async (req, res) => {
    // 1. O que chegou do site?
    console.log("--- TENTATIVA DE LOGIN ---");
    console.log("Dados recebidos:", req.body);

    const { user, senha } = req.body;

    try {
        // 2. O que o banco encontrou?
        const sql = 'SELECT * FROM users WHERE user = ? AND senha = ?';
        const [rows] = await db.query(sql, [user, senha]);

        console.log("Usuários encontrados:", rows.length); // Se for 0, login falhou

        if (rows.length > 0) {
            const usuario = rows[0];
            // Sucesso
            res.status(200).json({ 
                message: 'Login realizado!', 
                userId: usuario.id, 
                nome: usuario.nome 
            });
        } else {
            // Falha
            res.status(401).json({ message: 'Usuário ou senha incorretos' });
        }
    } catch (error) {
        console.error("Erro no Login:", error);
        res.status(500).json({ message: 'Erro ao fazer login' });
    }
};