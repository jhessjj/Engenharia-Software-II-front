// seleciona o container principal
const listaLivros = document.getElementById('listaLivros');

// carrega os livros salvos no localStorage ao abrir a pag
document.addEventListener('DOMContentLoaded', () => {
  const livrosSalvos = JSON.parse(localStorage.getItem('meusLivros')) || [];
  if (livrosSalvos.length > 0) {
    listaLivros.innerHTML = ''; 
    livrosSalvos.forEach(livro => criarCardLivro(livro));
  } else {
    listaLivros.innerHTML = '<p>Nenhum livro cadastrado ainda 📚</p>';
  }
});

// funcao para criar o card de livro 
function criarCardLivro(livro) {
  const div = document.createElement('div');
  div.classList.add('livro');

  div.innerHTML = `
    <img src="${livro.imagem}" alt="${livro.titulo}">
    <h4>${livro.titulo}</h4>
    <p><strong>Tipo:</strong> ${livro.tipo}</p>
    <p><strong>Localização:</strong> ${livro.localizacao}</p>
    <p><strong>Contato:</strong> ${livro.contato}</p>
    <div class="botoes">
      <button class="editar">Editar</button>
      <button class="remover">Remover</button>
      <button class="emprestado">Emprestado</button>
      <button class="trocado">Trocado</button>
      <button class="devolvido">Devolvido</button>
    </div>
  `;

  // botoes basicos
  div.querySelector('.remover').addEventListener('click', () => removerLivro(livro.titulo));
  div.querySelector('.editar').addEventListener('click', () => editarLivro(livro.titulo));

  // botaes de açoes (historico)
  div.querySelector('.emprestado').addEventListener('click', () => registrarAcao(livro, 'emprestado'));
  div.querySelector('.trocado').addEventListener('click', () => registrarAcao(livro, 'trocado'));
  div.querySelector('.devolvido').addEventListener('click', () => registrarAcao(livro, 'devolvido'));


  const btnEmprestado = div.querySelector('.emprestado');
const btnTrocado = div.querySelector('.trocado');
const btnDevolvido = div.querySelector('.devolvido');

// cores botoes
btnEmprestado.style.backgroundColor = '#3498db';
btnEmprestado.style.color = 'white';

btnTrocado.style.backgroundColor = '#f39c12';
btnTrocado.style.color = 'white';

btnDevolvido.style.backgroundColor = '#ae276fff';
btnDevolvido.style.color = 'white';

  listaLivros.appendChild(div);
}

// funçao para remover livro
function removerLivro(titulo) {
  if (confirm(`Deseja remover o livro "${titulo}"?`)) {
    let livros = JSON.parse(localStorage.getItem('meusLivros')) || [];
    livros = livros.filter(l => l.titulo !== titulo);
    localStorage.setItem('meusLivros', JSON.stringify(livros));
    location.reload();
  }
}

// funçao para editar (abre prompt)
function editarLivro(titulo) {
  let livros = JSON.parse(localStorage.getItem('meusLivros')) || [];
  const livro = livros.find(l => l.titulo === titulo);

  if (!livro) return alert('Livro não encontrado.');

  const novoTitulo = prompt('Novo título:', livro.titulo) || livro.titulo;
  const novoTipo = prompt('Novo tipo (Troca / Empréstimo):', livro.tipo) || livro.tipo;
  const novaLocalizacao = prompt('Nova localização:', livro.localizacao) || livro.localizacao;
  const novoContato = prompt('Novo contato:', livro.contato) || livro.contato;

  livro.titulo = novoTitulo;
  livro.tipo = novoTipo;
  livro.localizacao = novaLocalizacao;
  livro.contato = novoContato;

  localStorage.setItem('meusLivros', JSON.stringify(livros));
  location.reload();
}

// historico acoes
function registrarAcao(livro, acao) {
  const historico = JSON.parse(localStorage.getItem('historicoLivros')) || [];

  const registro = {
    titulo: livro.titulo,
    acao: acao,
    data: new Date().toLocaleString('pt-BR')
  };

  historico.push(registro);
  localStorage.setItem('historicoLivros', JSON.stringify(historico));

  alert(`✅ Livro "${livro.titulo}" marcado como ${acao}.`);
}

// botao de adicionar
const botaoAdd = document.getElementById('btnAdd');
botaoAdd.addEventListener('click', () => {
  window.location.href = 'addlivro2.html';
});
