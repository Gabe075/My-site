// Lista de jogos com descrições e categorias
const jogos = [
    {
        nome: "Jogo da Memória",
        pasta: "jogo-da-memoria",
        categoria: "puzzle",
        icone: "fas fa-brain",
        dificuldade: 2,
        descricao: "Teste sua memória encontrando pares de cartas iguais. Um clássico jogo que exercita a mente e melhora a concentração."
    },
    {
        nome: "Quebra Cabeça",
        pasta: "quebra-cabeca",
        categoria: "puzzle",
        icone: "fas fa-puzzle-piece",
        dificuldade: 3,
        descricao: "Monte a imagem movendo as peças para os lugares corretos. Desafie sua lógica e paciência neste puzzle clássico."
    },
    {
        nome: "Damas",
        pasta: "damas",
        categoria: "strategy",
        icone: "fas fa-chess-board",
        dificuldade: 4,
        descricao: "Jogo de estratégia clássico onde você deve capturar todas as peças do adversário. Planeje seus movimentos com cuidado."
    },
    {
        nome: "Forca",
        pasta: "forca",
        categoria: "puzzle",
        icone: "fas fa-spell-check",
        dificuldade: 2,
        descricao: "Adivinhe a palavra secreta antes que o desenho seja completado. Teste seu vocabulário e conhecimento."
    },
    {
        nome: "Jogo da Velha",
        pasta: "jogo-da-velha",
        categoria: "strategy",
        icone: "fas fa-times",
        dificuldade: 1,
        descricao: "O clássico jogo de X e O. Seja o primeiro a formar uma linha de três símbolos iguais para vencer."
    },
    {
        nome: "Palavras Cruzadas",
        pasta: "palavras-cruzadas",
        categoria: "puzzle",
        icone: "fas fa-th",
        dificuldade: 4,
        descricao: "Complete as palavras cruzadas usando as dicas fornecidas. Expanda seu vocabulário e conhecimento geral."
    },
    {
        nome: "Caça Palavras",
        pasta: "caca-palavras",
        categoria: "puzzle",
        icone: "fas fa-search",
        dificuldade: 2,
        descricao: "Encontre palavras escondidas em uma grade de letras. Procure em todas as direções para descobrir todas as palavras."
    },
    {
        nome: "Campo Minado",
        pasta: "campo-minado",
        categoria: "strategy",
        icone: "fas fa-bomb",
        dificuldade: 3,
        descricao: "Descubra todas as células sem explodir as minas. Use a lógica e os números para navegar com segurança."
    },
    {
        nome: "Batalha Naval",
        pasta: "batalha-naval",
        categoria: "strategy",
        icone: "fas fa-ship",
        dificuldade: 3,
        descricao: "Afunde a frota inimiga antes que afundem a sua. Estratégia e sorte se combinam neste jogo naval clássico."
    },
    {
        nome: "Jogo da Cobra",
        pasta: "snake",
        categoria: "arcade",
        icone: "fas fa-snake",
        dificuldade: 2,
        descricao: "Controle a cobra para comer frutas e crescer, mas cuidado para não bater nas paredes ou em si mesma."
    },
    {
        nome: "Pong",
        pasta: "pong",
        categoria: "arcade",
        icone: "fas fa-table-tennis",
        dificuldade: 2,
        descricao: "O primeiro videogame da história! Controle a raquete e não deixe a bola passar. Reflexos rápidos são essenciais."
    },
    {
        nome: "Tetris",
        pasta: "tetris",
        categoria: "puzzle",
        icone: "fas fa-cubes",
        dificuldade: 3,
        descricao: "Encaixe as peças que caem para formar linhas completas. Um dos jogos mais viciantes já criados."
    },
    {
        nome: "Flappy Bird",
        pasta: "flappy-bird",
        categoria: "arcade",
        icone: "fas fa-dove",
        dificuldade: 4,
        descricao: "Guie o pássaro através dos obstáculos tocando na tela. Simples de jogar, difícil de dominar."
    },
    {
        nome: "Sudoku",
        pasta: "sudoku",
        categoria: "puzzle",
        icone: "fas fa-th-large",
        dificuldade: 4,
        descricao: "Complete a grade 9x9 com números de 1 a 9, sem repetir em linhas, colunas ou quadrados. Pura lógica."
    },
    {
        nome: "Space Invaders",
        pasta: "space-invaders",
        categoria: "action",
        icone: "fas fa-rocket",
        dificuldade: 3,
        descricao: "Defenda a Terra dos invasores espaciais! Atire nos alienígenas antes que eles cheguem até você."
    },
    {
        nome: "Simon Says",
        pasta: "simon-says",
        categoria: "puzzle",
        icone: "fas fa-lightbulb",
        dificuldade: 2,
        descricao: "Memorize e repita a sequência de cores e sons. Teste sua memória visual e auditiva."
    },
    {
        nome: "Pac Man",
        pasta: "pac-man",
        categoria: "arcade",
        icone: "fas fa-circle",
        dificuldade: 3,
        descricao: "Colete todos os pontos enquanto foge dos fantasmas. Use os power-ups para virar o jogo a seu favor."
    },
    {
        nome: "Combinar 3 Emojis",
        pasta: "combinar-3-emojis",
        categoria: "puzzle",
        icone: "fas fa-smile",
        dificuldade: 2,
        descricao: "Combine três ou mais emojis iguais para eliminá-los. Um jogo colorido e divertido para todas as idades."
    },
    {
        nome: "Arkanoid Advanced",
        pasta: "arkanoid-advanced",
        categoria: "arcade",
        icone: "fas fa-square",
        dificuldade: 3,
        descricao: "Quebre todos os blocos com a bola, controlando a plataforma. Versão avançada do clássico Breakout."
    },
    {
        nome: "Acertei a Toupeira",
        pasta: "acertei-a-toupeira",
        categoria: "action",
        icone: "fas fa-hammer",
        dificuldade: 2,
        descricao: "Acerte as toupeiras que aparecem nos buracos. Teste seus reflexos neste jogo divertido e rápido."
    },
    {
        nome: "2048",
        pasta: "2048",
        categoria: "puzzle",
        icone: "fas fa-calculator",
        dificuldade: 3,
        descricao: "Combine números iguais para chegar ao 2048. Um puzzle matemático viciante que desafia sua estratégia."
    },
    {
        nome: "Quebra Cabeça Imagem",
        pasta: "quebra-cabeca-t",
        categoria: "puzzle",
        icone: "fas fa-image",
        dificuldade: 3,
        descricao: "Monte a imagem deslizando as peças para os lugares corretos. Versão visual do quebra-cabeça clássico."
    },
    {
        nome: "Breakout Arkanoid",
        pasta: "breakout-arkanoid",
        categoria: "arcade",
        icone: "fas fa-square-full",
        dificuldade: 2,
        descricao: "Quebre todos os blocos rebatendo a bola com sua plataforma. O clássico jogo que inspirou muitos outros."
    }
];

// Categorias disponíveis
const categorias = {
    all: { nome: "Todos", icone: "fas fa-th" },
    puzzle: { nome: "Puzzle", icone: "fas fa-puzzle-piece" },
    arcade: { nome: "Arcade", icone: "fas fa-rocket" },
    strategy: { nome: "Estratégia", icone: "fas fa-chess" },
    classic: { nome: "Clássicos", icone: "fas fa-crown" },
    action: { nome: "Ação", icone: "fas fa-fist-raised" }
};

// Estado da aplicação
let currentSection = 'home';
let currentFilter = 'all';
let mobileMenuOpen = false;

// Elementos DOM
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const gamesGrid = document.getElementById('games-grid');
const gameModal = document.getElementById('gameModal');
const loadingOverlay = document.getElementById('loadingOverlay');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Esconder overlay de carregamento ao carregar a página
    hideLoadingOverlay();
    
    initializeApp();
    populateGamesGrid();
    setupEventListeners();
    updateGameCount();
});

// Esconder overlay quando o usuário volta à página
window.addEventListener('pageshow', function(event) {
    hideLoadingOverlay();
});

// Esconder overlay quando a página fica visível novamente
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        hideLoadingOverlay();
    }
});

// Configurar event listeners
function setupEventListeners() {
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            if (section) {
                showSection(section);
                updateActiveNavLink(link);
            }
        });
    });

    // Mobile navigation links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const section = link.getAttribute('data-section');
            if (section) {
                e.preventDefault();
                showSection(section);
                closeMobileMenu();
            }
        });
    });

    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);

    // Category filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            filterGames(category);
            updateActiveFilter(btn);
        });
    });

    // Close modal when clicking outside
    gameModal.addEventListener('click', (e) => {
        if (e.target === gameModal) {
            closeGameModal();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeGameModal();
            closeMobileMenu();
        }
    });
}

// Inicializar aplicação
function initializeApp() {
    showSection('home');
    updateActiveNavLink(document.querySelector('.nav-link[data-section="home"]'));
}

// Mostrar seção
function showSection(sectionId) {
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
    }
}

// Atualizar link ativo na navegação
function updateActiveNavLink(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
    mobileMenu.classList.toggle('active', mobileMenuOpen);
    
    // Animate hamburger icon
    const icon = mobileMenuToggle.querySelector('i');
    icon.className = mobileMenuOpen ? 'fas fa-times' : 'fas fa-bars';
}

// Fechar mobile menu
function closeMobileMenu() {
    mobileMenuOpen = false;
    mobileMenu.classList.remove('active');
    const icon = mobileMenuToggle.querySelector('i');
    icon.className = 'fas fa-bars';
}

// Popular grid de jogos
function populateGamesGrid() {
    if (!gamesGrid) return;
    
    gamesGrid.innerHTML = '';
    
    const filteredGames = currentFilter === 'all' 
        ? jogos 
        : jogos.filter(jogo => jogo.categoria === currentFilter);
    
    filteredGames.forEach(jogo => {
        const gameCard = createGameCard(jogo);
        gamesGrid.appendChild(gameCard);
    });
}

// Criar card do jogo
function createGameCard(jogo) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.setAttribute('data-category', jogo.categoria);
    
    const difficultyStars = '★'.repeat(jogo.dificuldade) + '☆'.repeat(5 - jogo.dificuldade);
    const categoryName = categorias[jogo.categoria]?.nome || jogo.categoria;
    
    card.innerHTML = `
        <div class="game-card-header">
            <div class="game-icon">
                <i class="${jogo.icone}"></i>
            </div>
            <div class="game-title">${jogo.nome}</div>
            <div class="game-category">${categoryName}</div>
        </div>
        <div class="game-card-body">
            <div class="game-description">${jogo.descricao}</div>
            <div class="game-meta">
                <div class="difficulty">
                    <span>Dificuldade:</span>
                    <span class="difficulty-stars">${difficultyStars}</span>
                </div>
            </div>
            <button class="play-btn" onclick="openGameModal('${jogo.pasta}')">
                <i class="fas fa-play"></i>
                Jogar Agora
            </button>
        </div>
    `;
    
    return card;
}

// Filtrar jogos por categoria
function filterGames(category) {
    currentFilter = category;
    populateGamesGrid();
    
    // Animate cards
    const cards = document.querySelectorAll('.game-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.3s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

// Atualizar filtro ativo
function updateActiveFilter(activeBtn) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    activeBtn.classList.add('active');
}

// Abrir modal do jogo
function openGameModal(gamePasta) {
    const jogo = jogos.find(j => j.pasta === gamePasta);
    if (!jogo) return;
    
    const modal = document.getElementById('gameModal');
    const title = document.getElementById('modalGameTitle');
    const description = document.getElementById('modalGameDescription');
    const category = document.getElementById('modalGameCategory');
    const difficulty = document.getElementById('modalGameDifficulty');
    const playBtn = document.getElementById('playGameBtn');
    
    if (title) title.textContent = jogo.nome;
    if (description) description.textContent = jogo.descricao;
    if (category) category.textContent = categorias[jogo.categoria]?.nome || jogo.categoria;
    if (difficulty) difficulty.textContent = '★'.repeat(jogo.dificuldade) + '☆'.repeat(5 - jogo.dificuldade);
    
    if (playBtn) {
        playBtn.onclick = () => {
            closeGameModal();
            loadGame(jogo.pasta);
        };
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Fechar modal do jogo
function closeGameModal() {
    const modal = document.getElementById('gameModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Carregar jogo
function loadGame(gamePasta) {
    showLoadingOverlay();
    
    // Simular carregamento
    setTimeout(() => {
        window.location.href = `Jogos/${gamePasta}/index.html`;
    }, 1000);
}

// Mostrar overlay de carregamento
function showLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.add('active');
}

// Esconder overlay de carregamento
function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.remove('active');
}

// Scroll para estatísticas
function scrollToStats() {
    const statsSection = document.getElementById('stats');
    if (statsSection) {
        statsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Atualizar contagem de jogos
function updateGameCount() {
    const totalGamesElement = document.getElementById('total-games');
    if (totalGamesElement) {
        // Animar contagem
        let count = 0;
        const target = jogos.length;
        const increment = target / 30;
        
        const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
                count = target;
                clearInterval(timer);
            }
            totalGamesElement.textContent = Math.floor(count);
        }, 50);
    }
}

// Funções de utilidade
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer para animações
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos para animação
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.stat-card, .game-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
});

// Atualizar ano no footer (se existir)
const currentYearElement = document.getElementById('currentYear');
if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}

