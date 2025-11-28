document.addEventListener('DOMContentLoaded', async () => {
    const container = document.querySelector('.historico-container');
    const meuId = localStorage.getItem('userId');

    if (!meuId) {
        window.location.href = 'login.html';
        return;
    }

    container.innerHTML = '<h2>Gerenciamento e Histórico</h2>';

    try {
        const response = await fetch(`http://localhost:3000/transacoes/usuario/${meuId}`);
        const historico = await response.json();

        if (historico.length === 0) {
            container.innerHTML += '<p style="text-align:center;">Nenhum registro encontrado.</p>';
            return;
        }

        historico.forEach(item => {
            // Ignora recusadas
            if (item.status === 'recusada') return;

            const div = document.createElement('div');
            div.classList.add('livro');

            const souDono = item.id_responsavel == meuId;
            const tipoNormalizado = item.tipo.toLowerCase(); 
            const statusNormalizado = item.status.toLowerCase(); // Transforma PENDENTE em pendente

            let tituloAcao = '';
            let conteudoBotoes = '';
            let corDestaque = '';
            let imagem = item.url_capa || 'https://via.placeholder.com/150x200?text=Sem+Capa';

            // --- CENÁRIO 1: PEDIDO NOVO (Solicitado OU Pendente) ---
            // AQUI ESTAVA O PROBLEMA: Adicionei a verificação do 'pendente' também
            if (souDono && (statusNormalizado === 'solicitado' || statusNormalizado === 'pendente')) {
                tituloAcao = '🔔 Nova Solicitação';
                corDestaque = 'solicitacao-nova'; 
                conteudoBotoes = `
                    <div class="acoes-pendentes">
                        <button onclick="responderSolicitacao(${item.id}, 'aceitar', '${tipoNormalizado}')" class="btn-aceitar">✅ Aceitar</button>
                        <button onclick="responderSolicitacao(${item.id}, 'recusar', '${tipoNormalizado}')" class="btn-recusar">❌ Recusar</button>
                    </div>
                `;
            }

            // --- CENÁRIO 2: EMPRÉSTIMO ATIVO ---
            else if (souDono && statusNormalizado === 'aceito' && tipoNormalizado === 'emprestimo') {
                tituloAcao = '⏳ Empréstimo em Andamento';
                corDestaque = 'emprestimo-ativo';
                
                conteudoBotoes = `
                    <div class="acoes-devolucao" style="margin-top:10px; padding:10px; background:#f0f8ff; border-radius:5px;">
                        <p style="margin:0 0 5px 0; font-size:0.9rem;">O livro está emprestado.</p>
                        <button onclick="responderSolicitacao(${item.id}, 'devolver', '${tipoNormalizado}')" class="btn-devolver" style="width:100%; background-color:#007bff;">
                            🔄 Confirmar que foi Devolvido
                        </button>
                    </div>
                `;
            }

            // --- CENÁRIO 3: FINALIZADOS OU VISÃO DE QUEM PEDIU ---
            else {
                if (souDono) {
                    tituloAcao = '⬆️ Você cedeu';
                    corDestaque = 'cedido';
                } else {
                    tituloAcao = '⬇️ Você solicitou';
                    corDestaque = 'recebido';
                }

                if (!souDono && (statusNormalizado === 'solicitado' || statusNormalizado === 'pendente')) {
                    conteudoBotoes = '<p style="color:orange">Aguardando resposta do dono...</p>';
                }
                else if (!souDono && statusNormalizado === 'aceito') {
                    conteudoBotoes = '<p style="color:blue">Você está com este livro. Cuide bem dele! 📖</p>';
                }
                else if (statusNormalizado === 'concluida') {
                    conteudoBotoes = '<p style="color:green">✅ Processo finalizado.</p>';
                }
            }

            div.innerHTML = `
                <img src="${imagem}" alt="${item.titulo}">
                <div class="info">
                    <h3>${item.titulo}</h3>
                    <p class="destaque ${corDestaque}"><strong>${tituloAcao}</strong></p>
                    <p><strong>Tipo:</strong> ${item.tipo.toUpperCase()}</p>
                    <p><strong>Status:</strong> ${item.status.toUpperCase()}</p>
                    <div style="margin-top:5px;">
                        ${conteudoBotoes}
                    </div>
                </div>
            `;

            container.appendChild(div);
        });

    } catch (error) {
        console.error("Erro:", error);
    }
});

// A função que chama o Backend
async function responderSolicitacao(id, acao, tipoLivro) {
    let pergunta = acao === 'devolver' ? "O livro já está com você? Confirmar devolução?" : `Confirma a ação: ${acao}?`;
    
    if(!confirm(pergunta)) return;

    try {
        const response = await fetch(`http://localhost:3000/transacoes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ acao: acao, tipoLivro: tipoLivro })
        });

        if (response.ok) {
            alert('Atualizado com sucesso!');
            location.reload();
        } else {
            alert('Erro ao atualizar.');
        }
    } catch (error) {
        console.log(error);
    }
}