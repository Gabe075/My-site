const jogos = [
    { nome: "Jogo da Memória", pasta: "jogo-da-memoria" },
    { nome: "Quebra-Cabeça", pasta: "quebra-cabeca" }
    // Adicione novos jogos aqui
];

function carregarJogos() {
    const gameList = document.getElementById("game-list");
    gameList.innerHTML = "";
    jogos.forEach(jogo => {
        const gameCard = document.createElement("div");
        gameCard.className = "game-card";
        gameCard.innerHTML = `<h2><a href="${jogo.pasta}/index.html">${jogo.nome}</a></h2>`;
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
