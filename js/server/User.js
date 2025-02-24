import { showAlert, hideAlert } from '../alerts.js';

document.getElementById('register-form').addEventListener('submit', registerUser);
document.getElementById('login-form').addEventListener('submit', loginUser);

async function registerUser(event) {
    event.preventDefault();

    let submitButton = document.getElementById('enviar');
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if (!name || !email || !password || !confirmPassword) {
        console.error('Um ou mais elementos não foram encontrados.');
        return;
    }

    try {
        // Realize a requisição POST ao servidor
        const response = await fetch(`https://grind-zone-api.vercel.app/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Isso garante que os cookies sejam enviados/recebidos
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
                confirmpassword: confirmPassword, // Confirme se está correto
            }),
        })

        document.getElementById('register-name').value = '';
        document.getElementById('register-email').value = '';
        document.getElementById('register-password').value = '';
        document.getElementById('register-confirm-password').value = '';

        if (!response.ok) {
            throw new Error(data.msg || 'Erro desconhecido durante o registro.');
        }

        const data = await response.json();
        location.reload();
        showAlert(data.msg, true);

    } catch (error) {
        console.error('Erro ao registrar:', error);
        showAlert('Erro ao fazer o registro. Por favor, tente novamente.', false);
    }
}

async function loginUser(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('https://grind-zone-api.vercel.app/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        })

        if (!response.ok) {
            throw new Error(data.msg || 'Erro desconhecido durante o login.');
        }
            const data = await response.json();
            document.getElementById('login-email').value = ''; // Limpa os campos corretamente
            document.getElementById('login-password').value = '';
            showAlert('Login realizado com sucesso!', true);
            setTimeout(() => {
                location.reload();
            }, 1000);
            

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        showAlert('Erro ao fazer login. Por favor, tente novamente.', false);
    }
}

export async function verifySession() {
    try {
        const response = await fetch('https://grind-zone-api.vercel.app/api/check-session', {
            method: 'GET',
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            if (data.isAuthenticated) {
                // Se o usuário estiver autenticado
                document.getElementById('nav_entrar').style.display = 'none';
                document.getElementById('nav_registrar').style.display = 'none';
                document.getElementById('nav_sair').style.display = 'block';
                document.getElementById('nav_cart').style.display = 'block';
                return true;
            } else {
                // Se o usuário não estiver autenticado
                document.getElementById('nav_entrar').style.display = 'block';
                document.getElementById('nav_registrar').style.display = 'block';
                document.getElementById('nav_sair').style.display = 'none';
                document.getElementById('nav_cart').style.display = 'none';
                return false;
            }
        } else {
            console.error('Erro ao verificar autenticação:', response.statusText);
            return false;
        }
    } catch (error) {
        console.error('Erro ao verificar estado de autenticação:', error);
        return false;
    }
};

async function logout() {
    try {
        const response = await fetch('https://grind-zone-api.vercel.app/api/logout', {
            method: 'GET',
            credentials: 'include' // Inclui cookies na solicitação
        });

        if (response.ok) {
            // Sucesso no logout, limpe o estado do front-end e atualize o DOM
            document.getElementById('nav_entrar').style.display = 'block';
            document.getElementById('nav_registrar').style.display = 'block';
            document.getElementById('nav_sair').style.display = 'none';
            document.getElementById('nav_cart').style.display = 'none';

            showAlert('Você foi deslogado com sucesso!', true);
        } else {
            // Trate erros aqui
            alert('Erro ao deslogar. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        showAlert('Erro ao deslogar. Tente novamente.', false);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await verifySession();
});

document.getElementById('nav_sair').addEventListener('click', async () => {
    await logout();
});

document.addEventListener('click', async (event) => {

    await new Promise(resolve => setTimeout(resolve, 1000));
    if (event.target.matches('.action-requiring-auth')) {
        await verifySession(); // Verifique o token antes de executar a ação
        // Execute a ação aqui
    }
});