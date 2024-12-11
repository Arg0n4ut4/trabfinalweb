function formatarData(input) {
    // Remove todos os caracteres que não são dígitos
    let valor = input.value.replace(/\D/g, '');

    // Limita a entrada a 8 dígitos
    if (valor.length > 8) {
        valor = valor.substring(0, 8);
    }

    // Adiciona as barras (/) no formato DD/MM/AAAA
    if (valor.length > 2) {
        valor = valor.substring(0, 2) + '/' + valor.substring(2);
    }
    if (valor.length > 5) {
        valor = valor.substring(0, 5) + '/' + valor.substring(5);
    }

    // Atualiza o valor do input
    input.value = valor;

    // Valida a data
    if (valor.length === 10) { // Verifica se a data está completa
        const dia = parseInt(valor.substring(0, 2), 10);
        const mes = parseInt(valor.substring(3, 5), 10);
        const ano = parseInt(valor.substring(6, 10), 10); // Agora pega 4 dígitos para o ano

        // Verifica se a data é válida
        const dataValida = validarData(dia, mes, ano);
        const errorDiv = document.getElementById('error');
        if (!dataValida) {
            errorDiv.textContent = 'Data inválida!';
        } else {
            errorDiv.textContent = ''; // Limpa a mensagem de erro se a data for válida
        }
    }
}

function validarData(dia, mes, ano) {
    // Verifica se o mês está entre 1 e 12
    if (mes < 1 || mes > 12) {
        return false;
    }

    // Verifica se o dia é válido para o mês
    const diasNoMes = [31, (ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return dia > 0 && dia <= diasNoMes[mes - 1];
}


function validarEntrada(input) {
    // Remove todos os caracteres que não são dígitos ou vírgulas
    let valor = input.value.replace(/[^0-9,]/g, '');

    // Permite apenas uma vírgula
    const partes = valor.split(',');
    if (partes.length > 2) {
        valor = partes[0] + ',' + partes[1];
    }

    // Limita a duas casas decimais após a vírgula
    if (partes.length === 2) {
        partes[1] = partes[1].substring(0, 2); // Trunca para 2 dígitos
        valor = partes.join(',');
    }

    // Adiciona "R$" no início, se não estiver presente
    if (!valor.startsWith('R$')) {
        valor = 'R$' + valor;
    }

    // Verifica se o valor é apenas "R$" ou "D-"
    if (valor === 'R$' || valor === 'D-') {
        input.value = ''; // Limpa o campo
    } else {
        // Atualiza o valor do input
        input.value = valor;
    }
}

function Idinicio(input) {
    let valor = input.value.replace(/\D/g, '');

    if (!valor.startsWith('D-')) {
        valor = 'D-' + valor;
    }

    // Verifica se o valor é apenas "R$" ou "D-"
    if (valor === 'R$' || valor === 'D-') {
        input.value = ''; // Limpa o campo
    } else {
        // Atualiza o valor do input
        input.value = valor;
    }
}

function autoResize(textarea) {
    // Redimensiona o textarea de acordo com o conteúdo
    textarea.style.height = 'auto'; // Reseta a altura
    textarea.style.height = textarea.scrollHeight + 'px'; // Define a altura com base no conteúdo
}