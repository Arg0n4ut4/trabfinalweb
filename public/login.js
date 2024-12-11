document.getElementById('formulario_login').addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Captura os valores dos campos de entrada
    const email = document.getElementById('email_login').value;
    const senha = document.getElementById('senha_login').value;

    try {
        // Envia a requisição para o endpoint de login
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha }), // Envia os dados como JSON
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Login bem-sucedido:', data);
            // Armazena o token no localStorage
            localStorage.setItem('token', data.token);
            alert('Login bem-sucedido!');
            // Redirecionar ou carregar outra página
            window.location.href = 'conta.html'; // Altere para a página que deseja redirecionar
        } else {
            const errorData = await response.json();
            console.error('Erro no login:', errorData.message);
            alert('Credenciais inválidas. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao realizar a requisição:', error);
        alert('Erro ao realizar o login. Tente novamente mais tarde.');
    }
});