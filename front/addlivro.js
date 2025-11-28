document.addEventListener('DOMContentLoaded', async () => {
    // 1. Elementos do HTML
    const listaLivros = document.getElementById('listaLivros');
    const btnAdd = document.getElementById('btnAdd');

    // 2. Verifica se tem usuário logado
    const idUsuario = localStorage.getItem('userId');

    if (!idUsuario) {
        alert('Você precisa fazer login!');
        window.location.href = 'login.html';
        return;
    }

    // 3. Configura o botão de Adicionar (+)
    btnAdd.addEventListener('click', () => {
        window.location.href = 'addlivro2.html'; // Vai para o formulário
    });

    // 4. Busca os livros no Backend
    try {
        const response = await fetch(`http://localhost:3000/livros/usuario/${idUsuario}`);
        const livros = await response.json();

        // Limpa a lista antes de preencher (para evitar duplicatas se recarregar)
        listaLivros.innerHTML = '';

        if (livros.length === 0) {
            listaLivros.innerHTML = '<p style="text-align:center; color: white;">Você ainda não cadastrou nenhum livro.</p>';
            return;
        }

        // 5. Cria os cards para cada livro
        livros.forEach(livro => {
            const card = document.createElement('div');
            card.className = 'card-livro'; // Classe para estilizar no CSS

            // Aqui montamos o HTML de cada livro
            card.innerHTML = `
                <div class="info-livro">
                    <h3>${livro.titulo}</h3>
                    <p><strong>Local:</strong> ${livro.localizacao}</p>
                    <p><strong>Tipo:</strong> ${livro.tipo.toUpperCase()}</p>
                    <p><strong>Status:</strong> Disponível</p>
                </div>
                <div class="acoes-livro">
                    <button class="btn-delete" onclick="deletarLivro(${livro.id})">🗑️</button>
                </div>
            `;

            listaLivros.appendChild(card);
        });

    } catch (error) {
        console.error('Erro ao buscar livros:', error);
        listaLivros.innerHTML = '<p>Erro ao carregar seus livros.</p>';
    }
});

// Função extra para deletar (opcional por enquanto)
function deletarLivro(idLivro) {
    if(confirm("Tem certeza que deseja remover este livro?")) {
        // Futuramente você implementa a chamada DELETE pro backend aqui
        console.log("Deletar livro ID:", idLivro);
        alert("Função de deletar será implementada em breve!");
    }
}