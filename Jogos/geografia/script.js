// Dados do quiz com bandeiras de países atuais, ONGs, organizações e impérios antigos
const quizData = [
    // Identificação de Bandeiras (Múltipla Escolha) - Países Atuais
    {
        type: "multiple",
        question: "Qual país atual é representado por esta bandeira?",
        flag: "https://flagcdn.com/w320/br.png",
        options: ["Brasil", "Argentina", "Chile", "Colômbia"],
        answer: "Brasil"
    },
    {
        type: "multiple",
        question: "Qual país atual é representado por esta bandeira?",
        flag: "https://flagcdn.com/w320/ua.png",
        options: ["Ucrânia", "Rússia", "Polônia", "Bielorrússia"],
        answer: "Ucrânia"
    },
    {
        type: "multiple",
        question: "Qual país atual é representado por esta bandeira?",
        flag: "https://flagcdn.com/w320/jp.png",
        options: ["Japão", "China", "Coreia do Sul", "Tailândia"],
        answer: "Japão"
    },
    {
        type: "multiple",
        question: "Quais países estão em conflito representado por estas bandeiras em 2025?",
        flag1: "https://flagcdn.com/w320/il.png",
        flag2: "https://flagcdn.com/w320/ps.png",
        options: ["Israel e Palestina", "Ucrânia e Rússia", "China e Taiwan", "Síria e Turquia"],
        answer: "Israel e Palestina"
    },
    // Identificação de Bandeiras (Múltipla Escolha) - ONGs e Organizações
    {
        type: "multiple",
        question: "Qual organização internacional usa esta bandeira como símbolo?",
        flag: "https://flagcdn.com/w320/un.png",
        options: ["ONU", "OTAN", "União Europeia", "ASEAN"],
        answer: "ONU"
    },
    {
        type: "multiple",
        question: "Qual aliança militar é representada por esta bandeira?",
        flag: "https://flagcdn.com/w320/nato.png",
        options: ["OTAN", "ONU", "OPEP", "Mercosul"],
        answer: "OTAN"
    },
    {
        type: "multiple",
        question: "Qual ONG é representada por este símbolo?",
        flag: "https://flag规范.com/w320/who.png",
        options: ["Médicos Sem Fronteiras", "Greenpeace", "OMS", "Anistia Internacional"],
        answer: "OMS"
    },
    // Identificação de Bandeiras (Múltipla Escolha) - Impérios e Países Antigos
    {
        type: "multiple",
        question: "Qual império histórico usava esta bandeira?",
        flag: "https://flagcdn.com/w320/roman-empire.png", // Bandeira representativa do Império Romano
        options: ["Império Romano", "Império Otomano", "Império Persa", "Império Mongol"],
        answer: "Império Romano"
    },
    {
        type: "multiple",
        question: "Qual império histórico é representado por esta bandeira?",
        flag: "https://flagcdn.com/w320/ottoman-empire.png", // Bandeira representativa do Império Otomano
        options: ["Império Otomano", "Império Romano", "Império Bizantino", "Império Austro-Húngaro"],
        answer: "Império Otomano"
    },
    // Arraste e Solte - Países Atuais e Impérios
    {
        type: "drag",
        question: "Arraste o nome do país atual para a zona indicada com base na bandeira.",
        flag: "https://flagcdn.com/w320/za.png",
        options: ["África do Sul", "Nigéria", "Gana", "Zimbábue"],
        answer: "África do Sul"
    },
    {
        type: "drag",
        question: "Arraste o nome do império histórico para a zona indicada com base na bandeira.",
        flag: "https://flagcdn.com/w320/byzantine-empire.png", // Bandeira representativa do Império Bizantino
        options: ["Império Bizantino", "Império Romano", "Império Persa", "Império Mongol"],
        answer: "Império Bizantino"
    },
    // Pergunta Aberta - Países e Organizações
    {
        type: "open",
        question: "Digite o nome do país atual representado por esta bandeira.",
        flag: "https://flagcdn.com/w320/ca.png",
        options: [],
        answer: "Canadá"
    },
    {
        type: "open",
        question: "Digite o nome da ONG representada por este símbolo.",
        flag: "https://upload.wikimedia.org/wikipedia/commons/2/22/M%C3%A9decins_Sans_Fronti%C3%A8res_Logo.svg", // Logo MSF
        options: [],
        answer: "Médicos Sem Fronteiras"
    },
    // Ordenação - Conflitos e Impérios
    {
        type: "sort",
        question: "Ordene estas entidades por data de fundação/apogeu (do mais antigo ao mais recente).",
        items: [
            { text: "Império Persa", value: -550 },
            { text: "Império Romano", value: -27 },
            { text: "Império Bizantino", value: 330 },
            { text: "Império Otomano", value: 1299 }
        ],
        answer: ["Império Persa", "Império Romano", "Império Bizantino", "Império Otomano"]
    },
    {
        type: "sort",
        question: "Ordene estes conflitos por data de início (do mais antigo ao mais recente).",
        items: [
            { text: "Conflito Israel-Palestina", value: 1948 },
            { text: "Guerra Fria", value: 1947 },
            { text: "Conflito Ucrânia-Rússia", value: 2014 },
            { text: "Guerra Síria", value: 2011 }
        ],
        answer: ["Guerra Fria", "Conflito Israel-Palestina", "Guerra Síria", "Conflito Ucrânia-Rússia"]
    }
];

// Elementos do DOM
const flag1 = document.getElementById("flag1");
const flag2 = document.getElementById("flag2");
const question = document.getElementById("question");
const options = document.getElementById("options");
const dragDrop = document.getElementById("drag-drop");
const dropZone = document.getElementById("drop-zone");
const draggableOptions = document.getElementById("draggable-options");
const openQuestion = document.getElementById("open-question");
const answerInput = document.getElementById("answer-input");
const submitAnswer = document.getElementById("submit-answer");
const sortGame = document.getElementById("sort-game");
const sortItems = document.getElementById("sort-items");
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
let usedQuestions = new Set();
let currentQuestion;

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

// Embaralhar array
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
        usedQuestions.clear();
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
    currentQuestion = getRandomQuestion();
    question.textContent = currentQuestion.question;
    flag1.src = currentQuestion.flag || currentQuestion.flag1 || "";
    flag1.style.display = currentQuestion.flag || currentQuestion.flag1 ? "block" : "none";
    flag2.src = currentQuestion.flag2 || "";
    flag2.style.display = currentQuestion.flag2 ? "block" : "none";

    // Esconder todas as áreas de jogo
    options.style.display = "none";
    dragDrop.style.display = "none";
    openQuestion.style.display = "none";
    sortGame.style.display = "none";

    if (currentQuestion.type === "multiple") {
        options.style.display = "flex";
        options.innerHTML = "";
        const shuffledOptions = shuffle([...currentQuestion.options]);
        shuffledOptions.forEach(option => {
            const button = document.createElement("button");
            button.className = "option";
            button.textContent = option;
            button.onclick = () => checkAnswer(option, currentQuestion.answer);
            options.appendChild(button);
        });
    } else if (currentQuestion.type === "drag") {
        dragDrop.style.display = "block";
        draggableOptions.innerHTML = "";
        const shuffledOptions = shuffle([...currentQuestion.options]);
        shuffledOptions.forEach(option => {
            const div = document.createElement("div");
            div.className = "draggable";
            div.textContent = option;
            div.draggable = true;
            div.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text", option);
            });
            draggableOptions.appendChild(div);
        });
        dropZone.innerHTML = "Arraste o nome para cá";
        dropZone.addEventListener("dragover", (e) => e.preventDefault());
        dropZone.addEventListener("drop", (e) => {
            e.preventDefault();
            const dropped = e.dataTransfer.getData("text");
            checkAnswer(dropped, currentQuestion.answer);
        });
    } else if (currentQuestion.type === "open") {
        openQuestion.style.display = "block";
        answerInput.value = "";
        submitAnswer.onclick = () => {
            const userAnswer = answerInput.value.trim();
            checkAnswer(userAnswer, currentQuestion.answer);
        };
    } else if (currentQuestion.type === "sort") {
        sortGame.style.display = "block";
        sortItems.innerHTML = "";
        const shuffledItems = shuffle([...currentQuestion.items]);
        shuffledItems.forEach(item => {
            const div = document.createElement("div");
            div.className = "sort-item";
            div.textContent = item.text;
            div.draggable = true;
            div.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text", item.text);
            });
            sortItems.appendChild(div);
        });
        sortItems.addEventListener("dragover", (e) => e.preventDefault());
        sortItems.addEventListener("drop", (e) => {
            e.preventDefault();
            const dropped = e.dataTransfer.getData("text");
            const droppedElement = Array.from(sortItems.children).find(el => el.textContent === dropped);
            if (droppedElement) {
                sortItems.insertBefore(droppedElement, e.target.closest(".sort-item"));
            }
            const currentOrder = Array.from(sortItems.children).map(el => el.textContent);
            checkAnswer(currentOrder, currentQuestion.answer);
        });
    }
    startTimer();
}

// Verificar resposta
function checkAnswer(selected, correct) {
    if (!gameActive) return;
    gameActive = false;
    clearInterval(timer);

    let isCorrect;
    if (Array.isArray(selected) && Array.isArray(correct)) {
        isCorrect = selected.length === correct.length && selected.every((val, i) => val === correct[i]);
    } else {
        isCorrect = selected.toLowerCase() === correct.toLowerCase();
    }

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
