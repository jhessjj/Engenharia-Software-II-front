document.addEventListener('DOMContentLoaded', () => {
    // Pega o formulário pelo ID que acabamos de adicionar
    const form = document.getElementById('formAddLivro');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // 1. Verifica se tem usuário logado
        const idUsuario = localStorage.getItem('userId');
        
        if (!idUsuario) {
            alert("Sessão expirada. Faça login novamente.");
            window.location.href = 'login.html';
            return;
        }

        // 2. Captura os dados (usando os IDs do SEU HTML)
        const titulo = document.getElementById('titulo').value;
        const local = document.getElementById('local').value;     // No HTML é 'local'
        const telefone = document.getElementById('telefone').value;
        const tipo = document.getElementById('tipo').value;
        const foto = document.getElementById('foto').value;       // No HTML é 'foto'

        // 3. Monta o objeto com os nomes que o BANCO DE DADOS espera
        const dadosLivro = {
            titulo: titulo,
            localizacao: local,           // Envia 'local' como 'localizacao'
            telefone_contato: telefone,   // Envia como 'telefone_contato'
            tipo: tipo,
            url_capa: foto,               // Envia 'foto' como 'url_capa'
            id_responsavel: idUsuario
        };

        console.log("Enviando para o servidor:", dadosLivro);

        try {
            const response = await fetch('http://localhost:3000/livros', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosLivro)
            });

            const resultado = await response.json();

            if (response.ok) {
                alert('Livro adicionado com sucesso!');
                window.location.href = 'addlivro.html'; // Volta para a lista
            } else {
                alert('Erro ao salvar: ' + resultado.message);
                console.error(resultado);
            }

        } catch (error) {
            console.error('Erro na conexão:', error);
            alert('Erro ao conectar com o servidor.');
        }
    });
});