// Lista de pastas de jogos (atualize manualmente ao adicionar novos jogos)
const jogos = [
    { nome: "Jogo da Memória", pasta: "jogo-da-memoria" },
    { nome: "Quebra-Cabeça", pasta: "quebra-cabeca" }
    // Adicione novos jogos aqui, ex.: { nome: "Novo Jogo", pasta: "novo-jogo" }
];

// Função para exibir os jogos na página
function carregarJogos() {
    const gameList = document.getElementById("game-list");
    jogos.forEach(jogo => {
        const gameCard = document.createElement("div");
        gameCard.className = "game-card";
        gameCard.innerHTML = `<h2><a href="${jogo.pasta}/index.html">${jogo.nome}</a></h2>`;
        gameList.appendChild(gameCard);
    });
}

// Carrega os jogos ao iniciar a página
window.onload = carregarJogos;