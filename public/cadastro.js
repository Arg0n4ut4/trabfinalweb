document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM completamente carregado e analisado.');
document.getElementById('form-cadastro').addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Captura os valores dos campos de entrada
    const nome = document.getElementById('cadastro-nome').value;
    const email = document.getElementById('cadastro-email').value;
    const senha = document.getElementById('cadastro-password').value;
    const cpf = document.getElementById('cadastro-cpf').value;
    const celular = document.getElementById('cadastro-celular').value;

    try {
        // Envia a requisição para o endpoint de cadastro
        const response = await fetch('http://localhost:3000/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha, nome, cpf, celular }), // Envia os dados como JSON
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Cadastro bem-sucedido:', data);
            alert('Cadastro realizado com sucesso!');
            // Redirecionar ou carregar outra página
            window.location.href = 'perfil.html'; // Altere para a página que deseja redirecionar após o cadastro
        } else {
            const errorData = await response.json();
            console.error('Erro no cadastro:', errorData.message);
            alert('Erro ao cadastrar. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao realizar a requisição:', error);
        alert('Erro ao realizar o cadastro. Tente novamente mais tarde.');
    }
});
});