let board = [];
let selectedCell = null;
const grid = document.getElementById('grid');
const controls = document.getElementById('controls');

// Mostrar modal de início ao carregar a página
document.getElementById('startModal').style.display = 'flex';

// Configuração do menu lateral
const hamburger = document.querySelector('.hamburger');
const sidebar = document.getElementById('sidebar');
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

// Funções para controle de modais
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
    sidebar.classList.remove('open');
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Reiniciar jogo e mostrar modal inicial
function resetAndShowStartModal() {
    grid.innerHTML = '';
    controls.innerHTML = '';
    board = [];
    selectedCell = null;
    closeModal('winModal');
    openModal('startModal');
}

// Gerar tabuleiro aleatório de Sudoku
function generateRandomBoard() {
    // Inicializar tabuleiro vazio
    const newBoard = Array(9).fill().map(() => Array(9).fill(0));

    // Função para verificar se é seguro colocar um número
    function isSafe(board, row, col, num) {
        for (let x = 0; x < 9; x++) {
            if (board[row][x] === num || board[x][col] === num) return false;
        }
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[startRow + i][startCol + j] === num) return false;
            }
        }
        return true;
    }

    // Função para preencher o tabuleiro usando backtracking
    function fillBoard(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    const numbers = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
                    for (let num of numbers) {
                        if (isSafe(board, row, col, num)) {
                            board[row][col] = num;
                            if (fillBoard(board)) return true;
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    // Preencher o tabuleiro completo
    fillBoard(newBoard);

    // Remover números para criar o jogo (40 células vazias)
    let cellsToRemove = 40;
    while (cellsToRemove > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (newBoard[row][col] !== 0) {
            newBoard[row][col] = 0;
            cellsToRemove--;
        }
    }

    return newBoard;
}

// Iniciar o jogo
function startGame() {
    closeModal('startModal');
    grid.innerHTML = '';
    controls.innerHTML = '';
    board = generateRandomBoard();
    
    // Criar células do tabuleiro
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.style.border = (j % 3 === 2 && j < 8) || (i % 3 === 2 && i < 8) ? '2px solid #333' : '1px solid rgba(153, 153, 153, 0.5)';
            cell.dataset.row = i;
            cell.dataset.col = j;
            
            if (board[i][j] !== 0) {
                cell.classList.add('initial');
                addNumberToCell(cell, board[i][j]);
            } else {
                cell.addEventListener('click', selectCell);
                cell.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    selectCell(e);
                });
            }
            grid.appendChild(cell);
        }
    }
    
    // Criar botões de controle com números
    for (let num = 1; num <= 9; num++) {
        const button = document.createElement('button');
        addNumberToButton(button, num);
        
        button.addEventListener('click', () => inputNumber(num));
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            inputNumber(num);
        });
        controls.appendChild(button);
    }
}

// Adicionar número a uma célula
function addNumberToCell(cell, num) {
    const numberImg = document.createElement('img');
    numberImg.src = `images/numbers/num${num}.png`;
    numberImg.alt = num.toString();
    numberImg.className = 'cell-number';
    cell.appendChild(numberImg);
}

// Adicionar número a um botão
function addNumberToButton(button, num) {
    const numberImg = document.createElement('img');
    numberImg.src = `images/numbers/num${num}.png`;
    numberImg.alt = num.toString();
    numberImg.className = 'button-number';
    button.appendChild(numberImg);
}

// Selecionar uma célula
function selectCell(e) {
    if (selectedCell) selectedCell.classList.remove('selected');
    selectedCell = e.target.closest('.cell');
    if (!selectedCell.classList.contains('initial')) {
        selectedCell.classList.add('selected');
    }
}

// Inserir um número na célula selecionada
function inputNumber(num) {
    if (!selectedCell || selectedCell.classList.contains('initial')) return;
    
    const row = parseInt(selectedCell.dataset.row);
    const col = parseInt(selectedCell.dataset.col);
    
    // Verificar se o número é válido para esta posição
    if (isValidMove(row, col, num)) {
        // Remover número anterior se existir
        while (selectedCell.firstChild) {
            selectedCell.removeChild(selectedCell.firstChild);
        }
        
        // Adicionar o novo número
        addNumberToCell(selectedCell, num);
        
        board[row][col] = num;
        
        // Verificar se o jogo foi concluído
        if (isBoardComplete()) {
            setTimeout(() => {
                openModal('winModal');
            }, 500);
        }
    } else {
        // Mostrar animação de erro
        selectedCell.classList.add('invalid');
        setTimeout(() => {
            selectedCell.classList.remove('invalid');
        }, 300);
    }
}

// Verificar se um movimento é válido
function isValidMove(row, col, num) {
    // Verificar linha
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num) return false;
    }
    
    // Verificar coluna
    for (let i = 0; i < 9; i++) {
        if (board[i][col] === num) return false;
    }
    
    // Verificar quadrante 3x3
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) return false;
        }
    }
    
    return true;
}

// Verificar se o tabuleiro está completo
function isBoardComplete() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) return false;
        }
    }
    return true;
}
