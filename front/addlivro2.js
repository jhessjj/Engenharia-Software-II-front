
const form = document.querySelector('.formulario');

// quando o formulario for enviado
form.addEventListener('submit', (event) => {
  event.preventDefault(); // impede o reload da pagina

  // pega os valores dos campos
  const titulo = document.querySelector('#titulo').value.trim();
  const local = document.querySelector('#local').value.trim();
  const telefone = document.querySelector('#telefone').value.trim();
  const tipo = document.querySelector('#tipo').value;
  const foto = document.querySelector('#foto').value.trim() || 'semcapa.jpg'; // imagem padrao caso vazio

  // verificacao simples
  if (!titulo || !local || !telefone) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  // cria o objeto do novo livro
  const novoLivro = {
    titulo: titulo,
    localizacao: local,
    contato: telefone,
    tipo: tipo,
    imagem: foto
  };

  // recupera os livros existentes (ou cria uma lista vazia)
  const livrosSalvos = JSON.parse(localStorage.getItem('meusLivros')) || [];

  // adiciona o novo livro
  livrosSalvos.push(novoLivro);

  // salva no localStorage
  localStorage.setItem('meusLivros', JSON.stringify(livrosSalvos));

  // confirmacaao visual
  alert('📚 Livro adicionado com sucesso!');

  // redireciona para a pagina 
  window.location.href = 'addlivro.html';
});
