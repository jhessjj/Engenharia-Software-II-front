// seleciona o container principal
const listaLivros = document.getElementById('listaLivros');


//funçao para carregar todos os livros do localStorage
function carregarLivros(){
  return JSON.parse(localStorage.getItem('meusLivros')) || [];
}

//funçao para salvar a lista de livros no localStorage
function salvarLivros(livros){
  localStorage.setItem('meusLivros', JSON.stringify(livros));
}



// carrega os livros salvos no localStorage ao abrir a pag
document.addEventListener('DOMContentLoaded', () => {
  const livrosSalvos = carregarLivros();
  

  const livrosParaExibir = livrosSalvos.filter(livro => livro.status !== 'trocado');

  if (livrosParaExibir.length > 0) {
    listaLivros.innerHTML = ''; 
    livrosParaExibir.forEach(livro => criarCardLivro(livro));
  } else {
    listaLivros.innerHTML = '<p>Nenhum livro cadastrado ainda 📚</p>';
  }
});

// funcao para criar o card de livro 
function criarCardLivro(livro){
  const div = document.createElement('div');
  div.classList.add('livro');

  
  if(livro.status){
    div.classList.add(`status-${livro.status}`);
  }

  div.innerHTML = `
    <img src="${livro.imagem}" alt="${livro.titulo}">
    <h4>${livro.titulo}</h4>
    <p><strong>Tipo:</strong> ${livro.tipo}</p>
    <p><strong>Localização:</strong> ${livro.localizacao}</p>
    <p><strong>Contato:</strong> ${livro.contato}</p>
    <p><strong>Status:</strong> ${livro.status || 'disponivel'}</p>
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

  // botaes de açoes (historico e status)
  const btnEmprestado = div.querySelector('.emprestado');
  const btnTrocado = div.querySelector('.trocado');
  const btnDevolvido = div.querySelector('.devolvido');

  // logica para habilitar/desab botoes com base no status
  if (livro.status === 'emprestado' || livro.status === 'marcado') {
    btnEmprestado.disabled = true;
    btnTrocado.disabled = true;
    btnDevolvido.disabled = false;
  } else if (livro.status === 'trocado') {
    //livros trocados nao aarecem
    btnEmprestado.disabled = true;
    btnTrocado.disabled = true;
    btnDevolvido.disabled = true;
  } else { 
    btnEmprestado.disabled = false;
    btnTrocado.disabled = false;
    btnDevolvido.disabled = true;
  }

  // Ação "marcado" é tratada como "emprestado" para fins de status
  const acaoEmprestado = livro.status === 'marcado' ? 'marcado' : 'emprestado';

  btnEmprestado.addEventListener('click', () => registrarAcao(livro, acaoEmprestado));
  btnTrocado.addEventListener('click', () => registrarAcao(livro, 'trocado'));
  btnDevolvido.addEventListener('click', () => registrarAcao(livro, 'devolvido'));

  // cores botoes (mantido do original)
  btnEmprestado.style.backgroundColor = '#3498db';
  btnEmprestado.style.color = 'white';
  
  btnTrocado.style.backgroundColor = '#f39c12';
  btnTrocado.style.color = 'white';
  
  btnDevolvido.style.backgroundColor = '#ae276fff';
  btnDevolvido.style.color = 'white';

  listaLivros.appendChild(div);
}



// funçao para remover livro
function removerLivro(titulo){
  if (confirm(`Deseja remover o livro "${titulo}"?`)) {
    let livros = carregarLivros();
    livros = livros.filter(l => l.titulo !== titulo);
    salvarLivros(livros);
    location.reload();
  }
}

// funçao para editar
function editarLivro(titulo){
  let livros = carregarLivros();
  const livro = livros.find(l => l.titulo === titulo);

  if (!livro) return alert('Livro não encontrado.');

  const novoTitulo = prompt('Novo título:', livro.titulo) || livro.titulo;
  const novoTipo = prompt('Novo tipo (Troca / Empréstimo):', livro.tipo) || livro.tipo;
  const novaLocalizacao = prompt('Nova localização:', livro.localizacao) || livro.localizacao;
  const novoContato = prompt('Novo contato:', livro.contato) || livro.contato;
  //ermite editar o status
  const novoStatus = prompt('Novo status (disponivel, emprestado, trocado):', livro.status || 'disponivel') || (livro.status || 'disponivel');

  livro.titulo = novoTitulo;
  livro.tipo = novoTipo;
  livro.localizacao = novaLocalizacao;
  livro.contato = novoContato;
  livro.status = novoStatus; //adicionado campo status

  salvarLivros(livros);
  location.reload();
}

// historico acoes
function registrarAcao(livroOriginal, acao){
  let livros = carregarLivros();
  const index = livros.findIndex(l => l.titulo === livroOriginal.titulo);

  if (index === -1) return alert('Livro não encontrado na lista.');

  const livro = livros[index];

  //atualiza o status do livro
  if (acao === 'emprestado' || acao === 'marcado') {
    livro.status = acao;
  } else if (acao === 'devolvido') {
    livro.status = 'disponivel'; //volta a ficar disponível
  } else if (acao === 'trocado') {
   
    if (confirm(`ATENÇÃO: Deseja marcar o livro "${livro.titulo}" como trocado? Ele será REMOVIDO permanentemente da sua lista "Meus Livros".`)) {
      livros.splice(index, 1); //remove o livro do array
      salvarLivros(livros);
      
      
      const historico = JSON.parse(localStorage.getItem('historicoLivros')) || [];
      const registro = {
        titulo: livro.titulo,
        acao: acao,
        data: new Date().toLocaleString('pt-BR')
      };
      historico.push(registro);
      localStorage.setItem('historicoLivros', JSON.stringify(historico));

      alert(`✅ Livro "${livro.titulo}" marcado como trocado e REMOVIDO da sua lista.`);
      location.reload();
      return;
    } else {
      return; 
    }
  }
  
  
  salvarLivros(livros);

 
  const historico = JSON.parse(localStorage.getItem('historicoLivros')) || [];
  const registro = {
    titulo: livro.titulo,
    acao: acao,
    data: new Date().toLocaleString('pt-BR')
  };
  historico.push(registro);
  localStorage.setItem('historicoLivros', JSON.stringify(historico));

  alert(`✅ Livro "${livro.titulo}" marcado como ${acao}.`);
  location.reload();
}

// botao de adicionar
const botaoAdd = document.getElementById('btnAdd');
if(botaoAdd){
    botaoAdd.addEventListener('click', () => {
      window.location.href = 'addlivro2.html';
    });
}



(function migrarStatus(){
    let livros = carregarLivros();
    let precisaSalvar = false;
    livros.forEach(livro => {
        if (!livro.status) {
            livro.status = 'disponivel';
            precisaSalvar = true;
        }
    });
    if (precisaSalvar){
        salvarLivros(livros);
        console.log('livros antigos marcados como "disponivel".');
    }
})();
