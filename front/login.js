document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formLogin');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede de recarregar a página sozinho

        const user = document.getElementById('user').value;
        const senha = document.getElementById('senha').value;

        const dadosLogin = {
            user: user,
            senha: senha
        };

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosLogin)
            });

            const resultado = await response.json();

            if (response.ok) {
                // SUCESSO!
                alert('Login realizado com sucesso!');
                
                // SALVA O ID DO USUÁRIO (Importantíssimo para cadastrar livros depois)
                localStorage.setItem('userId', resultado.userId);
                localStorage.setItem('userNome', resultado.nome);

                // Agora sim, redireciona pelo JS
                window.location.href = 'home.html';
            } else {
                // ERRO (Senha errada ou usuário não existe)
                alert(resultado.message);
            }

        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao conectar com o servidor.');
        }
    });
});