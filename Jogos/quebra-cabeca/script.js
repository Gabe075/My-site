let board = [];
let moves = 0;
let currentImage = 'puzzle_image1.png';
let currentDifficulty = 4; // Padrão: 4x4
const grid = document.getElementById('grid');
const movesDisplay = document.getElementById('moves');
let tiles = []; // Para armazenar as peças e permitir animações

// Pré-carregar imagens
const preloadImages = () => {
    const images = [
        'images/background.png',
        'images/puzzle_image1.png',
        'images/puzzle_image2.png',
        'images/puzzle_image3.png'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
};

// Inicializar modal de início ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    document.getElementById('startModal').style.display = 'flex';
    
    // Configurar opções de imagem
    document.querySelectorAll('.image-option').forEach(option => {
        const imageSrc = option.dataset.image;
        option.style.backgroundImage = `url(images/${imageSrc})`;
    });
});

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

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
    sidebar.classList.remove('open');
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function selectImage(imageSrc) {
    currentImage = imageSrc;
    document.querySelectorAll('.image-option').forEach(option => {
        option.classList.remove('active');
    });
    document.querySelector(`[data-image="${imageSrc}"]`).classList.add('active');
}

function selectDifficulty(size) {
    currentDifficulty = size;
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`diff-${size}`).classList.add('active');
}

function startGame() {
    closeModal('startModal');
    closeModal('winModal');
    grid.innerHTML = '';
    moves = 0;
    movesDisplay.textContent = `Jogadas: ${moves}`;
    
    // Ajustar tamanho do grid com base na dificuldade
    const tileSize = window.innerWidth <= 600 ? 240 / currentDifficulty : 320 / currentDifficulty;
    const gap = 5;
    const gridSize = (tileSize + gap) * currentDifficulty - gap;
    
    grid.style.width = `${gridSize}px`;
    grid.style.height = `${gridSize}px`;
    
    initializeBoard();
    shuffleBoard();
    renderBoard();
}

function initializeBoard() {
    board = [];
    tiles = [];
    const totalTiles = currentDifficulty * currentDifficulty;
    
    for (let i = 0; i < totalTiles; i++) {
        board.push(i); // 0 representa o espaço vazio
    }
}

function shuffleBoard() {
    // Embaralha o tabuleiro de forma que seja solucionável
    do {
        for (let i = board.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [board[i], board[j]] = [board[j], board[i]];
        }
    } while (!isSolvable(board));
}

function isSolvable(board) {
    let inversions = 0;
    const size = currentDifficulty;
    
    // Contar inversões
    for (let i = 0; i < board.length; i++) {
        for (let j = i + 1; j < board.length; j++) {
            if (board[i] > board[j] && board[i] !== 0 && board[j] !== 0) {
                inversions++;
            }
        }
    }
    
    // Para tabuleiros de tamanho ímpar, o número de inversões deve ser par
    if (size % 2 === 1) {
        return inversions % 2 === 0;
    } 
    // Para tabuleiros de tamanho par, a paridade depende da posição da peça vazia
    else {
        const emptyRow = Math.floor(board.indexOf(0) / size);
        // Se a peça vazia está em uma linha par (contando de baixo), inversões deve ser ímpar
        return (emptyRow % 2 === 0) ? inversions % 2 === 1 : inversions % 2 === 0;
    }
}

function renderBoard() {
    grid.innerHTML = ''; // Limpar o grid
    tiles = []; // Limpar o array de tiles
    
    const size = currentDifficulty;
    const tileSize = window.innerWidth <= 600 ? 240 / size : 320 / size;
    const gap = 5;

    board.forEach((number, index) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        
        if (number === 0) {
            tile.classList.add('empty');
        } else {
            // Calcular posição da imagem para este pedaço
            const originalRow = Math.floor((number - 1) / size);
            const originalCol = (number - 1) % size;
            
            // Definir background-position para mostrar apenas a parte correta da imagem
            tile.style.backgroundImage = `url(images/${currentImage})`;
            tile.style.backgroundPosition = `${(originalCol * 100) / (size - 1)}% ${(originalRow * 100) / (size - 1)}%`;
            tile.style.backgroundSize = `${size * 100}%`;
        }
        
        tile.dataset.index = index;
        tile.dataset.number = number;

        // Calcular posição para animação
        const row = Math.floor(index / size);
        const col = index % size;
        tile.style.left = `${col * (tileSize + gap)}px`;
        tile.style.top = `${row * (tileSize + gap)}px`;
        tile.style.width = `${tileSize}px`;
        tile.style.height = `${tileSize}px`;

        // Adicionar evento de clique apenas para peças não vazias
        if (number !== 0) {
            tile.addEventListener('click', () => moveTile(index));
        }

        grid.appendChild(tile);
        tiles[number] = tile; // Armazenar a peça
    });
}

function moveTile(index) {
    const emptyIndex = board.indexOf(0);
    if (canMove(index, emptyIndex)) {
        // Animação: mover a peça clicada e o espaço vazio
        const tile = tiles[board[index]];
        const emptyTile = tiles[0];
        
        const size = currentDifficulty;
        const tileSize = window.innerWidth <= 600 ? 240 / size : 320 / size;
        const gap = 5;

        const row = Math.floor(index / size);
        const col = index % size;
        const emptyRow = Math.floor(emptyIndex / size);
        const emptyCol = emptyIndex % size;

        // Atualizar posições para animação
        tile.style.left = `${emptyCol * (tileSize + gap)}px`;
        tile.style.top = `${emptyRow * (tileSize + gap)}px`;
        emptyTile.style.left = `${col * (tileSize + gap)}px`;
        emptyTile.style.top = `${row * (tileSize + gap)}px`;

        // Atualizar o array board
        [board[index], board[emptyIndex]] = [board[emptyIndex], board[index]];

        // Atualizar os tiles
        tiles[board[index]] = tile;
        tiles[board[emptyIndex]] = emptyTile;

        moves++;
        movesDisplay.textContent = `Jogadas: ${moves}`;

        // Verificar vitória após a animação
        setTimeout(() => {
            checkWin();
        }, 200); // Tempo da animação (0.2s)
    }
}

function canMove(index, emptyIndex) {
    const size = currentDifficulty;
    const row = Math.floor(index / size);
    const col = index % size;
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;

    // Verifica se o movimento é para uma posição adjacente (cima, baixo, esquerda, direita)
    return (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
           (col === emptyCol && Math.abs(row - emptyRow) === 1);
}

function checkWin() {
    const size = currentDifficulty;
    const totalTiles = size * size;
    const winningBoard = [];
    
    for (let i = 1; i < totalTiles; i++) {
        winningBoard.push(i);
    }
    winningBoard.push(0); // Última posição é o espaço vazio

    if (board.every((val, idx) => val === winningBoard[idx])) {
        document.getElementById('finalMoves').textContent = moves;
        document.getElementById('winModal').style.display = 'flex';
    }
}
