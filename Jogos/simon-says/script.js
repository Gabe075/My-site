let sequence = [];
let playerSequence = [];
let round = 0;
let canClick = false;
const grid = document.getElementById('grid');
const scoreDisplay = document.getElementById('score');
const colors = ['red', 'green', 'blue', 'yellow'];

// Pré-carregar imagens (opcional, mas boa prática)
const images = {
    red: new Image(),
    green: new Image(),
    blue: new Image(),
    yellow: new Image()
};
images.red.src = 'images/button_red.png';
images.green.src = 'images/button_green.png';
images.blue.src = 'images/button_blue.png';
images.yellow.src = 'images/button_yellow.png';

// Mostrar modal de início ao carregar a página
document.getElementById('startModal').style.display = 'flex';

// Configuração do menu lateral
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

// Funções para controle de modais
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'flex';
    if (sidebar) sidebar.classList.remove('open');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

function resetAndShowStartModal() {
    grid.innerHTML = '';
    sequence = [];
    playerSequence = [];
    round = 0;
    canClick = false;
    scoreDisplay.textContent = `Rodada: ${round}`;
    closeModal('winModal');
    closeModal('loseModal');
    openModal('startModal');
}

function startGame() {
    closeModal('startModal');
    grid.innerHTML = '';
    sequence = [];
    playerSequence = [];
    round = 0;
    canClick = false;
    scoreDisplay.textContent = `Rodada: ${round}`;
    for (let i = 0; i < 4; i++) {
        const cell = document.createElement('div');
        cell.className = `cell ${colors[i]}`;
        cell.dataset.index = i;
        cell.addEventListener('click', () => playerClick(i));
        cell.addEventListener('touchstart', (e) => {
            e.preventDefault();
            playerClick(i);
        });
        grid.appendChild(cell);
    }
    setTimeout(nextRound, 500); // Pequeno delay antes de começar
}

function nextRound() {
    round++;
    scoreDisplay.textContent = `Rodada: ${round}`;
    sequence.push(Math.floor(Math.random() * 4));
    playerSequence = [];
    canClick = false; // Desabilita cliques durante a sequência
    playSequence();
}

function playSequence() {
    let i = 0;
    const interval = setInterval(() => {
        if (i >= sequence.length) {
            clearInterval(interval);
            canClick = true; // Habilita cliques após a sequência
            return;
        }
        const cellIndex = sequence[i];
        const cell = grid.children[cellIndex];
        cell.classList.add('active');
        // Adicionar som aqui se desejar
        setTimeout(() => cell.classList.remove('active'), 400); // Tempo de brilho reduzido
        i++;
    }, 800); // Intervalo entre brilhos
}

function playerClick(index) {
    if (!canClick) return; // Ignora cliques se não for a vez do jogador

    playerSequence.push(index);
    const cell = grid.children[index];
    cell.classList.add('active');
    // Adicionar som aqui se desejar
    setTimeout(() => cell.classList.remove('active'), 200);

    // Verifica se o clique atual está correto
    if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
        canClick = false;
        openModal('loseModal');
        return;
    }

    // Verifica se a sequência do jogador está completa
    if (playerSequence.length === sequence.length) {
        canClick = false;
        if (round >= 10) {
            openModal('winModal');
        } else {
            setTimeout(nextRound, 1000); // Avança para a próxima rodada
        }
    }
}

