const db = require('../database/db');

// Criar uma transação (empréstimo ou troca)
exports.criarTransacao = async (req, res) => {
    const { id_livro, id_donatario, tipo } = req.body;

    try {
        const sql = `
            INSERT INTO transacoes (id_livro, id_donatario, tipo, status, data_inicio)
            VALUES (?, ?, ?, ?, NOW())
        `;

        await db.query(sql, [id_livro, id_donatario, tipo, 'pendente']);

        res.status(201).json({ message: 'Solicitação registrada!' });
    } catch (error) {
        console.error('ERRO ao criar transação:', error);
        res.status(500).json({ message: 'Erro ao criar transação' });
    }
};

// Atualizar status de uma transação
exports.atualizarStatus = async (req, res) => {
    const { id } = req.params;
    const { status, data_fim } = req.body;

    try {
        const sql = `
            UPDATE transacoes SET status = ?, data_fim = ?
            WHERE id = ?
        `;

        const dataFinal = data_fim || new Date();

        await db.query(sql, [status, dataFinal, id]);

        res.status(200).json({ message: 'Status atualizado com sucesso!' });
    } catch (error) {
        console.error("Erro atualizar status:", error);
        res.status(500).json({ message: 'Erro ao atualizar status' });
    }
};

// Listar histórico do usuário
exports.listarHistoricoUsuario = async (req, res) => {
    const { idUsuario } = req.params;

    try {
        const sql = `
            SELECT
                t.id,
                DATE_FORMAT(t.data_inicio, '%d/%m/%Y %H:%i') AS data_inicio,
                DATE_FORMAT(t.data_fim, '%d/%m/%Y %H:%i') AS data_fim,
                t.status,
                t.tipo,
                l.titulo
            FROM transacoes t
            JOIN livros l ON t.id_livro = l.id
            WHERE t.id_donatario = ? OR l.id_responsavel = ?
            ORDER BY t.data_inicio DESC
        `;

        const [rows] = await db.query(sql, [idUsuario, idUsuario]);

        res.status(200).json(rows);

    } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        res.status(500).json({ message: 'Erro ao carregar histórico' });
    }
};
