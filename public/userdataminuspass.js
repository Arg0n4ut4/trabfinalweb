document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM fully loaded and parsed'); 

    const token = localStorage.getItem('token'); // Supondo que o token é armazenado no localStorage
    
    if (!token) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'perfil.html'; // Redireciona para a página de login
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/perfil', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Envia o token no cabeçalho
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const userData = await response.json();
            console.log('Dados do perfil:', userData);
            
            // Função para formatar CPF
            function formatarCPF(cpf) {
                return cpf.replace(/(\d{3})(\d)/, '$1.$2')
                        .replace(/(\d{3})(\d)/, '$1.$2')
                        .replace(/(\d{2})$/, '-$1');
            }

                        // Função para formatar Celular
            function formatarCelular(celular) {
                // Verifica se o número tem 13 dígitos (incluindo o código do país)
                if (celular.length === 13) {
                    const codigoPais = celular.slice(0, 2); // +55
                    const codigoArea = celular.slice(2, 4); // 41
                    const numeroPrincipal = celular.slice(2); // 999999999

                    // Formata o número
                    return `+${codigoPais} (${codigoArea}) ${numeroPrincipal.slice(0, 5)}-${numeroPrincipal.slice(5)}`;
                } else {
                    return celular; // Retorna o celular original se não tiver 13 dígitos
                }
            }

            // Formata os dados antes de exibi-los
            document.getElementById('perfil-nome').textContent = userData.nome;
            document.getElementById('perfil-email').textContent = userData.email;
            document.getElementById('perfil-celular').textContent = formatarCelular(userData.celular);
            document.getElementById('perfil-cpf').textContent = formatarCPF(userData.cpf);
            // Adicione outros campos conforme necessário
        } else {
            const errorData = await response.json();
            console.error('Erro ao obter dados do perfil:', errorData.message);
            alert('Erro ao carregar os dados do perfil. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao realizar a requisição:', error);
        alert('Erro ao carregar os dados do perfil. Tente novamente mais tarde.');
    }
});