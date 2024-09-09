document.getElementById('register-form').addEventListener('submit', registerUser);

async function registerUser (event) {
    event.preventDefault();

    const submitButton = document.getElementById('enviar');
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
        const response = await fetch(`http://localhost:3000/api/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // Isso garante que os cookies sejam enviados/recebidos
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
                confirmpassword: confirmPassword,
            }),
        })

        name = '';
        email = '';
        password = '';
        confirmPassword = '';

        const data = await response.json();
        alert(data.msg)

    } catch (error) {
        console.error('Erro ao registrar:', error);
    }
}

window.addEventListener('load', async () => {
    try {
      const response = await fetch('http://localhost:3000/api/verify-session',
        { method: 'GET', credentials: 'include' });
  
      if (response.ok) {
        const data = await response.json();
        // Restaurar o estado do usuário no front-end
        document.getElementById('nav_entrar').style.display = 'none';
        document.getElementById('nav_registrar').style.display = 'none';
        document.getElementById('nav_sair').style.display = 'block';
        document.getElementById('nav_cart').style.display = 'block';
  
        // Opcional: Exibir o nome do usuário ou outros dados retornados
        console.log(`Usuário autenticado: ${data.email}`);
      } else {
        // Caso não autenticado, exibir os botões de login/registro
        document.getElementById('nav_entrar').style.display = 'block';
        document.getElementById('nav_registrar').style.display = 'block';
        document.getElementById('nav_sair').style.display = 'none';
        document.getElementById('nav_cart').style.display = 'none';
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
    }
  });
  
