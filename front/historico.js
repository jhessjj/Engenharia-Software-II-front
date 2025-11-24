
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.historico-container');

  // Busca o historico salvo no localStorage
  const historico = JSON.parse(localStorage.getItem('historicoLivros')) || [];

  // Se não houver histórico
  if (historico.length === 0) {
    container.innerHTML += '<p style="margin-top:20px;">Nenhuma ação registrada ainda 📖</p>';
    return;
  }

  // Limpa a area e adiciona o título
  container.innerHTML = '<h2>Histórico de ações</h2>';

  // Cria um card para cada item do histórico
  historico.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('livro');

    // busca o livro correspondente (para pegar imagem e info)
    const livros = JSON.parse(localStorage.getItem('meusLivros')) || [];
    const livroOriginal = livros.find(l => l.titulo === item.titulo);

    const imagem = livroOriginal?.imagem || 'https://cdn-icons-png.flaticon.com/512/29/29302.png';
    const tipo = livroOriginal?.tipo || 'Desconhecido';
    const local = livroOriginal?.localizacao || 'Não informado';

    div.innerHTML = `
      <img src="${imagem}" alt="${item.titulo}">
      <div class="info">
        <h3>${item.titulo}</h3>
        <p><strong>Ação:</strong> ${item.acao.charAt(0).toUpperCase() + item.acao.slice(1)}</p>
        <p><strong>Tipo:</strong> ${tipo}</p>
        <p><strong>Localização:</strong> ${local}</p>
        <p><strong>Data:</strong> ${item.data}</p>
        <p class="status ${item.acao.toLowerCase()}">Status: ${item.acao.charAt(0).toUpperCase() + item.acao.slice(1)}</p>
      </div>
    `;

    container.appendChild(div);
  });
});

