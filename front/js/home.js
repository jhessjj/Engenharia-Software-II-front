// seleciona elementos da pag

const campoBusca = document.querySelector('.busca input');
const botaoBusca = document.querySelector('.busca button');
const filtroCidade = document.querySelector('#cidade');
const filtroGenero = document.querySelector('#genero');
const filtroTipo = document.querySelector('#tipo');
const listaLivros = document.querySelector('.lista-livros');

// --- FUNÇÕES DE UTILIDADE ---

// Função para carregar todos os livros do localStorage
function carregarLivros() {
  return JSON.parse(localStorage.getItem('meusLivros')) || [];
}

// Carrega livros do localStorage ao abrir a pagina
document.addEventListener('DOMContentLoaded', () => {
  const todosLivros = carregarLivros();

  // AQUI ESTÁ A CORREÇÃO: Filtra os livros para exibição na Home.
  // Apenas livros que NÃO estão 'emprestado', 'marcado' e NÃO estão 'trocado'.
  const livrosParaExibir = todosLivros.filter(livro => 
    livro.status !== 'emprestado' && 
    livro.status !== 'marcado' && 
    livro.status !== 'trocado'
  );

  if (livrosParaExibir.length > 0) {
    listaLivros.innerHTML = ''; // limpa
    livrosParaExibir.forEach(livro => criarCardLivro(livro));
  } else {
    listaLivros.innerHTML = '<p>Nenhum livro disponível para troca/empréstimo no momento 📚</p>';
  }
});


// funcao para criar o card de cada livro (mantida do original)

function criarCardLivro(livro) {
  const div = document.createElement('div');
  div.classList.add('livro');

  div.innerHTML = `
    <img src="${livro.imagem}" alt="${livro.titulo}">
    <h4>${livro.titulo}</h4>
    <p><strong>Localização:</strong> ${livro.localizacao}</p>
    <p><strong>Contato:</strong> ${livro.contato}</p>
    <p><strong>Tipo:</strong> ${livro.tipo}</p>
    <div class="botoes">
      <button class="btn-${livro.tipo.toLowerCase()}">${livro.tipo}</button>
    </div>
  `;

  // botao abre conversa no WhatsApp
  const botao = div.querySelector(`.btn-${livro.tipo.toLowerCase()}`);
  botao.addEventListener('click', () => {
    // remove tudo que nao for numero
    let numero = livro.contato.replace(/\D/g, '');

    // se nap tiver o 55 add
    if (!numero.startsWith('55')) {
      numero = '55' + numero;
    }

    // mensagem automatica
    const mensagem = encodeURIComponent(
      `Olá! Vi o livro "${livro.titulo}" no site e estou interessado(a) em uma ${livro.tipo.toLowerCase()}.`
    );

    // monta o link com o numero completo
    const link = `https://wa.me/${numero}?text=${mensagem}`;

    // abre nova aba
    window.open(link, '_blank');
  });

  listaLivros.appendChild(div);
}



//funcao de busca e filtros (mantida do original)

function filtrarLivros(){
  const textoBusca = campoBusca.value.toLowerCase();
  const cidade = filtroCidade.value.toLowerCase();
  const genero = filtroGenero.value.toLowerCase();
  const tipo = filtroTipo.value.toLowerCase();

  const livros = Array.from(document.querySelectorAll('.livro'));

  livros.forEach(livro => {
    const titulo = livro.querySelector('h4').textContent.toLowerCase();
    const info = livro.textContent.toLowerCase();

    let visivel = true;

    // filtro de busca
    if (textoBusca && !titulo.includes(textoBusca)) visivel = false;

    // filtro por cidade
    if (cidade && !info.includes(cidade)) visivel = false;

    // filtro por genero (ainda nao usado)
    if (genero !== 'todos' && !titulo.includes(genero)) visivel = false;

    // filtro por tipo
    if (tipo !== 'todos') {
      const temBotao = livro.querySelector(`.btn-${tipo.toLowerCase()}`);
      if (!temBotao) visivel = false;
    }

    livro.style.display = visivel ? 'block' : 'none';
  });
}


// eventos de busca e filtros (mantida do original)

botaoBusca.addEventListener('click', filtrarLivros);
campoBusca.addEventListener('keyup', e => {
  if (e.key === 'Enter') filtrarLivros();
});
filtroCidade.addEventListener('input', filtrarLivros);
filtroGenero.addEventListener('change', filtrarLivros);
filtroTipo.addEventListener('change', filtrarLivros);

document.getElementById("btn-sair").addEventListener("click", function (){
    
    localStorage.removeItem("token");

    
    //redirecionar para a pagina de login
    window.location.href = "../html/login.html";
});
