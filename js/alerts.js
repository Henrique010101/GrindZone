export function showAlert(message, isSuccess) {
    const alertBox = document.getElementById('alertBox');
    const alertMessage = document.getElementById('alertMessage');

    // Define a mensagem
    alertMessage.textContent = message;

    // Define a cor de fundo
    if (isSuccess) {
        alertBox.classList.remove('alert-fail');
        alertBox.classList.add('alert-success');
    } else {
        alertBox.classList.remove('alert-success');
        alertBox.classList.add('alert-fail');
    }

    // Exibe o alerta
    alertBox.style.display = 'block';

    // Esconde automaticamente após 3 segundos
    setTimeout(hideAlert, 4000);
}

// Função para esconder o alerta
export function hideAlert() {
    const alertBox = document.getElementById('alertBox');
    alertBox.style.display = 'none';
}

export function checkTokenCookie() {
    const cookies = document.cookie.split('; ').map(cookie => cookie.split('='));
    const tokenCookie = cookies.find(cookie => cookie[0] === 'token');
    
    // Verifica se o cookie `token` foi encontrado e possui algum valor
    return tokenCookie !== undefined && tokenCookie[1] !== '';
}

window.hideAlert = hideAlert;