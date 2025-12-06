// Arquivo: front/cadastro.js

document.addEventListener('DOMContentLoaded', () => {
    // Seleciona o formulário
    const formulario = document.querySelector('form');

    formulario.addEventListener('submit', async (event) => {
        event.preventDefault(); // <--- O PULO DO GATO: Impede a página de recarregar!

        // 1. Pega os valores dos inputs pelos IDs que estão no HTML
        const nomeValor = document.getElementById('nome').value;
        const usuarioValor = document.getElementById('email').value; // No HTML está 'email', mas usaremos como user
        const senhaValor = document.getElementById('password').value; // No HTML está 'password'
        const telefoneValor = document.getElementById('telefone').value;

        // 2. Monta o pacote de dados para enviar (com os nomes que o Backend espera)
        const dadosParaEnviar = {
            nome: nomeValor,
            user: usuarioValor,  // Backend espera 'user'
            senha: senhaValor,   // Backend espera 'senha'
            telefone: telefoneValor
        };

        console.log("Enviando dados:", dadosParaEnviar); // Para você ver no Console do navegador

        try {
            // 3. Envia para o servidor
            const response = await fetch('http://localhost:3000/auth/cadastro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosParaEnviar)
            });

            const resultado = await response.json();

            if (response.ok) {
                alert('Cadastro realizado com sucesso!');
                window.location.href = 'login.html'; // Manda pro login
            } else {
                alert('Erro: ' + resultado.message);
            }

        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Erro ao conectar com o servidor. Verifique se o Node.js está rodando.');
        }
    });
});