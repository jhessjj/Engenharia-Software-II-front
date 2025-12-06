document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        alert("Usuário não logado!");
        window.location.href = "login.html";
        return;
    }

    const container = document.querySelector(".historico-container");

    try {
        const response = await fetch(`http://localhost:3000/transacoes/usuario/${userId}`);
        const historico = await response.json();

        if (historico.length === 0) {
            container.innerHTML = `
                <p style="margin-top:20px; font-size: 18px;">Nenhuma ação registrada ainda 📚</p>
            `;
            return;
        }

        container.innerHTML = `<h2>Histórico de ações</h2>`;

        historico.forEach(item => {
            const card = document.createElement("div");
            card.classList.add("livro");

            card.innerHTML = `
                <div class="info">
                    <h3>${item.titulo}</h3>
                    <p><strong>Tipo:</strong> ${item.tipo}</p>
                    <p><strong>Status:</strong> ${item.status}</p>
                    <p><strong>Data início:</strong> ${item.data_inicio}</p>
                    ${item.data_fim ? `<p><strong>Data fim:</strong> ${item.data_fim}</p>` : ""}
                </div>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Erro ao carregar histórico:", error);
        container.innerHTML = "<p>Erro ao carregar histórico.</p>";
    }
});
