// ==========================================================================
// GERENCIAMENTO DE ACESSIBILIDADE PERSISTENTE
// ==========================================================================
function carregarAcessibilidadeGlobal() {
    const temaSalvo = localStorage.getItem('temaPreferido');
    if (temaSalvo === 'claro') {
        document.body.classList.add('light-theme');
    }
    const fonteSalva = localStorage.getItem('tamanhoFontePreferido');
    if (fonteSalva) {
        document.documentElement.style.setProperty('--main-font-size', fonteSalva);
    }
}
document.addEventListener('DOMContentLoaded', carregarAcessibilidadeGlobal);

// ==========================================================================
// MAPEAMENTO DOS ELEMENTOS DO FORMULÁRIO (index.html)
// ==========================================================================
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('login-username');
const passwordInput = document.getElementById('login-password');
const errorMessage = document.getElementById('login-error');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede a página de recarregar desordenadamente

        // Validação de segurança caso os inputs não existam na tela
        if (!usernameInput || !passwordInput) return;

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        // Tenta buscar os dados caso o usuário tenha acabado de se cadastrar na tela cadastro.html
        const usuarioSalvo = JSON.parse(localStorage.getItem('dadosUsuarioCadastrado'));

        // Cenário 1: Se existir um cadastro no LocalStorage e os dados baterem
        if (usuarioSalvo && (username === usuarioSalvo.email || username === usuarioSalvo.nome) && password === usuarioSalvo.senha) {
            if (errorMessage) errorMessage.classList.add('hidden');
            localStorage.setItem('usuarioLogado', usuarioSalvo.nome); // Guarda a sessão ativa
            window.location.href = 'home.html'; // REDIRECIONAMENTO DIRETO PARA A HOME
        } 
        // Cenário 2: Login rápido de teste (Caso não queira passar pela tela de cadastro na apresentação)
        else if (username.length >= 4 && password.length >= 4 && !usuarioSalvo) {
            if (errorMessage) errorMessage.classList.add('hidden');
            localStorage.setItem('usuarioLogado', username); // Guarda o nome digitado como sessão
            window.location.href = 'home.html'; // REDIRECIONAMENTO DIRETO PARA A HOME
        } 
        // Cenário 3: Dados incorretos
        else {
            if (errorMessage) {
                errorMessage.textContent = "Usuário ou senha incorretos.";
                errorMessage.classList.remove('hidden');
            }
        }
    });
}