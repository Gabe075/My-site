document.addEventListener("DOMContentLoaded", () => {
    const difficultySelect = document.getElementById("difficultySelect");
    const puzzleGrid = document.getElementById("puzzleGrid");
    const referenceImage = document.getElementById("referenceImage");
    const moveCountSpan = document.getElementById("moveCount");
    const timeCountSpan = document.getElementById("timeCount");
    const imageModal = document.getElementById("imageModal");
    const imageSelector = document.getElementById("imageSelector");
    const winModal = document.getElementById("winModal");
    const finalMovesSpan = document.getElementById("finalMoves");
    const finalTimeSpan = document.getElementById("finalTime");

    let gridSize = 4;
    let moves = 0;
    let timer;
    let seconds = 0;
    let emptyTile = {};
    let puzzlePieces = [];
    let selectedImage = "images/puzzle_image1.png";

    const images = [
        "images/jungle_animals.jpg",
        "images/africa_animals.jpg",
        "images/mountain_lake.jpg",
        "images/mountain_cottage.jpg",
        "images/beautiful_landscape.jpg",
        "images/cozy_porch.jpg",
        "images/autumn_porch.jpg",
        "images/space_galaxy.jpg",
        "images/underwater_world.jpg",
        "images/fantasy_castle.jpg"
    ];

    function init() {
        gridSize = parseInt(difficultySelect.value);
        populateImageSelector();
        startNewGame();
    }

    function populateImageSelector() {
        imageSelector.innerHTML = "";
        images.forEach(img => {
            const option = document.createElement("div");
            option.classList.add("image-option");
            option.style.backgroundImage = `url(${img})`;
            option.dataset.image = img;
            option.onclick = () => selectImage(img);
            imageSelector.appendChild(option);
        });
    }

    window.showImageSelector = () => {
        imageModal.style.display = "flex";
        const currentSelection = imageSelector.querySelector(`[data-image="${selectedImage}"]`);
        if (currentSelection) {
            currentSelection.classList.add("selected");
        }
    };

    window.closeImageModal = () => {
        imageModal.style.display = "none";
    };

    window.selectImage = (img) => {
        const options = imageSelector.querySelectorAll(".image-option");
        options.forEach(opt => opt.classList.remove("selected"));
        const newSelection = imageSelector.querySelector(`[data-image="${img}"]`);
        if (newSelection) {
            newSelection.classList.add("selected");
        }
        selectedImage = img;
    };

    window.confirmImageSelection = () => {
        closeImageModal();
        startNewGame();
    };

    window.startNewGame = () => {
        gridSize = parseInt(difficultySelect.value);
        moves = 0;
        seconds = 0;
        clearInterval(timer);
        updateStats();
        timer = setInterval(() => {
            seconds++;
            updateStats();
        }, 1000);

        referenceImage.style.backgroundImage = `url(${selectedImage})`;
        createPuzzle();
    };

    function createPuzzle() {
        puzzleGrid.innerHTML = "";
        puzzlePieces = [];
        const pieceSize = 100 / gridSize;

        for (let i = 0; i < gridSize * gridSize; i++) {
            const piece = document.createElement("div");
            piece.classList.add("puzzle-piece");
            piece.style.width = `${pieceSize}%`;
            piece.style.height = `${pieceSize}%`;
            piece.style.backgroundImage = `url(${selectedImage})`;
            
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;
            
            piece.style.backgroundPosition = `${col * 100 / (gridSize - 1)}% ${row * 100 / (gridSize - 1)}%`;
            piece.style.backgroundSize = `${gridSize * 100}%`;
            
            piece.dataset.index = i;
            piece.onclick = () => movePiece(piece);
            
            puzzlePieces.push({ element: piece, originalIndex: i });
            puzzleGrid.appendChild(piece);
        }

        puzzlePieces[puzzlePieces.length - 1].element.classList.add("empty");
        emptyTile = { 
            element: puzzlePieces[puzzlePieces.length - 1].element,
            currentIndex: puzzlePieces.length - 1
        };

        shufflePuzzle();
    }

    function shufflePuzzle() {
        for (let i = 0; i < 1000; i++) {
            const neighbors = getNeighbors(emptyTile.currentIndex);
            const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
            swapPieces(emptyTile.currentIndex, randomNeighbor);
        }
        moves = 0; // Reset moves after shuffling
        updateStats();
    }

    function movePiece(piece) {
        const pieceIndex = parseInt(piece.dataset.index);
        if (isNeighbor(pieceIndex, emptyTile.currentIndex)) {
            swapPieces(pieceIndex, emptyTile.currentIndex);
            moves++;
            updateStats();
            checkWin();
        }
    }

    function swapPieces(index1, index2) {
        const piece1 = puzzlePieces.find(p => parseInt(p.element.dataset.index) === index1);
        const piece2 = puzzlePieces.find(p => parseInt(p.element.dataset.index) === index2);

        const tempIndex = piece1.element.dataset.index;
        piece1.element.dataset.index = piece2.element.dataset.index;
        piece2.element.dataset.index = tempIndex;

        const tempLeft = piece1.element.style.left;
        const tempTop = piece1.element.style.top;
        piece1.element.style.left = piece2.element.style.left;
        piece1.element.style.top = piece2.element.style.top;
        piece2.element.style.left = tempLeft;
        piece2.element.style.top = tempTop;

        if (piece1.element.classList.contains("empty")) {
            emptyTile.currentIndex = index2;
        } else if (piece2.element.classList.contains("empty")) {
            emptyTile.currentIndex = index1;
        }
    }

    function getNeighbors(index) {
        const neighbors = [];
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;

        if (row > 0) neighbors.push(index - gridSize); // Top
        if (row < gridSize - 1) neighbors.push(index + gridSize); // Bottom
        if (col > 0) neighbors.push(index - 1); // Left
        if (col < gridSize - 1) neighbors.push(index + 1); // Right

        return neighbors;
    }

    function isNeighbor(index1, index2) {
        return getNeighbors(index2).includes(index1);
    }

    function updateStats() {
        moveCountSpan.textContent = moves;
        const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
        const secs = (seconds % 60).toString().padStart(2, "0");
        timeCountSpan.textContent = `${minutes}:${secs}`;
    }

    function checkWin() {
        for (let i = 0; i < puzzlePieces.length; i++) {
            if (parseInt(puzzlePieces[i].element.dataset.index) !== puzzlePieces[i].originalIndex) {
                return;
            }
        }
        clearInterval(timer);
        finalMovesSpan.textContent = moves;
        finalTimeSpan.textContent = timeCountSpan.textContent;
        winModal.style.display = "flex";
    }

    window.closeWinModal = () => {
        winModal.style.display = "none";
        startNewGame();
    };

    difficultySelect.addEventListener("change", startNewGame);

    init();
});


