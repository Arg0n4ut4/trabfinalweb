document.getElementById('form-alterar-senha').addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Captura os valores dos campos de entrada
    const senhaAtual = document.getElementById('senha-atual').value;
    const novaSenha = document.getElementById('nova-senha').value;

    // Obtém o token do localStorage
    const token = localStorage.getItem('token');

    try {
        // Envia a requisição para o endpoint de alterar senha
        const response = await fetch('http://localhost:3000/alterar-senha', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Inclui o token no cabeçalho
            },
            body: JSON.stringify({ senhaAtual, novaSenha }), // Envia os dados como JSON
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Senha alterada com sucesso:', data);
            alert('Senha alterada com sucesso!');

            localStorage.removeItem('token');
            // Redirecionar ou carregar outra página, se necessário
            window.location.href = 'perfil.html'; // Altere para a página que deseja redirecionar
        } else {
            const errorData = await response.json();
            console.error('Erro ao alterar a senha:', errorData.message);
            alert('Erro ao alterar a senha. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao realizar a requisição:', error);
        alert('Erro ao alterar a senha. Tente novamente mais tarde.');
    }
});