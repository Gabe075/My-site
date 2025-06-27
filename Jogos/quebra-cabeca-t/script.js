let board = [];
let pieceBank = [];
let moves = 0;
let currentImage = 'puzzle_image1.png';
let currentDifficulty = 4; // Padrão: 4x4
let selectedPiece = null;
let selectedGridIndex = null; // Para rastrear peça selecionada no grid
const grid = document.getElementById('grid');
const pieceBankElement = document.getElementById('piece-bank');
const movesDisplay = document.getElementById('moves');
const referencePreview = document.getElementById('reference-preview');

// Pré-carregar imagens
const preloadImages = () => {
    const images = [
        'images/background.png',
        'images/puzzle_image1.png',
        'images/puzzle_image2.png',
        'images/puzzle_image3.png',
        'images/puzzle_image4.jpg',
        'images/puzzle_image5.jpg',
        'images/puzzle_image6.jpg',
        'images/puzzle_image7.jpg',
        'images/puzzle_image8.jpg',
        'images/puzzle_image9.jpg',
        'images/puzzle_image10.jpg'
    ];
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
};

// Inicializar modal de início
document.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    document.getElementById('startModal').style.display = 'flex';
    document.querySelectorAll('.image-option').forEach(option => {
        const imageSrc = option.dataset.image;
        option.style.backgroundImage = `url(images/${imageSrc})`;
    });
    // Selecionar primeira imagem por padrão
    selectImage('puzzle_image1.png');
});

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
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
    
    // Atualizar imagem de referência
    if (referencePreview) {
        referencePreview.style.backgroundImage = `url(images/${imageSrc})`;
    }
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
    pieceBankElement.innerHTML = '';
    moves = 0;
    selectedPiece = null;
    selectedGridIndex = null;
    movesDisplay.textContent = `Jogadas: ${moves}`;
    
    // Atualizar imagem de referência
    referencePreview.style.backgroundImage = `url(images/${currentImage})`;
    
    const tileSize = window.innerWidth <= 480 ? 240 / currentDifficulty : 
                    window.innerWidth <= 768 ? 280 / currentDifficulty : 
                    320 / currentDifficulty;
    const gridSize = tileSize * currentDifficulty;
    
    grid.style.width = `${gridSize}px`;
    grid.style.height = `${gridSize}px`;
    grid.style.gridTemplateColumns = `repeat(${currentDifficulty}, 1fr)`;
    grid.style.setProperty('--size', currentDifficulty);
    
    initializeBoard();
    initializePieceBank();
    renderBoard();
    renderPieceBank();
}

function initializeBoard() {
    board = Array(currentDifficulty * currentDifficulty).fill(null); // Grid vazio
    console.log('Tabuleiro inicializado:', board); // Debug
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
    console.log('Banca de peças inicializada:', pieceBank); // Debug
}

function renderBoard() {
    grid.innerHTML = ''; // Limpar o grid
    const size = currentDifficulty;
    const tileSize = window.innerWidth <= 480 ? 240 / size : 
                    window.innerWidth <= 768 ? 280 / size : 
                    320 / size;

    board.forEach((number, index) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
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
            tile.style.backgroundImage = `url(images/${currentImage})`;
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
    console.log('Tabuleiro renderizado:', board); // Debug
}

function renderPieceBank() {
    pieceBankElement.innerHTML = ''; // Limpar a banca
    const size = currentDifficulty;
    const bankTileSize = window.innerWidth <= 480 ? 40 : 
                       window.innerWidth <= 768 ? 50 : 60;

    pieceBank.forEach(number => {
        const tile = document.createElement('div');
        tile.classList.add('tile', 'bank-tile');
        tile.style.width = `${bankTileSize}px`;
        tile.style.height = `${bankTileSize}px`;
        
        const originalRow = Math.floor((number - 1) / size);
        const originalCol = (number - 1) % size;
        tile.style.backgroundImage = `url(images/${currentImage})`;
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
            tile.style.border = '3px solid var(--primary-color)';
            tile.style.boxShadow = '0 0 15px rgba(99, 102, 241, 0.5)';
        } else {
            tile.style.border = '2px solid transparent';
            tile.style.boxShadow = 'var(--shadow-md)';
        }
        
        pieceBankElement.appendChild(tile);
    });
    console.log('Banca renderizada:', pieceBank); // Debug
}

function selectPiece(number) {
    selectedPiece = number;
    selectedGridIndex = null; // Desmarcar peça no grid
    renderBoard();
    renderPieceBank();
    console.log('Peça selecionada da banca:', number); // Debug
}

function placePiece(index) {
    if (selectedPiece === null || board[index] !== null) return;
    
    board[index] = selectedPiece;
    pieceBank = pieceBank.filter(num => num !== selectedPiece);
    moves++;
    movesDisplay.textContent = `Jogadas: ${moves}`;
    console.log('Peça posicionada:', selectedPiece, 'no índice', index); // Debug
    console.log('Estado atual - Board:', board, 'PieceBank:', pieceBank); // Debug
    
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
            console.log('Peça movida no grid:', board[selectedGridIndex], 'de', selectedGridIndex, 'para', index); // Debug
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
        console.log('Peça selecionada no grid:', board[index], 'no índice', index); // Debug
    } else if (selectedGridIndex === index) {
        // Se clicar na mesma peça, devolve pra banca
        pieceBank.push(board[index]);
        board[index] = null;
        moves++;
        movesDisplay.textContent = `Jogadas: ${moves}`;
        console.log('Peça devolvida à banca:', board[index], 'do índice', index); // Debug
        selectedGridIndex = null;
    } else {
        // Troca as peças no grid
        [board[index], board[selectedGridIndex]] = [board[selectedGridIndex], board[index]];
        moves++;
        movesDisplay.textContent = `Jogadas: ${moves}`;
        console.log('Peça movida no grid:', board[selectedGridIndex], 'de', selectedGridIndex, 'para', index); // Debug
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
        document.getElementById('finalMoves').textContent = moves;
        document.getElementById('winModal').style.display = 'flex';
        console.log('Vitória detectada:', board); // Debug
    } else {
        console.log('Ainda não venceu - Completo:', isComplete, 'Correto:', isCorrect); // Debug
    }
}

