// ====== ACESSIBILIDADE GLOBAL (CARREGAMENTO) ======
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
// ===================================================

const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search');
const tabButtons = document.querySelectorAll('.tab-btn');
const selectCategory = document.getElementById('filter-category');
const selectLocation = document.getElementById('filter-location');
const btnResetFilters = document.getElementById('btn-reset-filters');
const resultsFeed = document.getElementById('results-feed');

const itensMock = [
    { id: 1, titulo: "iPhone 13 Azul", status: "perdido", categoria: "eletronicos", local: "cantina", data: "Hoje", descricao: "Esquecido em cima de uma das mesas no almoço." },
    { id: 2, titulo: "Carteira com RG", status: "achado", categoria: "documentos", local: "bloco-a", data: "Ontem", descricao: "Encontrada no corredor do 2º andar do Bloco A." },
    { id: 3, titulo: "Chaveiro Star Wars", status: "perdido", categoria: "chaves", local: "estacionamento", data: "10 Jun", descricao: "Perdi um molho de chaves próximo às vagas de moto." }
];

let filtroTexto = '';
let filtroStatus = 'todos';
let filtroCategoria = 'todos';
let filtroLocal = 'todos';

function renderizarItens() {
    if(!resultsFeed) return;
    const filtrados = itensMock.filter(item => {
        const mTexto = item.titulo.toLowerCase().includes(filtroTexto) || item.descricao.toLowerCase().includes(filtroTexto);
        const mStatus = filtroStatus === 'todos' || item.status === filtroStatus;
        const mCat = filtroCategoria === 'todos' || item.categoria === filtroCategoria;
        const mLoc = filtroLocal === 'todos' || item.local === filtroLocal;
        return mTexto && mStatus && mCat && mLoc;
    });

    resultsFeed.innerHTML = '';
    if (filtrados.length === 0) {
        resultsFeed.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted);"><p>Nenhum item correspondente encontrado.</p></div>`;
        return;
    }

    filtrados.forEach(item => {
        resultsFeed.innerHTML += `
            <article class="item-card" style="display:flex; padding:16px; border-bottom:1px solid var(--border-color); gap:12px;">
                <div style="background:var(--bg-secondary); width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center;"><i class="fas fa-box"></i></div>
                <div style="flex:1;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <strong>${item.titulo}</strong>
                        <span class="status-badge ${item.status}">${item.status}</span>
                    </div>
                    <p style="margin-top:4px; font-size:14px; line-height:1.4;">${item.descricao}</p>
                    <div class="item-meta">
                        <span><i class="fas fa-map-marker-alt"></i> ${item.local.toUpperCase()}</span>
                        <span><i class="far fa-calendar-alt"></i> ${item.data}</span>
                    </div>
                </div>
            </article>
        `;
    });
}

if(searchInput) {
    searchInput.addEventListener('input', (e) => {
        filtroTexto = e.target.value.toLowerCase();
        renderizarItens();
    });
}

if(selectCategory) selectCategory.addEventListener('change', (e) => { filtroCategoria = e.target.value; renderizarItens(); });
if(selectLocation) selectLocation.addEventListener('change', (e) => { filtroLocal = e.target.value; renderizarItens(); });

document.addEventListener('DOMContentLoaded', renderizarItens);