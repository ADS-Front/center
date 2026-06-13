// Mock / Banco de dados simulado do projeto
const itensMock = [
    {
        id: 1,
        titulo: "iPhone 13 Azul",
        status: "perdido",
        categoria: "eletronicos",
        local: "cantina",
        data: "12 Jun 2026",
        descricao: "Esquecido em cima de uma das mesas da praça de alimentação no horário do almoço. Capinha preta."
    },
    {
        id: 2,
        titulo: "Carteira de Identidade (RG)",
        status: "achado",
        categoria: "documentos",
        local: "bloco-a",
        data: "11 Jun 2026",
        descricao: "Encontrada no chão do corredor do 2º andar do Bloco A. Nome: João Silva Santos."
    },
    {
        id: 3,
        titulo: "Chave com chaveiro do Star Wars",
        status: "perdido",
        categoria: "chaves",
        local: "estacionamento",
        data: "10 Jun 2026",
        descricao: "Perdi um molho de chaves próximo às vagas de moto. O chaveiro é o Darth Vader."
    },
    {
        id: 4,
        titulo: "Caderno Universitário 10 matérias",
        status: "achado",
        categoria: "outros",
        local: "bloco-b",
        data: "08 Jun 2026",
        descricao: "Caderno espiral preto deixado na sala 302 do Bloco B."
    }
];

// Elementos do DOM
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search');
const tabButtons = document.querySelectorAll('.tab-btn');
const selectCategory = document.getElementById('filter-category');
const selectLocation = document.getElementById('filter-location');
const btnResetFilters = document.getElementById('btn-reset-filters');
const resultsFeed = document.getElementById('results-feed');

// Estado da busca global
let filtroTexto = '';
let filtroStatus = 'todos'; // abas: todos, perdido, achado
let filtroCategoria = 'todos';
let filtroLocal = 'todos';

// Mapeamento de ícones visuais baseado na categoria
const iconesCategorias = {
    eletronicos: 'fa-mobile-alt',
    documentos: 'fa-id-card',
    chaves: 'fa-key',
    outros: 'fa-box'
};

// Função para renderizar os itens na tela
function renderizarItens() {
    // Filtragem lógica
    const itensFiltrados = itensMock.filter(item => {
        const matchesTexto = item.titulo.toLowerCase().includes(filtroTexto.toLowerCase()) || 
                             item.descricao.toLowerCase().includes(filtroTexto.toLowerCase());
        const matchesStatus = filtroStatus === 'todos' || item.status === filtroStatus;
        const matchesCategoria = filtroCategoria === 'todos' || item.categoria === filtroCategoria;
        const matchesLocal = filtroLocal === 'todos' || item.local === filtroLocal;

        return matchesTexto && matchesStatus && matchesCategoria && matchesLocal;
    });

    // Limpa o feed
    resultsFeed.innerHTML = '';

    if (itensFiltrados.length === 0) {
        resultsFeed.innerHTML = `<div class="no-results"><p>Nenhum item encontrado para os filtros aplicados.</p></div>`;
        return;
    }

    // Cria o HTML de cada card dinamicamente
    itensFiltrados.forEach(item => {
        const iconClass = iconesCategorias[item.categoria] || 'fa-question';
        const card = document.createElement('article');
        card.classList.add('item-card');

        card.innerHTML = `
            <div class="item-icon-area">
                <div class="avatar-badge">
                    <i class="fas ${iconClass}"></i>
                </div>
            </div>
            <div class="item-content">
                <div class="item-header">
                    <span class="item-title">${item.titulo}</span>
                    <span class="status-badge ${item.status}">${item.status.toUpperCase()}</span>
                </div>
                <p class="item-details">${item.descricao}</p>
                <div class="item-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${item.local.toUpperCase().replace('-', ' ')}</span>
                    <span><i class="far fa-calendar-alt"></i> ${item.data}</span>
                </div>
            </div>
        `;
        resultsFeed.appendChild(card);
    });
}

// Ouvintes de Eventos (Listeners)

// Entrada de Texto na busca
searchInput.addEventListener('input', (e) => {
    filtroTexto = e.target.value;
    if (filtroTexto.length > 0) {
        clearSearchBtn.classList.remove('hidden');
    } else {
        clearSearchBtn.classList.add('hidden');
    }
    renderizarItens();
});

// Botão de limpar o texto da busca
clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    filtroTexto = '';
    clearSearchBtn.classList.add('hidden');
    renderizarItens();
});

// Cliques nas Abas (Status)
tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filtroStatus = btn.getAttribute('data-filter');
        renderizarItens();
    });
});

// Mudança nos selects da barra lateral
selectCategory.addEventListener('change', (e) => {
    filtroCategoria = e.target.value;
    renderizarItens();
});

selectLocation.addEventListener('change', (e) => {
    filtroLocal = e.target.value;
    renderizarItens();
});

// Botão de resetar todos os filtros
btnResetFilters.addEventListener('click', () => {
    selectCategory.value = 'todos';
    selectLocation.value = 'todos';
    filtroCategoria = 'todos';
    filtroLocal = 'todos';
    renderizarItens();
});

// Renderização inicial ao carregar a página
document.addEventListener('DOMContentLoaded', renderizarItens);