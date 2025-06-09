// Dados do quiz (exemplos expandidos com mais países, conflitos, organizações e ONGs)
const quizData = [
    // Países
    {
        type: "country",
        question: "Qual país é representado por esta bandeira?",
        flag: "https://flagcdn.com/w320/br.png",
        options: ["Brasil", "Argentina", "Chile", "Colômbia"],
        answer: "Brasil"
    },
    {
        type: "country",
        question: "Qual país é representado por esta bandeira?",
        flag: "https://flagcdn.com/w320/ua.png",
        options: ["Ucrânia", "Rússia", "Polônia", "Bielorrússia"],
        answer: "Ucrânia"
    },
    {
        type: "country",
        question: "Qual país é representado por esta bandeira?",
        flag: "https://flagcdn.com/w320/jp.png",
        options: ["Japão", "China", "Coreia do Sul", "Tailândia"],
        answer: "Japão"
    },
    {
        type: "country",
        question: "Qual país é representado por esta bandeira?",
        flag: "https://flagcdn.com/w320/za.png",
        options: ["África do Sul", "Nigéria", "Quênia", "Gana"],
        answer: "África do Sul"
    },
    {
        type: "country",
        question: "Qual país é representado por esta bandeira?",
        flag: "https://flagcdn.com/w320/fr.png",
        options: ["França", "Itália", "Espanha", "Bélgica"],
        answer: "França"
    },
    {
        type: "country",
        question: "Qual país é representado por esta bandeira?",
        flag: "https://flagcdn.com/w320/in.png",
        options: ["Índia", "Paquistão", "Bangladesh", "Sri Lanka"],
        answer: "Índia"
    },
    {
        type: "country",
        question: "Qual país é representado por esta bandeira?",
        flag: "https://flagcdn.com/w320/ca.png",
        options: ["Canadá", "Estados Unidos", "México", "Groenlândia"],
        answer: "Canadá"
    },
    // Conflitos/Gerras
    {
        type: "conflict",
        question: "Quais países estão em conflito representado por estas bandeiras?",
        flag1: "https://flagcdn.com/w320/ua.png",
        flag2: "https://flagcdn.com/w320/ru.png",
        options: ["Ucrânia e Rússia", "Israel e Palestina", "Índia e Paquistão", "Coreia do Norte e Coreia do Sul"],
        answer: "Ucrânia e Rússia"
    },
    {
        type: "conflict",
        question: "Quais regiões estão em disputa representadas por estas bandeiras?",
        flag1: "https://flagcdn.com/w320/il.png",
        flag2: "https://flagcdn.com/w320/ps.png",
        options: ["Israel e Palestina", "Ucrânia e Rússia", "China e Taiwan", "Síria e Turquia"],
        answer: "Israel e Palestina"
    },
    // Organizações
    {
        type: "organization",
        question: "Qual organização internacional usa esta bandeira como símbolo?",
        flag: "https://flagcdn.com/w320/un.png",
        options: ["ONU", "OTAN", "União Europeia", "ASEAN"],
        answer: "ONU"
    },
    {
        type: "organization",
        question: "Qual aliança militar é representada por esta bandeira?",
        flag: "https://flagcdn.com/w320/nato.png",
        options: ["OTAN", "ONU", "OPEP", "Mercosul"],
        answer: "OTAN"
    },
    // ONGs
    {
        type: "ngo",
        question: "Qual ONG é representada por este símbolo?",
        flag: "https://flagcdn.com/w320/who.png",
        options: ["Médicos Sem Fronteiras", "Greenpeace", "OMS", "Anistia Internacional"],
        answer: "OMS"
    }
];

// Elementos do DOM
const flag1 = document.getElementById("flag1");
const flag2 = document.getElementById("flag2");
const question = document.getElementById("question");
const options = document.getElementById("options");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const resultModal = document.getElementById("result-modal");
const resultTitle = document.getElementById("result-title");
const resultMessage = document.getElementById("result-message");
const nextQuestionBtn = document.getElementById("next-question");
const endModal = document.getElementById("end-modal");
const finalScore = document.getElementById("final-score");
const restartGameBtn = document.getElementById("restart-game");

let score = 0;
let timeLeft = 10;
let timer;
let gameActive = true;
let usedQuestions = new Set(); // Rastrear perguntas já usadas

// Carregar progresso salvo
function loadProgress() {
    const savedData = JSON.parse(localStorage.getItem("geographyGame2025"));
    if (savedData) {
        score = savedData.score || 0;
        scoreDisplay.textContent = `Pontuação: ${score}`;
        if (savedData.usedQuestions) {
            usedQuestions = new Set(savedData.usedQuestions);
        }
    }
}

// Salvar progresso
function saveProgress() {
    const data = {
        score: score,
        usedQuestions: Array.from(usedQuestions)
    };
    localStorage.setItem("geographyGame2025", JSON.stringify(data));
}

// Embaralhar opções
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Escolher pergunta aleatoriamente
function getRandomQuestion() {
    if (usedQuestions.size >= quizData.length) {
        usedQuestions.clear(); // Resetar se todas as perguntas foram usadas
    }
    let index;
    do {
        index = Math.floor(Math.random() * quizData.length);
    } while (usedQuestions.has(index));
    usedQuestions.add(index);
    return quizData[index];
}

// Iniciar temporizador
function startTimer() {
    timeLeft = 10;
    timerDisplay.textContent = `Tempo: ${timeLeft}s`;
    timer = setInterval(() => {
        if (!gameActive) return;
        timeLeft--;
        timerDisplay.textContent = `Tempo: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            gameActive = false;
            showResult(false, "Tempo esgotado!");
        }
    }, 1000);
}

// Mostrar pergunta
function loadQuestion() {
    gameActive = true;
    const q = getRandomQuestion();
    question.textContent = q.question;
    flag1.src = q.flag || q.flag1 || "";
    flag1.style.display = q.flag || q.flag1 ? "block" : "none";
    flag2.src = q.flag2 || "";
    flag2.style.display = q.flag2 ? "block" : "none";

    options.innerHTML = "";
    const shuffledOptions = shuffle([...q.options]);
    shuffledOptions.forEach(option => {
        const button = document.createElement("button");
        button.className = "option";
        button.textContent = option;
        button.onclick = () => checkAnswer(option, q.answer);
        options.appendChild(button);
    });

    startTimer();
}

// Verificar resposta
function checkAnswer(selected, correct) {
    if (!gameActive) return;
    gameActive = false;
    clearInterval(timer);

    const isCorrect = selected === correct;
    if (isCorrect) {
        score += 10;
        scoreDisplay.textContent = `Pontuação: ${score}`;
        showResult(true, "Correto! +10 pontos");
    } else {
        timeLeft -= 4; // Penalidade de 4 segundos
        if (timeLeft < 0) timeLeft = 0;
        showResult(false, `Errado! Resposta: ${correct}. -4 segundos`);
    }
    saveProgress();
}

// Mostrar modal de resultado
function showResult(isCorrect, message) {
    resultTitle.textContent = isCorrect ? "Acertou!" : "Errou!";
    resultTitle.style.color = isCorrect ? "#00ff00" : "#ff0000";
    resultMessage.textContent = message;
    resultModal.style.display = "flex";
}

// Próxima pergunta
nextQuestionBtn.onclick = () => {
    resultModal.style.display = "none";
    loadQuestion();
};

// Fim do jogo
function endGame() {
    clearInterval(timer);
    finalScore.textContent = `Pontuação Acumulada: ${score}`;
    endModal.style.display = "flex";
}

// Reiniciar jogo
restartGameBtn.onclick = () => {
    endModal.style.display = "none";
    usedQuestions.clear(); // Limpar perguntas usadas, mas manter pontuação
    saveProgress();
    loadQuestion();
};

// Iniciar o jogo
loadProgress();
loadQuestion();
