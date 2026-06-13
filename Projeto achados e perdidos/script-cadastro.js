const registerForm = document.getElementById('register-form');
const regCEP = document.getElementById('reg-cep');
const regAddress = document.getElementById('reg-address');
const regBairro = document.getElementById('reg-bairro');
const regCity = document.getElementById('reg-city');
const regState = document.getElementById('reg-state');
const regPassword = document.getElementById('reg-password');
const regConfirmPassword = document.getElementById('reg-confirm-password');
const registerMessage = document.getElementById('register-message');

// Função de exibição de mensagens de erro/sucesso (Garantida no topo)
function exibirMensagem(texto, erro = true) {
    if (!registerMessage) return;
    
    registerMessage.textContent = texto;
    registerMessage.classList.remove('hidden');
    
    if (erro) {
        registerMessage.style.backgroundColor = "rgba(244, 33, 46, 0.1)";
        registerMessage.style.color = "#f4212e";
    } else {
        registerMessage.style.backgroundColor = "rgba(0, 186, 124, 0.1)";
        registerMessage.style.color = "#00ba7c";
    }
}

// 1. Bloquear letras nas senhas numéricas
if (regPassword && regConfirmPassword) {
    [regPassword, regConfirmPassword].forEach(input => {
        input.addEventListener('input', () => {
            input.value = input.value.replace(/\D/g, '');
        });
    });
}

// 2. Consulta de CEP automática via API
if (regCEP) {
    regCEP.addEventListener('blur', () => {
        const cepValor = regCEP.value.replace(/\D/g, '');

        if (cepValor.length === 8) {
            registerMessage.classList.add('hidden');
            
            fetch(`https://viacep.com.br/ws/${cepValor}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (!data.erro) {
                        if (regAddress) regAddress.value = data.logradouro;
                        if (regBairro) regBairro.value = data.bairro;
                        if (regCity) regCity.value = data.localidade;
                        if (regState) regState.value = data.uf;
                    } else {
                        exibirMensagem("CEP não encontrado.", true);
                    }
                })
                .catch(() => exibirMensagem("Erro ao buscar o CEP. Digite manualmente.", true));
        }
    });
}

// 3. Submissão do formulário direcionando para a home.html
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const senha = regPassword ? regPassword.value : '';
        const confirmacao = regConfirmPassword ? regConfirmPassword.value : '';

        if (senha.length !== 6) {
            exibirMensagem("A senha deve conter exatamente 6 números.", true);
            return;
        }

        if (senha !== confirmacao) {
            exibirMensagem("As senhas não coincidem.", true);
            return;
        }

        const nomeUsuario = document.getElementById('reg-name') ? document.getElementById('reg-name').value : 'Usuário';

        const novoUsuario = {
            nome: nomeUsuario,
            email: document.getElementById('reg-email') ? document.getElementById('reg-email').value : '',
            telefone: document.getElementById('reg-phone') ? document.getElementById('reg-phone').value : '',
            cpf: document.getElementById('reg-cpf') ? document.getElementById('reg-cpf').value : '',
            nascimento: document.getElementById('reg-birth') ? document.getElementById('reg-birth').value : '',
            cep: regCEP ? regCEP.value.replace(/\D/g, '') : '',
            endereco: regAddress ? regAddress.value : '',
            bairro: regBairro ? regBairro.value : '',
            cidade: regCity ? regCity.value : '',
            estado: regState ? regState.value : '',
            senha: senha
        };

        // Grava as informações no LocalStorage
        localStorage.setItem('dadosUsuarioCadastrado', JSON.stringify(novoUsuario));
        localStorage.setItem('usuarioLogado', nomeUsuario);
        
        exibirMensagem("Conta criada com sucesso! Entrando...", false);

        // Força a mudança de página para o feed do seu projeto
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1500);
    });
}