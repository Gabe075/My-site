let board = [];
let pieceBank = [];
let moves = 0;
let currentImage = 'images/puzzle_image1.png';
let currentDifficulty = 4; // Padrão: 4x4
let selectedPiece = null;
let selectedGridIndex = null; // Para rastrear peça selecionada no grid
const grid = document.getElementById('grid');
const pieceBankElement = document.getElementById('piece-bank');
const movesDisplay = document.getElementById('moves');
const timeDisplay = document.getElementById('time');
let timerInterval;
let seconds = 0;

// Lista de todas as imagens disponíveis
const allImages = [
    'images/puzzle_image1.png',
    'images/puzzle_image2.png',
    'images/puzzle_image3.png',
    'images/puzzle_image4.jpg',
    'images/puzzle_image5.jpg',
    'images/puzzle_image6.png',
    'images/puzzle_image7.jpg',
    'images/puzzle_image8.jpg',
    'images/puzzle_image9.jpg',
    'images/puzzle_image10.jpg'
];

// Pré-carregar imagens
const preloadImages = () => {
    allImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
};

// Inicializar modal de início
document.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    populateImageSelector();
    selectImage(currentImage); // Seleciona a imagem padrão ao carregar
});

// Funções do modal de imagem
function showImageSelector() {
    document.getElementById('imageModal').style.display = 'flex';
}

function closeImageModal() {
    document.getElementById('imageModal').style.display = 'none';
}

function populateImageSelector() {
    const imageSelectorDiv = document.getElementById('imageSelector');
    imageSelectorDiv.innerHTML = '';
    allImages.forEach(imgSrc => {
        const option = document.createElement('div');
        option.classList.add('image-option');
        option.style.backgroundImage = `url(${imgSrc})`;
        option.dataset.image = imgSrc;
        option.onclick = () => selectImage(imgSrc);
        imageSelectorDiv.appendChild(option);
    });
    // Seleciona a imagem atual
    const currentSelection = imageSelectorDiv.querySelector(`[data-image="${currentImage}"]`);
    if (currentSelection) {
        currentSelection.classList.add('selected');
    }
}

function selectImage(imageSrc) {
    currentImage = imageSrc;
    document.querySelectorAll('.image-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelector(`[data-image="${imageSrc}"]`).classList.add('selected');
    document.getElementById('reference-image').style.backgroundImage = `url(${currentImage})`;
}

function confirmImageSelection() {
    closeImageModal();
    startGame();
}

// Funções do modal de vitória
function closeWinModal() {
    document.getElementById('winModal').style.display = 'none';
    startGame(); // Inicia um novo jogo após fechar o modal de vitória
}

function startGame() {
    clearInterval(timerInterval);
    seconds = 0;
    timeDisplay.textContent = '00:00';
    timerInterval = setInterval(updateTimer, 1000);

    moves = 0;
    movesDisplay.textContent = `Jogadas: ${moves}`;
    selectedPiece = null;
    selectedGridIndex = null;
    
    const size = currentDifficulty;
    const tileSize = window.innerWidth <= 600 ? 240 / size : 320 / size;
    const gridSizePx = tileSize * size;
    
    grid.style.width = `${gridSizePx}px`;
    grid.style.height = `${gridSizePx}px`;
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    
    document.getElementById('reference-image').style.backgroundImage = `url(${currentImage})`;

    initializeBoard();
    initializePieceBank();
    renderBoard();
    renderPieceBank();
}

function updateTimer() {
    seconds++;
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    timeDisplay.textContent = `${minutes}:${secs}`;
}

function initializeBoard() {
    board = Array(currentDifficulty * currentDifficulty).fill(null); // Grid vazio
}

function initializePieceBank() {
    pieceBank = [];
    const totalTiles = currentDifficulty * currentDifficulty;
    for (let i = 1; i <= totalTiles; i++) {
        pieceBank.push(i);
    }
    // Embaralhar peças
    for (let i = pieceBank.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pieceBank[i], pieceBank[j]] = [pieceBank[j], pieceBank[i]];
    }
}

function renderBoard() {
    grid.innerHTML = ''; // Limpar o grid
    const size = currentDifficulty;
    const tileSize = window.innerWidth <= 600 ? 240 / size : 320 / size;

    board.forEach((number, index) => {
        const tile = document.createElement('div');
        tile.classList.add('puzzle-piece');
        tile.style.width = `${tileSize}px`;
        tile.style.height = `${tileSize}px`;
        
        if (number === null) {
            tile.classList.add('empty');
            tile.addEventListener('click', () => placePiece(index));
            tile.addEventListener('touchstart', (e) => {
                e.preventDefault();
                placePiece(index);
            });
        } else {
            const originalRow = Math.floor((number - 1) / size);
            const originalCol = (number - 1) % size;
            tile.style.backgroundImage = `url(${currentImage})`;
            tile.style.backgroundPosition = `${(originalCol * 100) / (size - 1)}% ${(originalRow * 100) / (size - 1)}%`;
            tile.style.backgroundSize = `${size * 100}%`;
            tile.style.zIndex = 100 - number;
            // Adicionar evento pra mover peça no grid
            tile.addEventListener('click', () => movePieceInGrid(index));
            tile.addEventListener('touchstart', (e) => {
                e.preventDefault();
                movePieceInGrid(index);
            });
        }
        
        if (selectedGridIndex === index) {
            tile.classList.add('selected');
        }
        
        tile.dataset.index = index;
        tile.dataset.number = number || 0;
        grid.appendChild(tile);
    });
}

function renderPieceBank() {
    pieceBankElement.innerHTML = ''; // Limpar a banca
    const size = currentDifficulty;
    const tileSize = window.innerWidth <= 600 ? 240 / size : 320 / size;

    pieceBank.forEach(number => {
        const tile = document.createElement('div');
        tile.classList.add('puzzle-piece', 'bank-tile');
        tile.style.width = `${tileSize}px`;
        tile.style.height = `${tileSize}px`;
        
        const originalRow = Math.floor((number - 1) / size);
        const originalCol = (number - 1) % size;
        tile.style.backgroundImage = `url(${currentImage})`;
        tile.style.backgroundPosition = `${(originalCol * 100) / (size - 1)}% ${(originalRow * 100) / (size - 1)}%`;
        tile.style.backgroundSize = `${size * 100}%`;
        tile.style.zIndex = 100 - number;
        
        tile.dataset.number = number;
        tile.addEventListener('click', () => selectPiece(number));
        tile.addEventListener('touchstart', (e) => {
            e.preventDefault();
            selectPiece(number);
        });
        
        if (selectedPiece === number) {
            tile.style.border = '2px solid var(--accent-color)';
        } else {
            tile.style.border = 'none';
        }
        
        pieceBankElement.appendChild(tile);
    });
}

function selectPiece(number) {
    selectedPiece = number;
    selectedGridIndex = null; // Desmarcar peça no grid
    renderBoard();
    renderPieceBank();
}

function placePiece(index) {
    if (selectedPiece === null || board[index] !== null) return;
    
    board[index] = selectedPiece;
    pieceBank = pieceBank.filter(num => num !== selectedPiece);
    moves++;
    movesDisplay.textContent = `Jogadas: ${moves}`;
    
    selectedPiece = null;
    renderBoard();
    renderPieceBank();
    checkWin();
}

function movePieceInGrid(index) {
    if (board[index] === null) {
        // Se clicar numa célula vazia e tiver uma peça selecionada no grid, move pra lá
        if (selectedGridIndex !== null) {
            [board[index], board[selectedGridIndex]] = [board[selectedGridIndex], board[index]];
            moves++;
            movesDisplay.textContent = `Jogadas: ${moves}`;
            selectedGridIndex = null;
            renderBoard();
            renderPieceBank();
            checkWin();
        }
        return;
    }
    
    if (selectedGridIndex === null) {
        // Seleciona a peça no grid
        selectedGridIndex = index;
        selectedPiece = null; // Desmarcar peça da banca
    } else if (selectedGridIndex === index) {
        // Se clicar na mesma peça, devolve pra banca
        pieceBank.push(board[index]);
        board[index] = null;
        moves++;
        movesDisplay.textContent = `Jogadas: ${moves}`;
        selectedGridIndex = null;
    } else {
        // Troca as peças no grid
        [board[index], board[selectedGridIndex]] = [board[selectedGridIndex], board[index]];
        moves++;
        movesDisplay.textContent = `Jogadas: ${moves}`;
        selectedGridIndex = null;
    }
    
    renderBoard();
    renderPieceBank();
    checkWin();
}

function checkWin() {
    const size = currentDifficulty;
    const totalTiles = size * size;
    const winningBoard = [];
    for (let i = 1; i <= totalTiles; i++) {
        winningBoard.push(i);
    }
    
    const isComplete = board.every(val => val !== null);
    const isCorrect = board.every((val, idx) => val === winningBoard[idx]);
    
    if (isComplete && isCorrect) {
        clearInterval(timerInterval);
        document.getElementById('finalMoves').textContent = moves;
        document.getElementById('finalTime').textContent = timeDisplay.textContent;
        document.getElementById('winModal').style.display = 'flex';
    }
}

// Inicializa o jogo com a dificuldade padrão
startGame();


