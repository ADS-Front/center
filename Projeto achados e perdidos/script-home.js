const postInput = document.getElementById('post-text');
const submitBtn = document.getElementById('submit-post');
const timeline = document.getElementById('timeline');

// Dados iniciais para popular o feed
const postsIniciais = [
    {
        usuario: "Ana Clara",
        handle: "@ana_unidb",
        texto: "Encontrei um estojo de óculos no Bloco B. Vou deixar na secretaria!",
        tempo: "10min"
    },
    {
        usuario: "Marcos Paulo",
        handle: "@marcos_eng",
        texto: "Alguém viu um guarda-chuva cinza? Acho que esqueci no Lab 4.",
        tempo: "1h"
    }
];

// Habilita/Desabilita botão de postar
postInput.addEventListener('input', () => {
    submitBtn.disabled = postInput.value.trim().length === 0;
});

// Adiciona um post na tela
function adicionarPost(usuario, handle, texto, tempo) {
    const postHTML = `
        <article class="post-card">
            <img src="https://ui-avatars.com/api/?name=${usuario}&background=random" style="width:48px; height:48px; border-radius:50%">
            <div class="post-content">
                <div class="post-user-info">
                    ${usuario} <span>${handle} · ${tempo}</span>
                </div>
                <div class="post-text">${texto}</div>
                <div style="color: var(--text-muted); display:flex; gap: 40px; margin-top:10px">
                    <i class="far fa-comment"></i>
                    <i class="fas fa-retweet"></i>
                    <i class="far fa-heart"></i>
                </div>
            </div>
        </article>
    `;
    timeline.insertAdjacentHTML('afterbegin', postHTML);
}

// Evento de publicar
submitBtn.addEventListener('click', () => {
    const texto = postInput.value;
    adicionarPost("Você", "@seu_usuario", texto, "agora");
    postInput.value = '';
    submitBtn.disabled = true;
});

// Carrega posts iniciais
postsIniciais.forEach(p => adicionarPost(p.usuario, p.handle, p.texto, p.tempo));