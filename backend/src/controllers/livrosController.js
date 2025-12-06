const db = require('../database/db');

// Listar todos os livros (para a Home)
exports.listarLivros = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM livros');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar livros' });
    }
};

// Adicionar um novo livro
exports.adicionarLivro = async (req, res) => {
    console.log("--- TENTATIVA DE ADD LIVRO ---");
    console.log("Dados recebidos:", req.body); // <--- VAI MOSTRAR O QUE CHEGOU

    const { titulo, localizacao, telefone_contato, tipo, url_capa, id_responsavel } = req.body;

    // Validação básica
    if (!titulo || !id_responsavel) {
        console.log("Erro: Falta titulo ou id_responsavel");
        return res.status(400).json({ message: 'Dados incompletos (título ou ID do usuário faltando)' });
    }

    try {
        const sql = `
            INSERT INTO livros (titulo, localizacao, telefone_contato, tipo, url_capa, id_responsavel) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        await db.query(sql, [titulo, localizacao, telefone_contato, tipo, url_capa, id_responsavel]);
        
        console.log("Livro salvo com sucesso!");
        res.status(201).json({ message: 'Livro adicionado com sucesso!' });
    } catch (error) {
        console.error("ERRO SQL AO SALVAR LIVRO:", error); // <--- VAI MOSTRAR O ERRO DO BANCO
        res.status(500).json({ message: 'Erro no banco de dados', error: error.message });
    }
};

exports.listarLivrosDoUsuario = async (req, res) => {
    const { idUsuario } = req.params; // Vamos pegar o ID pela URL

    try {
        const sql = 'SELECT * FROM livros WHERE id_responsavel = ?';
        const [rows] = await db.query(sql, [idUsuario]);
        
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar seus livros' });
    }
};