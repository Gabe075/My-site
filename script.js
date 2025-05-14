// Lista de jogos com títulos personalizados
const jogos = [
    { nome: "Jogo da Memória", pasta: "jogo-da-memoria" },
    { nome: "Quebra-Cabeça", pasta: "quebra-cabeca" }
    // Adicione novos jogos aqui, ex.: { nome: "Novo Jogo", pasta: "novo-jogo" }
];

// Função para exibir os jogos na página
function carregarJogos() {
    const gameList = document.getElementById("game-list");
    gameList.innerHTML = ""; // Limpa a lista antes de recarregar
    jogos.forEach(jogo => {
        const gameCard = document.createElement("div");
        gameCard.className = "game-card";
        gameCard.innerHTML = `<h2><a href="${jogo.pasta}/index.html">${jogo.nome}</a></h2>`;
        gameList.appendChild(gameCard);
    });
}

// Carrega os jogos ao iniciar a página
window.onload = carregarJogos;

// Controle da sidebar mobile
const sidebar = document.querySelector('.sidebar');
const hamburger = document.createElement('div');
hamburger.className = 'hamburger';
hamburger.innerHTML = '☰';
hamburger.addEventListener('click', () => sidebar.classList.toggle('open'));
document.body.insertBefore(hamburger, document.querySelector('.game-section'));

document.addEventListener('click', (event) => {
    if (!event.target.closest('.sidebar') && !event.target.closest('.hamburger') && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }
});
