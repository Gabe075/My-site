const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let gameState = {
    paddle: { x: 110, y: 340, width: 50, height: 10, speed: 5 },
    ball: { x: 135, y: 330, radius: 5, dx: 3, dy: -3 },
    blocks: [], enemies: [], projectiles: [], powerUps: [],
    lives: 3, level: 1, maxLevels: 10, score: 0
};
let isGameRunning = false;

// Pré-carregar imagens
const images = {
    paddle: new Image(),
    ball: new Image(),
    blockRed: new Image(),
    blockBlue: new Image(),
    blockGreen: new Image(),
    blockYellow: new Image(),
    blockPurple: new Image(),
    enemy: new Image(),
    powerUp: new Image()
};

images.paddle.src = 'images/paddle.png';
images.ball.src = 'images/ball.png';
images.blockRed.src = 'images/block_red.png';
images.blockBlue.src = 'images/block_blue.png';
images.blockGreen.src = 'images/block_green.png';
images.blockYellow.src = 'images/block_yellow.png';
images.blockPurple.src = 'images/block_purple.png';
images.enemy.src = 'images/enemy.png';
images.powerUp.src = 'images/powerup.png';

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
    isGameRunning = false;
    gameState = {
        paddle: { x: 110, y: 340, width: 50, height: 10, speed: 5 },
        ball: { x: 135, y: 330, radius: 5, dx: 3, dy: -3 },
        blocks: [], enemies: [], projectiles: [], powerUps: [],
        lives: 3, level: 1, maxLevels: 10, score: 0
    };
    closeModal('winModal');
    closeModal('gameOverModal');
    openModal('startModal');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function generateLevel() {
    gameState.blocks = [];
    gameState.enemies = [];
    const rows = 3 + Math.floor(gameState.level / 3);
    const cols = 8;
    const blockTypes = ['red', 'blue', 'green', 'yellow', 'purple'];
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (Math.random() < 0.7) {
                const isEnemy = gameState.level > 3 && Math.random() < 0.2;
                const x = 20 + j * 30;
                const y = 20 + i * 20;
                if (isEnemy) {
                    gameState.enemies.push({ x, y, width: 20, height: 10 });
                } else {
                    // Escolher um tipo de bloco aleatório
                    const blockType = blockTypes[Math.floor(Math.random() * blockTypes.length)];
                    gameState.blocks.push({ x, y, width: 20, height: 10, type: blockType });
                }
            }
        }
    }
}

function startGame() {
    closeModal('startModal');
    generateLevel();
    isGameRunning = true;
    gameLoop();
    
    // Adicionar controles de teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'a') {
            movePlayer(-1);
        } else if (e.key === 'ArrowRight' || e.key === 'd') {
            movePlayer(1);
        }
    });
    
    // Adicionar controles de toque para dispositivos móveis
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
}

function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    
    // Determinar direção com base na posição do toque
    if (touchX < canvas.width / 2) {
        movePlayer(-1);
    } else {
        movePlayer(1);
    }
}

function movePlayer(direction) {
    if (!isGameRunning) return;
    
    const newX = gameState.paddle.x + (direction * gameState.paddle.speed);
    if (newX >= 0 && newX <= canvas.width - gameState.paddle.width) {
        gameState.paddle.x = newX;
    }
}

function gameLoop() {
    if (!isGameRunning) return;
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function update() {
    // Mover bola
    gameState.ball.x += gameState.ball.dx;
    gameState.ball.y += gameState.ball.dy;
    if (gameState.ball.x - gameState.ball.radius < 0 || gameState.ball.x + gameState.ball.radius > canvas.width) {
        gameState.ball.dx = -gameState.ball.dx;
    }
    if (gameState.ball.y - gameState.ball.radius < 0) {
        gameState.ball.dy = -gameState.ball.dy;
    }
    if (gameState.ball.y > canvas.height) {
        gameState.lives--;
        if (gameState.lives <= 0) {
            isGameRunning = false;
            openModal('gameOverModal');
        } else {
            gameState.ball = { x: 135, y: 330, radius: 5, dx: 3, dy: -3 };
        }
    }

    // Colisão com raquete
    if (gameState.ball.y + gameState.ball.radius > gameState.paddle.y &&
        gameState.ball.x > gameState.paddle.x &&
        gameState.ball.x < gameState.paddle.x + gameState.paddle.width) {
        gameState.ball.dy = -Math.abs(gameState.ball.dy);
        gameState.ball.dx += (gameState.ball.x - (gameState.paddle.x + gameState.paddle.width / 2)) * 0.1;
    }

    // Colisão com blocos
    for (let i = gameState.blocks.length - 1; i >= 0; i--) {
        const block = gameState.blocks[i];
        if (gameState.ball.y - gameState.ball.radius < block.y + block.height &&
            gameState.ball.y + gameState.ball.radius > block.y &&
            gameState.ball.x > block.x &&
            gameState.ball.x < block.x + block.width) {
            gameState.blocks.splice(i, 1);
            gameState.ball.dy = -gameState.ball.dy;
            gameState.score += 10;
            if (Math.random() < 0.5) {
                gameState.powerUps.push({ x: block.x, y: block.y, width: 10, height: 10, type: 'bigPaddle' });
            }
        }
    }

    // Colisão com inimigos
    for (let i = gameState.enemies.length - 1; i >= 0; i--) {
        const enemy = gameState.enemies[i];
        if (gameState.ball.y - gameState.ball.radius < enemy.y + enemy.height &&
            gameState.ball.y + gameState.ball.radius > enemy.y &&
            gameState.ball.x > enemy.x &&
            gameState.ball.x < enemy.x + enemy.width) {
            gameState.enemies.splice(i, 1);
            gameState.ball.dy = -gameState.ball.dy;
            gameState.score += 20;
        }
    }

    // Mover projéteis
    for (let i = gameState.projectiles.length - 1; i >= 0; i--) {
        const proj = gameState.projectiles[i];
        proj.y += proj.dy;
        if (proj.y > canvas.height || proj.y < 0) {
            gameState.projectiles.splice(i, 1);
            continue;
        }
        if (proj.dy > 0 && proj.y + 5 > gameState.paddle.y &&
            proj.x > gameState.paddle.x &&
            proj.x < gameState.paddle.x + gameState.paddle.width) {
            proj.dy = -proj.dy;
            gameState.score += 5;
        }
    }

    // Gerar projéteis
    if (Math.random() < 0.01) {
        gameState.enemies.forEach(enemy => {
            gameState.projectiles.push({ x: enemy.x + 10, y: enemy.y + 10, width: 5, height: 5, dy: 2 });
        });
    }

    // Mover power-ups
    for (let i = gameState.powerUps.length - 1; i >= 0; i--) {
        const powerUp = gameState.powerUps[i];
        powerUp.y += 1;
        if (powerUp.y > canvas.height) {
            gameState.powerUps.splice(i, 1);
            continue;
        }
        if (powerUp.y + powerUp.height > gameState.paddle.y &&
            powerUp.x > gameState.paddle.x &&
            powerUp.x < gameState.paddle.x + gameState.paddle.width) {
            if (powerUp.type === 'bigPaddle') {
                gameState.paddle.width = Math.min(gameState.paddle.width + 10, 100);
                setTimeout(() => {
                    gameState.paddle.width = Math.max(gameState.paddle.width - 10, 50);
                }, 10000);
            }
            gameState.powerUps.splice(i, 1);
        }
    }

    // Verificar nível concluído
    if (gameState.blocks.length === 0 && gameState.enemies.length === 0) {
        gameState.level++;
        if (gameState.level > gameState.maxLevels) {
            isGameRunning = false;
            openModal('winModal');
        } else {
            generateLevel();
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar raquete
    ctx.drawImage(images.paddle, gameState.paddle.x, gameState.paddle.y, gameState.paddle.width, gameState.paddle.height);
    
    // Desenhar bola
    ctx.drawImage(images.ball, gameState.ball.x - gameState.ball.radius, gameState.ball.y - gameState.ball.radius, 
                 gameState.ball.radius * 2, gameState.ball.radius * 2);
    
    // Desenhar blocos
    gameState.blocks.forEach(block => {
        let blockImage;
        switch(block.type) {
            case 'red': blockImage = images.blockRed; break;
            case 'blue': blockImage = images.blockBlue; break;
            case 'green': blockImage = images.blockGreen; break;
            case 'yellow': blockImage = images.blockYellow; break;
            case 'purple': blockImage = images.blockPurple; break;
            default: blockImage = images.blockRed;
        }
        ctx.drawImage(blockImage, block.x, block.y, block.width, block.height);
    });
    
    // Desenhar inimigos
    gameState.enemies.forEach(enemy => {
        ctx.drawImage(images.enemy, enemy.x, enemy.y, enemy.width, enemy.height);
    });
    
    // Desenhar projéteis
    gameState.projectiles.forEach(proj => {
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(proj.x, proj.y, proj.width, proj.height);
    });
    
    // Desenhar power-ups
    gameState.powerUps.forEach(powerUp => {
        ctx.drawImage(images.powerUp, powerUp.x, powerUp.y, powerUp.width, powerUp.height);
    });
    
    // Desenhar HUD
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText(`Vidas: ${gameState.lives}`, 10, 20);
    ctx.fillText(`Nível: ${gameState.level}/${gameState.maxLevels}`, 100, 20);
    ctx.fillText(`Pontuação: ${gameState.score}`, 10, 40);
}
