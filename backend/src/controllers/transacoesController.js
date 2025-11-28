const db = require('../db');

// Criar um pedido de empréstimo ou troca
exports.criarTransacao = async (req, res) => {
    const { id_livro, id_donatario, tipo } = req.body;

    try {
        // Verifica se o livro já não está emprestado
        // (Lógica opcional, mas recomendada: verificar status na tabela transacoes antes)
        
        const sql = 'INSERT INTO transacoes (id_livro, id_donatario, tipo) VALUES (?, ?, ?)';
        await db.query(sql, [id_livro, id_donatario, tipo]);

        res.status(201).json({ message: 'Solicitação realizada com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao solicitar livro' });
    }
};

// Atualizar status (Ex: marcar como devolvido)
exports.atualizarStatus = async (req, res) => {
    const { id } = req.params; // Pega o ID da transação da URL
    const { status, data_fim } = req.body; // 'concluida', 'atrasada', etc.

    try {
        const sql = 'UPDATE transacoes SET status = ?, data_fim = ? WHERE id = ?';
        // Se data_fim não for enviada, podemos usar NOW() do mysql ou new Date() do JS
        const dataFinal = data_fim || new Date(); 

        await db.query(sql, [status, dataFinal, id]);
        res.status(200).json({ message: 'Status atualizado!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar status' });
    }
};

exports.listarHistoricoUsuario = async (req, res) => {
    const { idUsuario } = req.params;

    try {
        // Essa Query é poderosa:
        // 1. Pega dados da transação (data, status, tipo)
        // 2. Pega o titulo do livro (JOIN livros)
        // 3. Filtra onde o usuário é DONO do livro OU quem PEGOU o livro
        const sql = `
            SELECT 
                t.id, 
                t.data_inicio, 
                t.data_fim, 
                t.status, 
                t.tipo, 
                l.titulo, 
                l.id_responsavel 
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

exports.responderSolicitacao = async (req, res) => {
    const { id } = req.params;
    const { acao, tipoLivro } = req.body; 

    let novoStatus = '';
    let dataFim = null;

    if (acao === 'recusar') {
        novoStatus = 'recusada'; // O front vai filtrar e não mostrar
        dataFim = new Date();
    } 
    else if (acao === 'aceitar') {
        // REGRA DE OURO:
        if (tipoLivro === 'troca') {
            novoStatus = 'concluida'; // Troca aceita já era, acabou.
            dataFim = new Date();
        } else {
            novoStatus = 'aceito'; // Empréstimo aceito fica pendente de devolução
        }
    } 
    else if (acao === 'devolver') {
        novoStatus = 'concluida'; // Empréstimo devolvido acaba aqui
        dataFim = new Date();
    }

    try {
        const sql = 'UPDATE transacoes SET status = ?, data_fim = ? WHERE id = ?';
        await db.query(sql, [novoStatus, dataFim, id]);
        res.status(200).json({ message: 'Ok' });
    } catch (error) {
        res.status(500).json({ message: 'Erro' });
    }
};