const jogos = [
    { nome: "Jogo da Memória", pasta: "jogo-da-memoria" },
    { nome: "Quebra Cabeça", pasta: "quebra-cabeca" },
    { nome: "Damas", pasta: "damas" },
    { nome: "Forca", pasta: "forca" },
    { nome: "Jogo da Velha", pasta: "jogo-da-velha" },
    { nome: "Palavras Cruzadas", pasta: "palavras-cruzadas" },
    { nome: "Caça Palavras", pasta: "caca-palavras" },
    { nome: "Campo Minado", pasta: "campo-minado" },
    { nome: "Batalha Naval", pasta: "batalha-naval" },
    { nome: "Jogo da Cobra", pasta: "snake" },
    { nome: "Pong", pasta: "pong" },
    // Adicione novos jogos aqui
];

function carregarJogos() {
    const gameList = document.getElementById("game-list");
    gameList.innerHTML = "";
    jogos.forEach(jogo => {
        const gameCard = document.createElement("div");
        gameCard.className = "game-card";
        gameCard.innerHTML = `<h2><a href="Jogos/${jogo.pasta}/index.html">${jogo.nome}</a></h2>`;
        gameList.appendChild(gameCard);
    });
}

window.onload = carregarJogos;

// Controle da sidebar mobile
const sidebar = document.querySelector('.sidebar');
const hamburger = document.querySelector('.hamburger');
hamburger.addEventListener('click', () => sidebar.classList.toggle('open'));
document.addEventListener('click', (event) => {
    if (!event.target.closest('.sidebar') && !event.target.closest('.hamburger') && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }
});
