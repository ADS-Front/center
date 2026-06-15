const postInput = document.getElementById('post-text');
const submitBtn = document.getElementById('submit-post');
const timeline = document.getElementById('timeline');
let currentFontSize = 15;

// Inicializa lendo preferências anteriores do LocalStorage
const temaSalvo = localStorage.getItem('temaPreferido');
if (temaSalvo === 'claro') {
    document.body.classList.add('light-theme');
}
const fonteSalva = localStorage.getItem('tamanhoFontePreferido');
if (fonteSalva) {
    currentFontSize = parseFloat(fonteSalva);
    document.documentElement.style.setProperty('--main-font-size', fonteSalva);
}

const nomeUsuarioLogado = localStorage.getItem('usuarioLogado') || 'Aluno Conectado';

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

// --- BOTÕES DE ACESSIBILIDADE (GRAVANDO PREFERÊNCIAS) ---
document.getElementById('btn-toggle-theme').addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    localStorage.setItem('temaPreferido', document.body.classList.contains('light-theme') ? 'claro' : 'escuro');
    const icon = document.getElementById('btn-toggle-theme').querySelector('i');
    icon.className = document.body.classList.contains('light-theme') ? 'fas fa-sun' : 'fas fa-moon';
});

document.getElementById('btn-font-plus').addEventListener('click', () => {
    if(currentFontSize < 24) {
        currentFontSize += 1.5;
        const tamanhoStr = currentFontSize + 'px';
        document.documentElement.style.setProperty('--main-font-size', tamanhoStr);
        localStorage.setItem('tamanhoFontePreferido', tamanhoStr);
    }
});

document.getElementById('btn-font-minus').addEventListener('click', () => {
    if(currentFontSize > 12) {
        currentFontSize -= 1.5;
        const tamanhoStr = currentFontSize + 'px';
        document.documentElement.style.setProperty('--main-font-size', tamanhoStr);
        localStorage.setItem('tamanhoFontePreferido', tamanhoStr);
    }
});

// --- GESTÃO DE MODAL (RELATAR ITEM) ---
const modalRelato = document.getElementById('modal-relato');
const btnAbrirRelato = document.getElementById('btn-abrir-relato');
const btnFecharModal = document.getElementById('btn-fechar-modal');
const formRelatarItem = document.getElementById('form-relatar-item');

if(btnAbrirRelato) btnAbrirRelato.addEventListener('click', () => modalRelato.classList.remove('hidden'));
if(btnFecharModal) btnFecharModal.addEventListener('click', () => modalRelato.classList.add('hidden'));

if(formRelatarItem) {
    formRelatarItem.addEventListener('submit', (e) => {
        e.preventDefault();
        const status = document.getElementById('relato-status').value;
        const local = document.getElementById('relato-local').value;
        const descricao = document.getElementById('relato-descricao').value;

        postsIniciais.unshift({
            id: Date.now(),
            usuario: nomeUsuarioLogado,
            handle: `@${nomeUsuarioLogado.toLowerCase().replace(/\s+/g, '')}`,
            texto: `[${status.toUpperCase()} NO CAMPUS] ${descricao} - Ocorrido perto de: ${local}`,
            tempo: "agora",
            tipo: status,
            localItem: local,
            comentarios: []
        });
        formRelatarItem.reset();
        modalRelato.classList.add('hidden');
        renderizarFeed();
    });
}

// --- CONTROLE DE MENSAGENS (CHAT) ---
const chatWidget = document.getElementById('chat-widget');
const chatHeaderTrigger = document.getElementById('chat-header-trigger');
const btnSendChat = document.getElementById('btn-send-chat');
const chatUserInput = document.getElementById('chat-user-input');
const chatMessagesBox = document.getElementById('chat-messages-box');
const navChatBtn = document.getElementById('nav-chat-btn');

if(chatHeaderTrigger) chatHeaderTrigger.addEventListener('click', () => chatWidget.classList.toggle('collapsed'));
if(navChatBtn) navChatBtn.addEventListener('click', (e) => { e.preventDefault(); chatWidget.classList.toggle('collapsed'); });

if(btnSendChat) {
    btnSendChat.addEventListener('click', enviarMensagemChat);
    chatUserInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') enviarMensagemChat(); });
}

function enviarMensagemChat() {
    const texto = chatUserInput.value.trim();
    if(!texto) return;
    chatMessagesBox.insertAdjacentHTML('beforeend', `<div class="msg-bubble me">${texto}</div>`);
    chatUserInput.value = '';
    chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;

    setTimeout(() => {
        chatMessagesBox.insertAdjacentHTML('beforeend', `<div class="msg-bubble other">Olá! Sou o assistente de Achados. Seu relato foi catalogado no sistema. Fique atento às notificações!</div>`);
        chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;
    }, 1000);
}

// --- CONFIGURAÇÃO E EXECUÇÃO DO FEED ---
function configurarPerfilNaTela() {
    document.getElementById('sidebar-user-name').textContent = nomeUsuarioLogado;
    document.getElementById('header-welcome-title').textContent = nomeUsuarioLogado;
    const handleFormatado = `@${nomeUsuarioLogado.toLowerCase().replace(/\s+/g, '')}`;
    document.getElementById('sidebar-user-handle').textContent = handleFormatado;
    document.getElementById('header-user-handle').textContent = handleFormatado;
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(nomeUsuarioLogado)}&background=1d9bf0&color=fff`;
    document.getElementById('user-avatar-img').src = avatarUrl;
    document.querySelector('.user-profile-img-raw').src = avatarUrl;
}

function renderizarFeed() {
    if(!timeline) return;
    timeline.innerHTML = '';
    postsIniciais.forEach(post => {
        let comentariosHTML = '';
        post.comentarios.forEach(c => {
            comentariosHTML += `<div class="single-comment"><strong>@${c.autor.toLowerCase()}</strong><p>${c.texto}</p></div>`;
        });

        const badgeClass = post.tipo ? `post-badge ${post.tipo}` : 'hidden';
        const badgeTexto = post.tipo || '';

        const postHTML = `
            <article class="post-card" style="border-bottom: 1px solid var(--border-color); padding: 15px 0;">
                <div class="post-main-layout">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(post.usuario)}&background=random" style="width:44px; height:44px; border-radius:50%">
                    <div class="post-body-content">
                        <div class="post-user-info">
                            ${post.usuario} <span>${post.handle || '@'+post.usuario.toLowerCase()} · ${post.tempo}</span>
                            <span class="${badgeClass}">${badgeTexto}</span>
                        </div>
                        <div class="post-text">${post.texto}</div>
                    </div>
                </div>
                <div class="post-interaction-bar">
                    <div class="interaction-item" onclick="toggleSeçaoComentarios(${post.id})">
                        <i class="far fa-comment"></i> <span id="comment-count-${post.id}">${post.comentarios.length}</span>
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

if(postInput) {
    postInput.addEventListener('input', () => { submitBtn.disabled = postInput.value.trim().length === 0; });
    submitBtn.addEventListener('click', () => {
        postsIniciais.unshift({
            id: Date.now(), usuario: nomeUsuarioLogado, handle: `@${nomeUsuarioLogado.toLowerCase().replace(/\s+/g, '')}`,
            texto: postInput.value, tempo: "agora", comentarios: []
        });
        postInput.value = ''; submitBtn.disabled = true; renderizarFeed();
    });
}

window.toggleSeçaoComentarios = function(idPost) { document.getElementById(`comments-box-${idPost}`).classList.toggle('hidden'); }

window.publicarComentario = function(idPost) {
    const input = document.getElementById(`input-reply-${idPost}`);
    const textoComentario = input.value.trim();
    if(!textoComentario) return;

    const post = postsIniciais.find(p => p.id === idPost);
    if(post) {
        post.comentarios.push({ autor: nomeUsuarioLogado, texto: textoComentario });
        document.getElementById(`comment-count-${idPost}`).textContent = post.comentarios.length;
        document.getElementById(`comments-list-${idPost}`).insertAdjacentHTML('beforeend', `
            <div class="single-comment"><strong>@${nomeUsuarioLogado.toLowerCase().replace(/\s+/g, '')}</strong><p>${textoComentario}</p></div>
        `);
        input.value = '';
    }
}

document.addEventListener('DOMContentLoaded', () => { configurarPerfilNaTela(); renderizarFeed(); });