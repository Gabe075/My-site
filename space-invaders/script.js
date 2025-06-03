const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let gameState = {
    player: { x: 110, y: 340, width: 30, height: 20, speed: 5 },
    aliens: [], playerBullets: [], alienBullets: [],
    lives: 3, wave: 1, maxWaves: 5, score: 0,
    isShooting: false, lastShotTime: 0
};
let isGameRunning = false;

// Pré-carregar imagens
const images = {
    playerShip: new Image(),
    alienGreen: new Image(),
    alienRed: new Image(),
    alienBlue: new Image(),
    bullet: new Image(),
    alienBullet: new Image()
};

images.playerShip.src = 'images/player_ship.png';
images.alienGreen.src = 'images/alien_green.png';
images.alienRed.src = 'images/alien_red.png';
images.alienBlue.src = 'images/alien_blue.png';
images.bullet.src = 'images/bullet.png';
images.alienBullet.src = 'images/alien_bullet.png';

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
        player: { x: 110, y: 340, width: 30, height: 20, speed: 5 },
        aliens: [], playerBullets: [], alienBullets: [],
        lives: 3, wave: 1, maxWaves: 5, score: 0,
        isShooting: false, lastShotTime: 0
    };
    closeModal('winModal');
    closeModal('gameOverModal');
    openModal('startModal');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function generateWave() {
    gameState.aliens = [];
    const rows = 2 + gameState.wave;
    const cols = 8;
    const alienTypes = ['green', 'red', 'blue'];
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            // Alternar tipos de alienígenas por linha
            const alienType = alienTypes[i % alienTypes.length];
            gameState.aliens.push({ 
                x: 20 + j * 30, 
                y: 20 + i * 30, 
                width: 20, 
                height: 20,
                type: alienType
            });
        }
    }
}

function startGame() {
    closeModal('startModal');
    generateWave();
    isGameRunning = true;
    gameLoop();
    
    // Adicionar controles de teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'a') {
            movePlayer(-1);
        } else if (e.key === 'ArrowRight' || e.key === 'd') {
            movePlayer(1);
        } else if (e.key === ' ' || e.key === 'ArrowUp') {
            shoot();
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
    if (touchX < canvas.width / 3) {
        movePlayer(-1);
    } else if (touchX > (canvas.width * 2) / 3) {
        movePlayer(1);
    } else {
        shoot();
    }
}

function movePlayer(direction) {
    if (!isGameRunning) return;
    
    const newX = gameState.player.x + (direction * gameState.player.speed);
    if (newX >= 0 && newX <= canvas.width - gameState.player.width) {
        gameState.player.x = newX;
    }
}

function shoot() {
    if (!isGameRunning) return;
    
    const now = Date.now();
    if (now - gameState.lastShotTime > 500 && gameState.playerBullets.length < 3) {
        gameState.playerBullets.push({ 
            x: gameState.player.x + (gameState.player.width / 2) - 2.5, 
            y: gameState.player.y, 
            width: 5, 
            height: 10, 
            dy: -5 
        });
        gameState.lastShotTime = now;
    }
}

function gameLoop(timestamp) {
    if (!isGameRunning) return;
    update(timestamp);
    draw();
    requestAnimationFrame(gameLoop);
}

function update(timestamp) {
    // Mover alienígenas
    if (Math.random() < 0.02) {
        gameState.aliens.forEach(alien => alien.y += 10);
        if (gameState.aliens.some(alien => alien.y + alien.height > canvas.height)) {
            isGameRunning = false;
            openModal('gameOverModal');
        }
    }

    // Disparar projéteis inimigos
    if (Math.random() < 0.01) {
        gameState.aliens.forEach(alien => {
            if (Math.random() < 0.1) {
                gameState.alienBullets.push({ 
                    x: alien.x + 10, 
                    y: alien.y + 20, 
                    width: 5, 
                    height: 10, 
                    dy: 2 
                });
            }
        });
    }

    // Mover projéteis do jogador
    for (let i = gameState.playerBullets.length - 1; i >= 0; i--) {
        const bullet = gameState.playerBullets[i];
        bullet.y -= 5;
        if (bullet.y < 0) {
            gameState.playerBullets.splice(i, 1);
            continue;
        }
        for (let j = gameState.aliens.length - 1; j >= 0; j--) {
            const alien = gameState.aliens[j];
            if (bullet.x > alien.x && bullet.x < alien.x + alien.width &&
                bullet.y < alien.y + alien.height && bullet.y + 10 > alien.y) {
                gameState.aliens.splice(j, 1);
                gameState.playerBullets.splice(i, 1);
                gameState.score += 10;
                break;
            }
        }
    }

    // Mover projéteis inimigos
    for (let i = gameState.alienBullets.length - 1; i >= 0; i--) {
        const bullet = gameState.alienBullets[i];
        bullet.y += bullet.dy;
        if (bullet.y > canvas.height) {
            gameState.alienBullets.splice(i, 1);
            continue;
        }
        if (bullet.x > gameState.player.x && bullet.x < gameState.player.x + gameState.player.width &&
            bullet.y + 10 > gameState.player.y && bullet.y < gameState.player.y + gameState.player.height) {
            gameState.lives--;
            gameState.alienBullets.splice(i, 1);
            if (gameState.lives <= 0) {
                isGameRunning = false;
                openModal('gameOverModal');
            }
        }
    }

    // Verificar onda concluída
    if (gameState.aliens.length === 0) {
        gameState.wave++;
        if (gameState.wave > gameState.maxWaves) {
            isGameRunning = false;
            openModal('winModal');
        } else {
            generateWave();
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar jogador
    ctx.drawImage(images.playerShip, gameState.player.x, gameState.player.y, gameState.player.width, gameState.player.height);
    
    // Desenhar alienígenas
    gameState.aliens.forEach(alien => {
        let alienImage;
        switch(alien.type) {
            case 'green': alienImage = images.alienGreen; break;
            case 'red': alienImage = images.alienRed; break;
            case 'blue': alienImage = images.alienBlue; break;
            default: alienImage = images.alienGreen;
        }
        ctx.drawImage(alienImage, alien.x, alien.y, alien.width, alien.height);
    });
    
    // Desenhar projéteis do jogador
    gameState.playerBullets.forEach(bullet => {
        ctx.drawImage(images.bullet, bullet.x, bullet.y, bullet.width, bullet.height);
    });
    
    // Desenhar projéteis inimigos
    gameState.alienBullets.forEach(bullet => {
        ctx.drawImage(images.alienBullet, bullet.x, bullet.y, bullet.width, bullet.height);
    });
    
    // Desenhar HUD
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText(`Vidas: ${gameState.lives}`, 10, 20);
    ctx.fillText(`Onda: ${gameState.wave}/${gameState.maxWaves}`, 100, 20);
    ctx.fillText(`Pontuação: ${gameState.score}`, 10, 40);
}
