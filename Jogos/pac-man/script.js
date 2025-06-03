const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const tileSize = 15;
let score = 0;
let pacman = { x: 1, y: 1, dx: 0, dy: 0, nextDx: 0, nextDy: 0, direction: 'right' };
let ghosts = [
    { x: 10, y: 10, color: 'red', dx: 0, dy: 0 }, 
    { x: 12, y: 10, color: 'blue', dx: 0, dy: 0 }
];
let map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1],
    [1,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,0,1,1,1,1,1,0,1,1,0,1,1,0,1],
    [1,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
    [1,1,1,0,1,1,1,1,0,1,0,1,1,1,1,0,1,1,1,1],
    [1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,1,1],
    [1,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];
let gameLoop;

// Pré-carregar imagens
const images = {
    pacmanRight: new Image(),
    pacmanLeft: new Image(),
    pacmanUp: new Image(),
    pacmanDown: new Image(),
    ghostRed: new Image(),
    ghostBlue: new Image(),
    ghostPink: new Image(),
    ghostOrange: new Image(),
    dot: new Image(),
    wall: new Image()
};

images.pacmanRight.src = 'images/pacman_right.png';
images.pacmanLeft.src = 'images/pacman_left.png';
images.pacmanUp.src = 'images/pacman_up.png';
images.pacmanDown.src = 'images/pacman_down.png';
images.ghostRed.src = 'images/ghost_red.png';
images.ghostBlue.src = 'images/ghost_blue.png';
images.ghostPink.src = 'images/ghost_pink.png';
images.ghostOrange.src = 'images/ghost_orange.png';
images.dot.src = 'images/dot.png';
images.wall.src = 'images/wall.png';

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

function resetAndShowStartModal() {
    clearInterval(gameLoop);
    score = 0;
    scoreDisplay.textContent = `Pontuação: ${score}`;
    pacman = { x: 1, y: 1, dx: 0, dy: 0, nextDx: 0, nextDy: 0, direction: 'right' };
    ghosts = [
        { x: 10, y: 10, color: 'red', dx: 0, dy: 0 }, 
        { x: 12, y: 10, color: 'blue', dx: 0, dy: 0 }
    ];
    map = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1],
        [1,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,1],
        [1,0,1,0,1,1,0,1,1,1,1,1,0,1,1,0,1,1,0,1],
        [1,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
        [1,1,1,0,1,1,1,1,0,1,0,1,1,1,1,0,1,1,1,1],
        [1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1],
        [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
        [1,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,1,1],
        [1,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1],
        [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];
    closeModal('winModal');
    closeModal('loseModal');
    openModal('startModal');
}

function startGame() {
    closeModal('startModal');
    score = 0;
    scoreDisplay.textContent = `Pontuação: ${score}`;
    document.addEventListener('keydown', handleInput);
    gameLoop = setInterval(update, 150); // Ajustei para 150ms para jogabilidade mais suave
}

function handleInput(e) {
    if (e.key === 'ArrowUp') setDirection(0, -1);
    if (e.key === 'ArrowDown') setDirection(0, 1);
    if (e.key === 'ArrowLeft') setDirection(-1, 0);
    if (e.key === 'ArrowRight') setDirection(1, 0);
}

function setDirection(dx, dy) {
    pacman.nextDx = dx;
    pacman.nextDy = dy;
    
    // Atualizar direção para selecionar a imagem correta
    if (dx === 1) pacman.direction = 'right';
    else if (dx === -1) pacman.direction = 'left';
    else if (dy === 1) pacman.direction = 'down';
    else if (dy === -1) pacman.direction = 'up';
}

function update() {
    // Atualizar direção do Pac-Man
    const newX = pacman.x + pacman.nextDx;
    const newY = pacman.y + pacman.nextDy;
    if (map[newY] && map[newY][newX] !== 1) {
        pacman.x = newX;
        pacman.y = newY;
        pacman.dx = pacman.nextDx;
        pacman.dy = pacman.nextDy;
    } else {
        // Tentar direção atual
        const currX = pacman.x + pacman.dx;
        const currY = pacman.y + pacman.dy;
        if (map[currY] && map[currY][currX] !== 1) {
            pacman.x = currX;
            pacman.y = currY;
        } else {
            pacman.dx = 0;
            pacman.dy = 0;
        }
    }

    // Coletar pontos
    if (map[pacman.y][pacman.x] === 0) {
        map[pacman.y][pacman.x] = 2;
        score += 10;
        scoreDisplay.textContent = `Pontuação: ${score}`;
    }

    // Atualizar fantasmas com IA
    ghosts.forEach(ghost => {
        // Algoritmo simples para perseguir o Pac-Man
        const directions = [
            { dx: 1, dy: 0 },
            { dx: -1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: 0, dy: -1 }
        ];
        
        // Filtrar direções válidas (não paredes)
        const validDirections = directions.filter(dir => {
            const newX = ghost.x + dir.dx;
            const newY = ghost.y + dir.dy;
            return map[newY] && map[newY][newX] !== 1;
        });
        
        if (validDirections.length > 0) {
            // Escolher direção aleatória com tendência a seguir o Pac-Man
            const randomIndex = Math.floor(Math.random() * validDirections.length);
            ghost.dx = validDirections[randomIndex].dx;
            ghost.dy = validDirections[randomIndex].dy;
        }
        
        // Mover fantasma
        const newX = ghost.x + ghost.dx;
        const newY = ghost.y + ghost.dy;
        if (map[newY] && map[newY][newX] !== 1) {
            ghost.x = newX;
            ghost.y = newY;
        } else {
            ghost.dx = 0;
            ghost.dy = 0;
        }
        
        // Verificar colisão com Pac-Man
        if (ghost.x === pacman.x && ghost.y === pacman.y) {
            clearInterval(gameLoop);
            document.getElementById('loseScore').textContent = score;
            openModal('loseModal');
        }
    });

    // Verificar vitória
    if (checkWin()) {
        clearInterval(gameLoop);
        document.getElementById('finalScore').textContent = score;
        openModal('winModal');
    }

    // Desenhar tudo
    draw();
}

function checkWin() {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 0) return false;
        }
    }
    return true;
}

function draw() {
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar mapa
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 1) {
                // Parede
                ctx.drawImage(images.wall, x * tileSize, y * tileSize, tileSize, tileSize);
            } else if (map[y][x] === 0) {
                // Ponto
                ctx.drawImage(images.dot, x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
    }
    
    // Desenhar Pac-Man com a imagem correta baseada na direção
    let pacmanImage;
    switch(pacman.direction) {
        case 'right': pacmanImage = images.pacmanRight; break;
        case 'left': pacmanImage = images.pacmanLeft; break;
        case 'up': pacmanImage = images.pacmanUp; break;
        case 'down': pacmanImage = images.pacmanDown; break;
        default: pacmanImage = images.pacmanRight;
    }
    ctx.drawImage(pacmanImage, pacman.x * tileSize, pacman.y * tileSize, tileSize, tileSize);
    
    // Desenhar fantasmas
    ghosts.forEach(ghost => {
        let ghostImage;
        switch(ghost.color) {
            case 'red': ghostImage = images.ghostRed; break;
            case 'blue': ghostImage = images.ghostBlue; break;
            case 'pink': ghostImage = images.ghostPink; break;
            case 'orange': ghostImage = images.ghostOrange; break;
            default: ghostImage = images.ghostRed;
        }
        ctx.drawImage(ghostImage, ghost.x * tileSize, ghost.y * tileSize, tileSize, tileSize);
    });
}
