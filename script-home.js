// ==========================================================================
// 1. GERENCIAMENTO DE ACESSIBILIDADE PERSISTENTE (Tema e Fonte)
// ==========================================================================
let currentFontSize = 15; // Tamanho padrão em pixels

function carregarAcessibilidadeGlobal() {
    // Carrega a preferência de Tema do LocalStorage
    const temaSalvo = localStorage.getItem('temaPreferido');
    if (temaSalvo === 'claro') {
        document.body.classList.add('light-theme');
        const icon = document.getElementById('btn-toggle-theme')?.querySelector('i');
        if (icon) icon.className = 'fas fa-sun';
    }

    // Carrega a preferência de Tamanho de Fonte do LocalStorage
    const fonteSalva = localStorage.getItem('tamanhoFontePreferido');
    if (fonteSalva) {
        currentFontSize = parseFloat(fonteSalva);
        document.documentElement.style.setProperty('--main-font-size', fonteSalva);
    }
}

// Ouve os botões de acessibilidade na Home para aplicar e salvar as escolhas
const btnToggleTheme = document.getElementById('btn-toggle-theme');
if (btnToggleTheme) {
    btnToggleTheme.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const estaNoTemaClaro = document.body.classList.contains('light-theme');
        localStorage.setItem('temaPreferido', estaNoTemaClaro ? 'claro' : 'escuro');
        
        const icon = btnToggleTheme.querySelector('i');
        if (icon) icon.className = estaNoTemaClaro ? 'fas fa-sun' : 'fas fa-moon';
    });
}

const btnFontPlus = document.getElementById('btn-font-plus');
if (btnFontPlus) {
    btnFontPlus.addEventListener('click', () => {
        if (currentFontSize < 24) { // Limite máximo seguro para o layout
            currentFontSize += 1.5;
            const tamanhoStr = currentFontSize + 'px';
            document.documentElement.style.setProperty('--main-font-size', tamanhoStr);
            localStorage.setItem('tamanhoFontePreferido', tamanhoStr);
        }
    });
}

const btnFontMinus = document.getElementById('btn-font-minus');
if (btnFontMinus) {
    btnFontMinus.addEventListener('click', () => {
        if (currentFontSize > 12) { // Limite mínimo legível
            currentFontSize -= 1.5;
            const tamanhoStr = currentFontSize + 'px';
            document.documentElement.style.setProperty('--main-font-size', tamanhoStr);
            localStorage.setItem('tamanhoFontePreferido', tamanhoStr);
        }
    });
}

// ==========================================================================
// 2. CONFIGURAÇÃO DE SESSÃO DO USUÁRIO LOGADO
// ==========================================================================
const nomeUsuarioLogado = localStorage.getItem('usuarioLogado') || 'Aluno Conectado';

function configurarPerfilNaTela() {
    const sName = document.getElementById('sidebar-user-name');
    const hTitle = document.getElementById('header-welcome-title');
    const sHandle = document.getElementById('sidebar-user-handle');
    const hHandle = document.getElementById('header-user-handle');
    const uAvatarImg = document.getElementById('user-avatar-img');
    const rawImg = document.querySelector('.user-profile-img-raw');

    if (sName) sName.textContent = nomeUsuarioLogado;
    if (hTitle) hTitle.textContent = nomeUsuarioLogado;
    
    // Gera uma @ tag baseada no nome sem espaços
    const handleFormatado = `@${nomeUsuarioLogado.toLowerCase().replace(/\s+/g, '')}`;
    if (sHandle) sHandle.textContent = handleFormatado;
    if (hHandle) hHandle.textContent = handleFormatado;
    
    // Gera um avatar dinâmico com as iniciais do usuário
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(nomeUsuarioLogado)}&background=1d9bf0&color=fff`;
    if (uAvatarImg) uAvatarImg.src = avatarUrl;
    if (rawImg) rawImg.src = avatarUrl;
}

// ==========================================================================
// 3. BASE DE DADOS SIMULADA (MOCK) E RENDERIZAÇÃO DO FEED
// ==========================================================================
const postInput = document.getElementById('post-text');
const submitBtn = document.getElementById('submit-post');
const timeline = document.getElementById('timeline');

const postsIniciais = [
    {
        id: 1,
        usuario: "Ana Clara",
        handle: "@ana_unidb",
        texto: "Encontrei um estojo de óculos no Bloco B. Vou deixar na secretaria!",
        tempo: "10min",
        tipo: "achado",
        localItem: "Bloco B",
        comentarios: [{ autor: "Carlos_Edu", texto: "De qual cor é? Perdi o meu ontem." }]
    },
    {
        id: 2,
        usuario: "Marcos Paulo",
        handle: "@marcos_eng",
        texto: "Alguém viu um guarda-chuva cinza? Acho que esqueci no Lab 4.",
        tempo: "1h",
        tipo: "perdido",
        localItem: "Bloco A",
        comentarios: []
    }
];

function renderizarFeed() {
    if (!timeline) return;
    timeline.innerHTML = '';
    
    postsIniciais.forEach(post => {
        let comentariosHTML = '';
        if (post.comentarios) {
            post.comentarios.forEach(c => {
                comentariosHTML += `
                    <div class="single-comment">
                        <strong>@${c.autor.toLowerCase().replace(/\s+/g, '')}</strong>
                        <p>${c.texto}</p>
                    </div>
                `;
            });
        }

        // Aplica as classes visuais das tags baseadas no tipo de relato
        const badgeClass = post.tipo ? `post-badge ${post.tipo}` : 'hidden';
        const badgeTexto = post.tipo || '';

        const postHTML = `
            <article class="post-card" style="border-bottom: 1px solid var(--border-color); padding: 15px 0;">
                <div class="post-main-layout">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(post.usuario)}&background=random" style="width:44px; height:44px; border-radius:50%">
                    <div class="post-body-content">
                        <div class="post-user-info">
                            ${post.usuario} <span>${post.handle || '@'+post.usuario.toLowerCase().replace(/\s+/g, '')} · ${post.tempo}</span>
                            <span class="${badgeClass}">${badgeTexto}</span>
                        </div>
                        <div class="post-text">${post.texto}</div>
                    </div>
                </div>
                
                <div class="post-interaction-bar">
                    <div class="interaction-item" onclick="toggleSeçaoComentarios(${post.id})">
                        <i class="far fa-comment"></i> <span id="comment-count-${post.id}">${post.comentarios ? post.comentarios.length : 0}</span>
                    </div>
                    <div class="interaction-item"><i class="fas fa-retweet"></i></div>
                    <div class="interaction-item"><i class="far fa-heart"></i></div>
                </div>

                <div class="comments-section hidden" id="comments-box-${post.id}">
                    <div class="comment-box-area">
                        <input type="text" id="input-reply-${post.id}" placeholder="Escreva sua resposta...">
                        <button class="comment-reply-btn" onclick="publicarComentario(${post.id})">Responder</button>
                    </div>
                    <div id="comments-list-${post.id}">${comentariosHTML}</div>
                </div>
            </article>
        `;
        timeline.insertAdjacentHTML('beforeend', postHTML);
    });
}

// Controle do botão de postagem rápida do feed (ativa somente se houver texto)
if (postInput && submitBtn) {
    postInput.addEventListener('input', () => { 
        submitBtn.disabled = postInput.value.trim().length === 0; 
    });

    submitBtn.addEventListener('click', () => {
        const textoPost = postInput.value.trim();
        if(!textoPost) return;

        postsIniciais.unshift({
            id: Date.now(),
            usuario: nomeUsuarioLogado,
            handle: `@${nomeUsuarioLogado.toLowerCase().replace(/\s+/g, '')}`,
            texto: textoPost,
            tempo: "agora",
            comentarios: []
        });
        postInput.value = '';
        submitBtn.disabled = true;
        renderizarFeed();
    });
}

// Expandir e recolher seção de comentários
window.toggleSeçaoComentarios = function(idPost) { 
    const box = document.getElementById(`comments-box-${idPost}`);
    if (box) box.classList.toggle('hidden'); 
}

// Injetar um novo comentário no post específico
window.publicarComentario = function(idPost) {
    const input = document.getElementById(`input-reply-${idPost}`);
    if (!input) return;
    const textoComentario = input.value.trim();
    if (!textoComentario) return;

    const post = postsIniciais.find(p => p.id === idPost);
    if (post) {
        if (!post.comentarios) post.comentarios = [];
        post.comentarios.push({ autor: nomeUsuarioLogado, texto: textoComentario });
        
        const countEl = document.getElementById(`comment-count-${idPost}`);
        if (countEl) countEl.textContent = post.comentarios.length;
        
        const lista = document.getElementById(`comments-list-${idPost}`);
        if (lista) {
            lista.insertAdjacentHTML('beforeend', `
                <div class="single-comment">
                    <strong>@${nomeUsuarioLogado.toLowerCase().replace(/\s+/g, '')}</strong>
                    <p>${textoComentario}</p>
                </div>
            `);
        }
        input.value = '';
    }
}

// ==========================================================================
// 4. SISTEMA DO MODAL DE POSTAGEM COMPLETA (Botão "Relatar Item")
// ==========================================================================
const modalRelato = document.getElementById('modal-relato');
const btnAbrirRelato = document.getElementById('btn-abrir-relato');
const btnFecharModal = document.getElementById('btn-fechar-modal');
const formRelatarItem = document.getElementById('form-relatar-item');

if (btnAbrirRelato && modalRelato) btnAbrirRelato.addEventListener('click', () => modalRelato.classList.remove('hidden'));
if (btnFecharModal && modalRelato) btnFecharModal.addEventListener('click', () => modalRelato.classList.add('hidden'));

if (formRelatarItem && modalRelato) {
    formRelatarItem.addEventListener('submit', (e) => {
        e.preventDefault();
        const statusEl = document.getElementById('relato-status');
        const localEl = document.getElementById('relato-local');
        const descEl = document.getElementById('relato-descricao');

        if (!statusEl || !localEl || !descEl) return;

        // Monta o texto estruturado com as validações de status e local
        postsIniciais.unshift({
            id: Date.now(),
            usuario: nomeUsuarioLogado,
            handle: `@${nomeUsuarioLogado.toLowerCase().replace(/\s+/g, '')}`,
            texto: `[${statusEl.value.toUpperCase()} NO CAMPUS] ${descEl.value} - Região aproximada: ${localEl.value}`,
            tempo: "agora",
            tipo: statusEl.value,
            localItem: localEl.value,
            comentarios: []
        });

        formRelatarItem.reset();
        modalRelato.classList.add('hidden');
        renderizarFeed();
    });
}

// ==========================================================================
// 5. CAIXA DE MENSAGENS DIRETAS (CHAT / DMs)
// ==========================================================================
const chatWidget = document.getElementById('chat-widget');
const chatHeaderTrigger = document.getElementById('chat-header-trigger');
const btnSendChat = document.getElementById('btn-send-chat');
const chatUserInput = document.getElementById('chat-user-input');
const chatMessagesBox = document.getElementById('chat-messages-box');
const navChatBtn = document.getElementById('nav-chat-btn');

if (chatHeaderTrigger && chatWidget) chatHeaderTrigger.addEventListener('click', () => chatWidget.classList.toggle('collapsed'));
if (navChatBtn && chatWidget) navChatBtn.addEventListener('click', (e) => { e.preventDefault(); chatWidget.classList.toggle('collapsed'); });

if (btnSendChat && chatUserInput && chatMessagesBox) {
    btnSendChat.addEventListener('click', enviarMensagemChat);
    chatUserInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') enviarMensagemChat(); });
}

function enviarMensagemChat() {
    if (!chatUserInput || !chatMessagesBox) return;
    const texto = chatUserInput.value.trim();
    if (!texto) return;

    chatMessagesBox.insertAdjacentHTML('beforeend', `<div class="msg-bubble me">${texto}</div>`);
    chatUserInput.value = '';
    chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;

    // Resposta automática simulada do suporte
    setTimeout(() => {
        chatMessagesBox.insertAdjacentHTML('beforeend', `
            <div class="msg-bubble other">Olá! Sou o assistente de Achados da faculdade. Seu relato foi catalogado. Fique de olho nas notificações!</div>
        `);
        chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;
    }, 1000);
}

// ==========================================================================
// 6. LOGOUT (Ajustado para retornar para index.html do GitHub Pages)
// ==========================================================================
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    if (item.textContent.includes('Sair')) {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('usuarioLogado'); // Destrói o token de sessão ativa
            window.location.href = 'index.html'; // Redireciona para o novo login principal
        });
    }
});

// ==========================================================================
// 7. DISPARO INICIAL DOS COMPONENTES
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    carregarAcessibilidadeGlobal();
    configurarPerfilNaTela();
    renderizarFeed();
});