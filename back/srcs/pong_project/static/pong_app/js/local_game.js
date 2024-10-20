// boardL
class BoardL {
    constructor(width = 900, height = 500) {
        this.width = width;
        this.height = height;
    }
}

// players
class PlayerL {
    constructor(number, boardL) {
        this.width = boardL.width / 50;
        this.height = this.width * 5;
        this.velocityY = 0;
        this.score = 0;
        if (number === 1) {
            this.x = 10;
            this.y = (boardL.height / 2) - (this.height / 2);
        } else {
            this.x = boardL.width - (this.width * 2);
            this.y = (boardL.height / 2) - (this.height / 2);
        }
    }

    move() {
        this.y += this.velocityY;
    }

    // Prevent player from going out of bounds
    constrain(boardL) {
        if (this.y < 0) {
            this.y = 0;
        } else if (this.y + this.height > boardL.height) {
            this.y = boardL.height - this.height;
        }
    }
}

// ballL
class BallL {
    constructor(boardL) {
        this.width = boardL.width / 50;
        this.height = this.width;
        this.x = (boardL.width / 2) - (this.height / 2);
        this.y = (boardL.height / 2) - (this.height / 2);
        this.velocityX = 5;
        this.velocityY = 3;
    }

    move() {
        this.x += this.velocityX;
        this.y += this.velocityY;
    }

    // Ball bounce logic
    bounce(boardL, player1L, player2L) {
        // Bounce off top and bottom
        if (this.y <= 0 || this.y + this.height >= boardL.height) {
            this.velocityY = -this.velocityY;
        }

        // Check if the ballL hits player 1
        if (this.x <= player1L.x + player1L.width && this.y + this.height >= player1L.y && this.y <= player1L.y + player1L.height) {
            this.velocityX = -this.velocityX;
        }

        // Check if the ballL hits player 2
        if (this.x + this.width >= player2L.x && this.y + this.height >= player2L.y && this.y <= player2L.y + player2L.height) {
            this.velocityX = -this.velocityX;
        }

        // Reset ballL position if it goes off screen (left or right)
        if (this.x <= 0 || this.x >= boardL.width) {
            this.x = (boardL.width / 2) - (this.width / 2);
            this.y = (boardL.height / 2) - (this.height / 2);
            this.velocityX = -this.velocityX; // Reverse direction on reset
        }

        // Check if scored
        this.score(player1L, player2L, boardL);
    }
    // Check for scoring
    score(player1L, player2L, boardL) {
        if (this.x <= 0) {
            // Gol del jugador 2
            player2L.score += 1;
            this.resetPosition(boardL);
        } else if (this.x >= boardL.width) {
            // Gol del jugador 1
            player1L.score += 1;
            this.resetPosition(boardL);
        }
    }

    // Reset ballL position to center
    resetPosition(boardL) {
        this.x = (boardL.width / 2) - (this.width / 2);
        this.y = (boardL.height / 2) - (this.height / 2);
        this.velocityX = -this.velocityX; // Cambiar la dirección tras un gol
    }
}

let contextL;
let boardL = new BoardL(900, 500);
let player1L = new PlayerL(1, boardL);
let player2L = new PlayerL(2, boardL);
let ballL = new BallL(boardL);

function initializeLocalGame() {
    loadGameCanvas();
    console.log('initializeGame called');
    let canvas = document.getElementById("boardL");
    contextL = canvas.getContext("2d");
    canvas.width = boardL.width;
    canvas.height = boardL.height;

    // Control players using keyboardL
    document.addEventListener("keydown", movePlayer);
    document.addEventListener("keyup", stopPlayer);

    // Start the game loop
    gameLoop();
}

// Move players based on keyboardL input
function movePlayer(e) {
    switch (e.code) {
        // Player 1 controls (W and S)
        case "KeyW":
            player1L.velocityY = -5;
            break;
        case "KeyS":
            player1L.velocityY = 5;
            break;

        // Player 2 controls (Arrow Up and Arrow Down)
        case "ArrowUp":
            player2L.velocityY = -5;
            break;
        case "ArrowDown":
            player2L.velocityY = 5;
            break;
    }
}

// Stop players when keys are released
function stopPlayer(e) {
    switch (e.code) {
        case "KeyW":
        case "KeyS":
            player1L.velocityY = 0;
            break;

        case "ArrowUp":
        case "ArrowDown":
            player2L.velocityY = 0;
            break;
    }
}

// Game loop to update positions and render the game
function gameLoop() {
    contextL.clearRect(0, 0, boardL.width, boardL.height);
    contextL.fillStyle = "Black";
    contextL.fillRect(0, 0, boardL.width, boardL.height);

    // Move and constrain players
    player1L.move();
    player1L.constrain(boardL);
    player2L.move();
    player2L.constrain(boardL);

    // Move and bounce the ballL
    ballL.move();
    ballL.bounce(boardL, player1L, player2L);

    // Draw players
    contextL.fillStyle = "skyblue";
    contextL.fillRect(player1L.x, player1L.y, player1L.width, player1L.height);
    contextL.fillRect(player2L.x, player2L.y, player2L.width, player2L.height);

    // Draw ballL
    contextL.fillStyle = "White";
    contextL.fillRect(ballL.x, ballL.y, ballL.width, ballL.height);

    // Display scores
    contextL.font = "30px Arial";
    contextL.fillStyle = "white";
    contextL.fillText("Player 1: " + player1L.score, 50, 50);
    contextL.fillText("Player 2: " + player2L.score, boardL.width - 200, 50);

    console.log(`P1: ${player1L.score}`);

    // Continuously call gameLoop
    requestAnimationFrame(gameLoop);
}

window.initializeLocalGame = initializeLocalGame;
