const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('toggle-password');
const errorMessage = document.getElementById('error-message');

// Lógica de Mostrar / Ocultar a senha
togglePasswordBtn.addEventListener('click', () => {
    const icon = togglePasswordBtn.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

// Evento de envio do formulário
loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Impede a página de recarregar sumariamente

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Simulação simples de validação para fins do projeto acadêmico
    // Se o grupo for integrar com banco real, a validação ocorre aqui via fetch()
    if (username.length >= 4 && password.length >= 4) {
        errorMessage.classList.add('hidden');
        
        // Simula o salvamento de uma sessão simples no navegador
        localStorage.setItem('usuarioLogado', username);

        // Redireciona para a tela do feed/home que criamos antes
        window.location.href = 'home.html';
    } else {
        // Exibe mensagem caso os campos simulem um dado inválido muito curto
        errorMessage.classList.remove('hidden');
    }
});

