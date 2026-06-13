// ==========================================================================
// A) FUNÇÕES GLOBAIS (Chamadas diretamente pelos botões gerados no HTML)
// ==========================================================================

// Função para aceitar o serviço e remover do mural
function aceitarServico(id) {
    let servicos = JSON.parse(localStorage.getItem("servicos")) || [];
    servicos = servicos.filter(s => s.id !== id);
    localStorage.setItem("servicos", JSON.stringify(servicos));

    alert("Você aceitou o serviço com sucesso!");
    location.reload();
}

// Função executada ao clicar no botão "Abrir Chat" de qualquer Card
function abrirChat(tituloServico) {
    const chatModal = document.getElementById('chat-modal');
    const chatBody = document.getElementById('chat-body');

    if (chatModal) {
        chatModal.classList.remove('hidden');
    }

    if (chatBody) {
        // Inicializa a tela de conversa contextualizada com o título do serviço clicado
        chatBody.innerHTML = `
            <div class="message system">
                Você abriu o chat para tratar de: <strong>${tituloServico}</strong>.
            </div>
            <div class="message system">
                Combine os termos por aqui. Se desejar realizar uma cobrança ou transferência, digite <strong>"pagar"</strong>.
            </div>
        `;
        chatBody.scrollTop = chatBody.scrollHeight;
    }
}

// Executado quando o botão de pagamento verde interno do chat é clicado
function executePayment() {
    alert('Integração com gateway disparada! Processando transação via Pix...');
    
    const chatBody = document.getElementById('chat-body');
    if (chatBody) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', 'system');
        msgDiv.innerText = '✅ Pagamento confirmado com sucesso! Transação concluída.';
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
}


// ==========================================================================
// B) AGUARDAR O CARREGAMENTO DA PÁGINA (Escopos Locais protegidos de erros)
// ==========================================================================
document.addEventListener("DOMContentLoaded", function () {

    // --- MÁSCARA DO CEP e Integração ViaCEP ---
    const cepInput = document.getElementById("cep");
    if (cepInput) {
        cepInput.addEventListener("input", async (e) => {
            let value = e.target.value.replace(/\D/g, "").substring(0, 8);
            if (value.length > 5) {
                value = value.replace(/(\d{5})(\d+)/, "$1-$2");
            }
            e.target.value = value;

            const cepLimpo = value.replace(/\D/g, "");
            if (cepLimpo.length === 8) {
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
                    const data = await response.json();
                    if (data.erro) {
                        alert("CEP não encontrado!");
                        return;
                    }
                    document.getElementById("rua").value = data.logradouro || "";
                    document.getElementById("bairro").value = data.bairro || "";
                    document.getElementById("cidade").value = data.localidade || "";
                    document.getElementById("estado").value = data.uf || "";
                } catch (error) {
                    console.error("Erro ao buscar CEP:", error);
                }
            }
        });
    }

    // --- MÁSCARA DO CPF ---
    const cpfInput = document.getElementById("cpf");
    if (cpfInput) {
        cpfInput.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g, "").substring(0, 11);
            value = value
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            e.target.value = value;
        });
    }

    // --- MÁSCARA DO CELULAR ---
    const celInput = document.getElementById("cel");
    if (celInput) {
        celInput.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g, "").substring(0, 11);
            value = value
                .replace(/^(\d{2})(\d)/, "($1) $2")
                .replace(/(\d{5})(\d)/, "$1-$2");
            e.target.value = value;
        });
    }

    // --- FORMULÁRIO DE CADASTRO ---
    const formCadastro = document.getElementById("formCadastro");
    if (formCadastro) {
        const BlackSenha = document.getElementById("senha");
        const BlackCsenha = document.getElementById("csenha");

        formCadastro.addEventListener("submit", function (event) {
            event.preventDefault();
            if (BlackSenha.value !== BlackCsenha.value) {
                alert("As senhas não coincidem!");
                return false;
            } else {
                const email = document.getElementById("email").value;
                localStorage.setItem("usuario", email);
                localStorage.setItem("senha", BlackSenha.value);
                alert("Cadastro realizado com sucesso!");
                window.location.href = "login.html";
            }
        });
    }

    // --- FORMULÁRIO DE LOGIN ---
    const formLogin = document.getElementById("formLogin");
    if (formLogin) {
        formLogin.addEventListener("submit", function (event) {
            event.preventDefault();
            const email = document.querySelector("input[type='email']").value;
            const senha = document.querySelector("input[type='password']").value;
            const emailSalvo = localStorage.getItem("usuario");
            const senhaSalva = localStorage.getItem("senha");

            if (email === emailSalvo && senha === senhaSalva) {
                alert("Login realizado!");
                window.location.href = "index.html";
            } else {
                alert("Email ou senha inválidos");
            }
        });
    }

    // --- SOLICITAÇÃO DE SERVIÇO (Criação/Publicação) ---
    const formServico = document.getElementById("formServico");
    if (formServico) {
        formServico.addEventListener("submit", function (e) {
            e.preventDefault();
            const servico = {
                titulo: document.getElementById("titulo").value,
                descricao: document.getElementById("descricao").value,
                cidade: document.getElementById("cidadeServico").value,
                contato: document.getElementById("contato").value,
                id: Date.now()
            };

            let lista = JSON.parse(localStorage.getItem("servicos")) || [];
            lista.push(servico);
            localStorage.setItem("servicos", JSON.stringify(lista));

            alert("Serviço publicado com sucesso!");
            window.location.href = "mural.html";
        });
    }

    // --- RENDERIZAR O MURAL DE SERVIÇOS (Injeção dos Cards) ---
    const listaServicos = document.getElementById("listaServicos");
    if (listaServicos) {
        const servicos = JSON.parse(localStorage.getItem("servicos")) || [];
        listaServicos.innerHTML = "";

        servicos.forEach(servico => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <h3>${servico.titulo}</h3>
                <p>${servico.descricao}</p>
                <p><strong>Cidade:</strong> ${servico.cidade}</p>
                <p><strong>Contato:</strong> ${servico.contato}</p>
                <button class="btn-aceitar" onclick="aceitarServico(${servico.id})">Aceitar</button>
                <button class="btn-chat" onclick="abrirChat('${servico.titulo}')">Abrir Chat</button>
            `;
            listaServicos.appendChild(card);
        });
    }

    // ==========================================================================
    // C) GERENCIAMENTO DO MODAL DO CHAT INTERNO (EVENTOS E REGRAS)
    // ==========================================================================
    const chatModal = document.getElementById('chat-modal');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const sendBtn = document.getElementById('send-btn');
    const chatInput = document.getElementById('chat-input');
    const chatBody = document.getElementById('chat-body');

    if (chatModal && chatBody) {
        // Fechar Modal no botão 'X'
        if (closeChatBtn) {
            closeChatBtn.addEventListener('click', () => chatModal.classList.add('hidden'));
        }

        // Fechar se clicar fora da caixa branca do chat
        window.addEventListener('click', (e) => {
            if (e.target === chatModal) chatModal.classList.add('hidden');
        });

        // Captura e renderiza mensagem enviada pelo usuário
        function sendMessage() {
            const text = chatInput.value.trim();
            if (text === '') return;

            appendMessage(text, 'user');
            chatInput.value = '';

            // Resposta automática do bot simulada após 1 segundo
            setTimeout(() => {
                processBotResponse(text);
            }, 1000);
        }

        function appendMessage(text, sender) {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('message', sender);
            msgDiv.innerText = text;
            chatBody.appendChild(msgDiv);
            chatBody.scrollTop = chatBody.scrollHeight;
        }

        // Processador de termos-chave ("pagar", "pagamento")
        function processBotResponse(userText) {
            const textLower = userText.toLowerCase();

            if (textLower.includes('pagar') || textLower.includes('pagamento') || textLower.includes('comprar')) {
                appendMessage('Entendido! Segue abaixo a fatura gerada para este atendimento:', 'system');
                
                setTimeout(() => {
                    const cardDiv = document.createElement('div');
                    cardDiv.classList.add('payment-card');
                    cardDiv.innerHTML = `
                        <p>💵 Valor do Serviço: R$ 50,00</p>
                        <button class="pay-btn" onclick="executePayment()">Pagar Agora via Pix</button>
                    `;
                    chatBody.appendChild(cardDiv);
                    chatBody.scrollTop = chatBody.scrollHeight;
                }, 500);
            } else {
                appendMessage('Mensagem recebida! Se precisar processar faturamento, envie a palavra "pagar".', 'system');
            }
        }

        // Escutas para envio de mensagem
        if (sendBtn && chatInput) {
            sendBtn.addEventListener('click', sendMessage);
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendMessage();
            });
        }
    }
});