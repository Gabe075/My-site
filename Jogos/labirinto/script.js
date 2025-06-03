// Definição dos níveis do labirinto
const levels = [
    // Nível 1 - Fácil
    {
        layout: [
            "WWWWWWWWWWW",
            "WP       GW",
            "W WWWWWW WW",
            "W W      WW",
            "W W WWWW WW",
            "W W W    WW",
            "W W W WWWWW",
            "W W W    CW",
            "W W WWWW WW",
            "W        WW",
            "WWWWWWWWWWW"
        ],
        coins: 1
    },
    // Nível 2 - Médio
    {
        layout: [
            "WWWWWWWWWWWWW",
            "WP  W     W W",
            "WWW W WWW W W",
            "W   W W C W W",
            "W WWWWW WWW W",
            "W       W   W",
            "WWWWWWW W WWW",
            "W     W W   W",
            "W WWW W WWW W",
            "W W   W     W",
            "W W WWWWWWW W",
            "W C       GWW",
            "WWWWWWWWWWWWW"
        ],
        coins: 2
    },
    // Nível 3 - Difícil
    {
        layout: [
            "WWWWWWWWWWWWWWW",
            "WP  W     W   W",
            "WWW W WWW WWW W",
            "W   W W C W   W",
            "W WWWWW WWW WWW",
            "W       W     W",
            "WWWWWWW W WWWWW",
            "W     W W     W",
            "W WWW W WWWWW W",
            "W W   W     W W",
            "W W WWWWWWW W W",
            "W C         W W",
            "WWWWWWWWWWW W W",
            "WG        C   W",
            "WWWWWWWWWWWWWWW"
        ],
        coins: 3
    }
];

// Variáveis do jogo
let currentLevel = 0;
let playerPosition = { x: 0, y: 0 };
let gameArea;
let player;
let cellSize;
let coinsCollected = 0;
let totalCoins = 0;
let moves = 0;
let gameStarted = false;

// Elementos DOM
const gameAreaElement = document.getElementById('game-area');
const coinsDisplay = document.getElementById('coins');
const movesDisplay = document.getElementById('moves');
const levelDisplay = document.getElementById('level');

// Inicializar o jogo
function initGame() {
    // Limpar área de jogo
    gameAreaElement.innerHTML = '';
    
    // Resetar variáveis
    coinsCollected = 0;
    moves = 0;
    
    // Atualizar displays
    updateStats();
    
    // Obter layout do nível atual
    const level = levels[currentLevel];
    totalCoins = level.coins;
    
    // Calcular tamanho das células
    const rows = level.layout.length;
    const cols = level.layout[0].length;
    
    // Ajustar tamanho das células com base no tamanho da tela
    const gameAreaWidth = window.innerWidth <= 600 ? 300 : 500;
    cellSize = Math.floor(gameAreaWidth / cols);
    
    // Ajustar tamanho da área de jogo
    gameAreaElement.style.width = `${cellSize * cols}px`;
    gameAreaElement.style.height = `${cellSize * rows}px`;
    
    // Criar o labirinto
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const cell = level.layout[y][x];
            
            if (cell === 'W') {
                // Parede
                createMazeElement('wall', x, y);
            } else if (cell === 'P') {
                // Posição inicial do jogador
                playerPosition = { x, y };
            } else if (cell === 'G') {
                // Objetivo
                createMazeElement('goal', x, y);
            } else if (cell === 'C') {
                // Moeda
                createMazeElement('coin', x, y);
            }
        }
    }
    
    // Criar o jogador
    player = document.createElement('div');
    player.className = 'player';
    player.style.width = `${cellSize}px`;
    player.style.height = `${cellSize}px`;
    player.style.left = `${playerPosition.x * cellSize}px`;
    player.style.top = `${playerPosition.y * cellSize}px`;
    gameAreaElement.appendChild(player);
    
    // Iniciar o jogo
    gameStarted = true;
}

// Criar elemento do labirinto
function createMazeElement(type, x, y) {
    const element = document.createElement('div');
    element.className = `maze-cell ${type}`;
    element.style.width = `${cellSize}px`;
    element.style.height = `${cellSize}px`;
    element.style.left = `${x * cellSize}px`;
    element.style.top = `${y * cellSize}px`;
    element.dataset.x = x;
    element.dataset.y = y;
    gameAreaElement.appendChild(element);
    return element;
}

// Mover o jogador
function movePlayer(dx, dy) {
    if (!gameStarted) return;
    
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;
    
    // Verificar se a nova posição é válida
    if (isValidMove(newX, newY)) {
        // Atualizar posição do jogador
        playerPosition.x = newX;
        playerPosition.y = newY;
        
        // Mover o elemento do jogador
        player.style.left = `${playerPosition.x * cellSize}px`;
        player.style.top = `${playerPosition.y * cellSize}px`;
        
        // Incrementar contador de movimentos
        moves++;
        updateStats();
        
        // Verificar colisões
        checkCollisions();
    }
}

// Verificar se o movimento é válido
function isValidMove(x, y) {
    const level = levels[currentLevel];
    
    // Verificar se está dentro dos limites
    if (x < 0 || y < 0 || y >= level.layout.length || x >= level.layout[0].length) {
        return false;
    }
    
    // Verificar se não é uma parede
    return level.layout[y][x] !== 'W';
}

// Verificar colisões
function checkCollisions() {
    const level = levels[currentLevel];
    const currentCell = level.layout[playerPosition.y][playerPosition.x];
    
    // Verificar se coletou uma moeda
    if (currentCell === 'C') {
        // Atualizar layout para remover a moeda
        level.layout[playerPosition.y] = level.layout[playerPosition.y].substring(0, playerPosition.x) + ' ' + level.layout[playerPosition.y].substring(playerPosition.x + 1);
        
        // Remover elemento da moeda
        const coinElement = document.querySelector(`.coin[data-x="${playerPosition.x}"][data-y="${playerPosition.y}"]`);
        if (coinElement) {
            coinElement.remove();
        }
        
        // Incrementar contador de moedas
        coinsCollected++;
        updateStats();
    }
    
    // Verificar se chegou ao objetivo
    if (currentCell === 'G') {
        // Verificar se coletou todas as moedas
        if (coinsCollected >= totalCoins) {
            // Completou o nível
            gameStarted = false;
            
            // Verificar se é o último nível
            if (currentLevel === levels.length - 1) {
                // Completou o jogo
                showModal('winModal');
            } else {
                // Avançar para o próximo nível
                document.getElementById('nextLevelBtn').style.display = 'inline-block';
                document.getElementById('restartLevelBtn').style.display = 'inline-block';
                showModal('levelCompleteModal');
            }
        } else {
            // Mostrar mensagem para coletar todas as moedas
            showModal('collectCoinsModal');
        }
    }
}

// Atualizar estatísticas
function updateStats() {
    coinsDisplay.textContent = `${coinsCollected}/${totalCoins}`;
    movesDisplay.textContent = moves;
    levelDisplay.textContent = currentLevel + 1;
}

// Controles de teclado
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            movePlayer(0, -1);
            break;
        case 'ArrowDown':
            movePlayer(0, 1);
            break;
        case 'ArrowLeft':
            movePlayer(-1, 0);
            break;
        case 'ArrowRight':
            movePlayer(1, 0);
            break;
    }
});

// Funções para os botões de controle
function moveUp() {
    movePlayer(0, -1);
}

function moveDown() {
    movePlayer(0, 1);
}

function moveLeft() {
    movePlayer(-1, 0);
}

function moveRight() {
    movePlayer(1, 0);
}

// Funções para modais
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Funções para níveis
function selectLevel(level) {
    currentLevel = level;
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`level-${level}`).classList.add('active');
    initGame();
    closeModal('startModal');
}

function nextLevel() {
    if (currentLevel < levels.length - 1) {
        currentLevel++;
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`level-${currentLevel}`).classList.add('active');
    }
    closeModal('levelCompleteModal');
    initGame();
}

function restartLevel() {
    closeModal('levelCompleteModal');
    initGame();
}

// Sidebar e eventos
const hamburger = document.querySelector('.hamburger');
const sidebar = document.getElementById('sidebar');
if (hamburger && sidebar) {
    hamburger.addEventListener('click', () => sidebar.classList.toggle('open'));
    hamburger.addEventListener('touchstart', (e) => {
        e.preventDefault();
        sidebar.classList.toggle('open');
    });
    document.addEventListener('click', (event) => {
        if (!event.target.closest('#sidebar') && !event.target.closest('.hamburger') && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });
}

// Inicializar o jogo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    showModal('startModal');
});
