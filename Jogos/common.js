// JavaScript comum para todos os jogos

// Função para adicionar botão de voltar ao menu
function addBackToMenuButton() {
    // Verificar se o botão já existe
    if (document.querySelector('.back-to-menu')) {
        return;
    }
    
    const backButton = document.createElement('a');
    backButton.href = '../../index.html';
    backButton.className = 'back-to-menu';
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Voltar ao Menu';
    
    // Adicionar ao body
    document.body.appendChild(backButton);
}

// Função para criar modal de fim de jogo padrão
function createGameModal(title, message, buttons = []) {
    // Remover modal existente se houver
    const existingModal = document.getElementById('gameEndModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'gameEndModal';
    modal.className = 'game-modal';
    
    const buttonsHtml = buttons.map(btn => 
        `<button class="game-btn ${btn.class || 'primary'}" onclick="${btn.onclick}">${btn.text}</button>`
    ).join('');
    
    modal.innerHTML = `
        <div class="game-modal-content">
            <h3>${title}</h3>
            <p>${message}</p>
            <div class="game-modal-buttons">
                ${buttonsHtml}
                <button class="game-btn secondary" onclick="closeGameModal()">
                    <i class="fas fa-times"></i> Fechar
                </button>
                <a href="../../index.html" class="game-btn primary">
                    <i class="fas fa-home"></i> Menu Principal
                </a>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    return modal;
}

// Função para mostrar modal de fim de jogo
function showGameModal(title, message, buttons = []) {
    const modal = createGameModal(title, message, buttons);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Função para fechar modal de fim de jogo
function closeGameModal() {
    const modal = document.getElementById('gameEndModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Função para mostrar modal de vitória
function showVictoryModal(score = null, time = null, additionalButtons = []) {
    let message = 'Parabéns! Você venceu o jogo!';
    
    if (score !== null) {
        message += ` Sua pontuação: ${score}`;
    }
    
    if (time !== null) {
        message += ` Tempo: ${time}`;
    }
    
    const defaultButtons = [
        {
            text: '<i class="fas fa-redo"></i> Jogar Novamente',
            onclick: 'restartGame(); closeGameModal();',
            class: 'success'
        }
    ];
    
    const buttons = [...additionalButtons, ...defaultButtons];
    showGameModal('🎉 Vitória!', message, buttons);
}

// Função para mostrar modal de derrota
function showDefeatModal(score = null, reason = null, additionalButtons = []) {
    let message = 'Que pena! Você perdeu o jogo.';
    
    if (reason) {
        message = reason;
    }
    
    if (score !== null) {
        message += ` Sua pontuação: ${score}`;
    }
    
    const defaultButtons = [
        {
            text: '<i class="fas fa-redo"></i> Tentar Novamente',
            onclick: 'restartGame(); closeGameModal();',
            class: 'primary'
        }
    ];
    
    const buttons = [...additionalButtons, ...defaultButtons];
    showGameModal('😞 Game Over', message, buttons);
}

// Função para mostrar modal de pausa
function showPauseModal() {
    const buttons = [
        {
            text: '<i class="fas fa-play"></i> Continuar',
            onclick: 'resumeGame(); closeGameModal();',
            class: 'success'
        },
        {
            text: '<i class="fas fa-redo"></i> Reiniciar',
            onclick: 'restartGame(); closeGameModal();',
            class: 'primary'
        }
    ];
    
    showGameModal('⏸️ Jogo Pausado', 'O jogo está pausado. Escolha uma opção:', buttons);
}

// Função para formatar tempo em mm:ss
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Função para formatar pontuação com separadores de milhares
function formatScore(score) {
    return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Função para salvar melhor pontuação no localStorage
function saveBestScore(gameId, score) {
    const key = `bestScore_${gameId}`;
    const currentBest = localStorage.getItem(key);
    
    if (!currentBest || score > parseInt(currentBest)) {
        localStorage.setItem(key, score.toString());
        return true; // Nova melhor pontuação
    }
    
    return false;
}

// Função para obter melhor pontuação do localStorage
function getBestScore(gameId) {
    const key = `bestScore_${gameId}`;
    const score = localStorage.getItem(key);
    return score ? parseInt(score) : 0;
}

// Função para criar display de pontuação
function createScoreDisplay(containerId, initialScore = 0, gameId = null) {
    const container = document.getElementById(containerId);
    if (!container) return null;
    
    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'game-info';
    
    let bestScoreHtml = '';
    if (gameId) {
        const bestScore = getBestScore(gameId);
        bestScoreHtml = `
            <div class="score-display">
                <span class="score-label">Melhor:</span>
                <span id="bestScore">${formatScore(bestScore)}</span>
            </div>
        `;
    }
    
    scoreDisplay.innerHTML = `
        <div class="score-display">
            <span class="score-label">Pontuação:</span>
            <span id="currentScore">${formatScore(initialScore)}</span>
        </div>
        ${bestScoreHtml}
        <div class="score-display">
            <span class="score-label">Tempo:</span>
            <span id="gameTime">00:00</span>
        </div>
    `;
    
    container.appendChild(scoreDisplay);
    
    return {
        updateScore: (score) => {
            const element = document.getElementById('currentScore');
            if (element) element.textContent = formatScore(score);
        },
        updateTime: (seconds) => {
            const element = document.getElementById('gameTime');
            if (element) element.textContent = formatTime(seconds);
        },
        updateBestScore: (score) => {
            const element = document.getElementById('bestScore');
            if (element) element.textContent = formatScore(score);
        }
    };
}

// Função para criar cronômetro
function createGameTimer(callback = null) {
    let startTime = Date.now();
    let elapsed = 0;
    let interval = null;
    let paused = false;
    
    return {
        start: () => {
            if (!interval && !paused) {
                startTime = Date.now() - elapsed;
                interval = setInterval(() => {
                    elapsed = Date.now() - startTime;
                    const seconds = Math.floor(elapsed / 1000);
                    if (callback) callback(seconds);
                }, 1000);
            }
        },
        pause: () => {
            if (interval) {
                clearInterval(interval);
                interval = null;
                paused = true;
            }
        },
        resume: () => {
            if (paused) {
                startTime = Date.now() - elapsed;
                paused = false;
                interval = setInterval(() => {
                    elapsed = Date.now() - startTime;
                    const seconds = Math.floor(elapsed / 1000);
                    if (callback) callback(seconds);
                }, 1000);
            }
        },
        stop: () => {
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
            return Math.floor(elapsed / 1000);
        },
        reset: () => {
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
            elapsed = 0;
            paused = false;
            startTime = Date.now();
        },
        getElapsed: () => Math.floor(elapsed / 1000)
    };
}

// Função para detectar dispositivo móvel
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Função para adicionar controles touch em dispositivos móveis
function addTouchControls(gameArea, callbacks = {}) {
    if (!isMobile()) return;
    
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    
    gameArea.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        
        if (callbacks.onTouchStart) {
            callbacks.onTouchStart(touch.clientX, touch.clientY);
        }
    });
    
    gameArea.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        
        if (callbacks.onTouchMove) {
            callbacks.onTouchMove(touch.clientX, touch.clientY);
        }
    });
    
    gameArea.addEventListener('touchend', (e) => {
        e.preventDefault();
        const touch = e.changedTouches[0];
        endX = touch.clientX;
        endY = touch.clientY;
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Movimento horizontal
            if (Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0 && callbacks.onSwipeRight) {
                    callbacks.onSwipeRight();
                } else if (deltaX < 0 && callbacks.onSwipeLeft) {
                    callbacks.onSwipeLeft();
                }
            }
        } else {
            // Movimento vertical
            if (Math.abs(deltaY) > minSwipeDistance) {
                if (deltaY > 0 && callbacks.onSwipeDown) {
                    callbacks.onSwipeDown();
                } else if (deltaY < 0 && callbacks.onSwipeUp) {
                    callbacks.onSwipeUp();
                }
            }
        }
        
        if (callbacks.onTouchEnd) {
            callbacks.onTouchEnd(touch.clientX, touch.clientY);
        }
    });
}

// Função para adicionar controles de teclado
function addKeyboardControls(callbacks = {}) {
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                e.preventDefault();
                if (callbacks.onUp) callbacks.onUp();
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                e.preventDefault();
                if (callbacks.onDown) callbacks.onDown();
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                e.preventDefault();
                if (callbacks.onLeft) callbacks.onLeft();
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                e.preventDefault();
                if (callbacks.onRight) callbacks.onRight();
                break;
            case ' ':
                e.preventDefault();
                if (callbacks.onSpace) callbacks.onSpace();
                break;
            case 'Enter':
                e.preventDefault();
                if (callbacks.onEnter) callbacks.onEnter();
                break;
            case 'Escape':
                e.preventDefault();
                if (callbacks.onEscape) callbacks.onEscape();
                break;
            case 'p':
            case 'P':
                e.preventDefault();
                if (callbacks.onPause) callbacks.onPause();
                break;
            case 'r':
            case 'R':
                e.preventDefault();
                if (callbacks.onRestart) callbacks.onRestart();
                break;
        }
    });
}

// Função para criar botões de controle na tela (para mobile)
function createOnScreenControls(containerId, controls = []) {
    const container = document.getElementById(containerId);
    if (!container || !isMobile()) return;
    
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'on-screen-controls';
    controlsDiv.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 1rem;
        flex-wrap: wrap;
    `;
    
    controls.forEach(control => {
        const button = document.createElement('button');
        button.className = 'game-btn';
        button.innerHTML = control.icon + ' ' + control.label;
        button.onclick = control.callback;
        button.style.cssText = `
            min-width: 60px;
            min-height: 60px;
            font-size: 1.2rem;
        `;
        controlsDiv.appendChild(button);
    });
    
    container.appendChild(controlsDiv);
}

// Inicialização automática quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar botão de voltar ao menu automaticamente
    addBackToMenuButton();
    
    // Adicionar Font Awesome se não estiver presente
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fontAwesome = document.createElement('link');
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
        document.head.appendChild(fontAwesome);
    }
    
    // Adicionar CSS comum se não estiver presente
    if (!document.querySelector('link[href*="common.css"]')) {
        const commonCSS = document.createElement('link');
        commonCSS.rel = 'stylesheet';
        commonCSS.href = '../common.css';
        document.head.appendChild(commonCSS);
    }
    
    // Prevenir zoom em dispositivos móveis
    if (isMobile()) {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        }
    }
});

// Função para fechar modal ao clicar fora
document.addEventListener('click', (e) => {
    const modal = document.getElementById('gameEndModal');
    if (modal && e.target === modal) {
        closeGameModal();
    }
});

// Função para fechar modal com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeGameModal();
    }
});

