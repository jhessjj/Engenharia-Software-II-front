// 1. Seleciona elementos da página
const campoBusca = document.querySelector('.busca input');
const botaoBusca = document.querySelector('.busca button');
const filtroCidade = document.querySelector('#cidade');
const filtroGenero = document.querySelector('#genero');
const filtroTipo = document.querySelector('#tipo');
const listaLivros = document.querySelector('.lista-livros');

// 2. Carrega livros do BACKEND ao abrir a página
document.addEventListener('DOMContentLoaded', async () => {
    
    // Verifica login
    const meuId = localStorage.getItem('userId');
    if (!meuId) {
        window.location.href = 'login.html';
        return;
    }

    try {
        // Busca todos os livros no servidor
        const response = await fetch('http://localhost:3000/livros');
        const todosLivros = await response.json();

        listaLivros.innerHTML = ''; // Limpa a lista antes de renderizar

        // Filtra: Mostra apenas livros que NÃO são meus
        const livrosDaComunidade = todosLivros.filter(livro => livro.id_responsavel != meuId);

        if (livrosDaComunidade.length > 0) {
            livrosDaComunidade.forEach(livro => criarCardLivro(livro));
        } else {
            listaLivros.innerHTML = '<p style="text-align:center; padding:20px;">Nenhum livro disponível na comunidade no momento 📚</p>';
        }

    } catch (error) {
        console.error("Erro ao buscar livros:", error);
        listaLivros.innerHTML = '<p>Erro ao carregar livros. Verifique se o servidor está rodando.</p>';
    }
});


// 3. Função para criar o card de cada livro
// front/home.js

function criarCardLivro(livro) {
    const div = document.createElement('div');
    div.classList.add('livro'); 

    const imagemCapa = livro.url_capa ? livro.url_capa : 'https://via.placeholder.com/150x200?text=Sem+Capa';

    div.innerHTML = `
        <img src="${imagemCapa}" alt="${livro.titulo}">
        <h4>${livro.titulo}</h4>
        <p><strong>Localização:</strong> ${livro.localizacao}</p>
        <p><strong>Contato:</strong> ${livro.telefone_contato}</p>
        <p><strong>Tipo:</strong> ${livro.tipo}</p>
        <div class="botoes">
            <button class="btn-acao btn-${livro.tipo.toLowerCase()}">Eu Quero no WhatsApp</button>
        </div>
    `;

    // --- LÓGICA DO CLIQUE (AUTOMATIZAÇÃO) ---
    const botao = div.querySelector('.btn-acao');
    
    botao.addEventListener('click', async () => {
        const meuId = localStorage.getItem('userId');
        
        // 1. Confirmação simples
        if(!confirm("Ao clicar em OK, enviaremos uma solicitação formal para o dono no sistema e abriremos o WhatsApp. Deseja continuar?")) {
            return;
        }

        // 2. Tenta registrar a solicitação no banco
        try {
            await fetch('http://localhost:3000/transacoes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_livro: livro.id,
                    id_donatario: meuId,
                    tipo: livro.tipo,
                    status: 'solicitado' // <--- STATUS INICIAL
                })
            });
            // Não precisamos bloquear se der erro, o importante é abrir o zap, 
            // mas é bom registrar que tentamos.
            console.log("Solicitação registrada no sistema.");

        } catch (error) {
            console.error("Erro ao registrar solicitação:", error);
        }

        // 3. Abre o WhatsApp (Lógica original)
        let numero = livro.telefone_contato.replace(/\D/g, '');
        if (!numero.startsWith('55') && numero.length <= 11) numero = '55' + numero;

        const mensagem = encodeURIComponent(
            `Olá! Vi o livro "${livro.titulo}" no BookShare e acabei de enviar uma solicitação pelo site. Podemos combinar a ${livro.tipo}?`
        );

        window.open(`https://wa.me/${numero}?text=${mensagem}`, '_blank');
    });

    listaLivros.appendChild(div);
}


// 4. Função de busca e filtros (Mantive sua lógica, funciona muito bem!)
function filtrarLivros() {
    const textoBusca = campoBusca.value.toLowerCase();
    const cidade = filtroCidade.value.toLowerCase();
    const genero = filtroGenero.value.toLowerCase(); // Obs: Seu banco ainda não tem coluna genero, então esse filtro não vai achar nada por enquanto
    const tipo = filtroTipo.value.toLowerCase();

    const livrosCards = Array.from(document.querySelectorAll('.livro'));

    livrosCards.forEach(livroCard => {
        const titulo = livroCard.querySelector('h4').textContent.toLowerCase();
        const info = livroCard.textContent.toLowerCase();

        let visivel = true;

        // Filtro de busca (Título)
        if (textoBusca && !titulo.includes(textoBusca)) visivel = false;

        // Filtro por cidade
        if (cidade && !info.includes(cidade)) visivel = false;

        // Filtro por tipo (Troca / Empréstimo)
        // A lógica aqui verifica se o texto do botão ou do card contém o tipo selecionado
        if (tipo !== 'todos' && !info.includes(tipo)) visivel = false;

        livroCard.style.display = visivel ? 'block' : 'none';
    });
}


// 5. Eventos de busca e filtros
botaoBusca.addEventListener('click', filtrarLivros);
campoBusca.addEventListener('keyup', e => {
    if (e.key === 'Enter') filtrarLivros();
});
filtroCidade.addEventListener('input', filtrarLivros);
filtroGenero.addEventListener('change', filtrarLivros);
filtroTipo.addEventListener('change', filtrarLivros);