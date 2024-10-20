// board
class BoardL {
    constructor(width = 900, height = 500) {
        this.width = width;
        this.height = height;
    }
}

// players
class PlayerL {
    constructor(number, board) {
        this.width = board.width / 50;
        this.height = this.width * 5;
        this.velocityY = 0;
        this.score = 0;
        if (number === 1) {
            this.x = 10;
            this.y = (board.height / 2) - (this.height / 2);
        } else {
            this.x = board.width - (this.width * 2);
            this.y = (board.height / 2) - (this.height / 2);
        }
    }

    move() {
        this.y += this.velocityY;
    }

    // Prevent player from going out of bounds
    constrain(board) {
        if (this.y < 0) {
            this.y = 0;
        } else if (this.y + this.height > board.height) {
            this.y = board.height - this.height;
        }
    }
}

// ball
class BallL {
    constructor(board) {
        this.width = board.width / 50;
        this.height = this.width;
        this.x = (board.width / 2) - (this.height / 2);
        this.y = (board.height / 2) - (this.height / 2);
        this.velocityX = 5;
        this.velocityY = 3;
    }

    move() {
        this.x += this.velocityX;
        this.y += this.velocityY;
    }

    // Ball bounce logic
    bounce(board, player1, player2) {
        // Bounce off top and bottom
        if (this.y <= 0 || this.y + this.height >= board.height) {
            this.velocityY = -this.velocityY;
        }

        // Check if the ball hits player 1
        if (this.x <= player1.x + player1.width && this.y + this.height >= player1.y && this.y <= player1.y + player1.height) {
            this.velocityX = -this.velocityX;
        }

        // Check if the ball hits player 2
        if (this.x + this.width >= player2.x && this.y + this.height >= player2.y && this.y <= player2.y + player2.height) {
            this.velocityX = -this.velocityX;
        }

        // Reset ball position if it goes off screen (left or right)
        if (this.x <= 0 || this.x >= board.width) {
            this.x = (board.width / 2) - (this.width / 2);
            this.y = (board.height / 2) - (this.height / 2);
            this.velocityX = -this.velocityX; // Reverse direction on reset
        }

        // Check if scored
        if (this.x >= board.width)
    }
    // Check for scoring
    score(player1, player2, board) {
        if (this.x <= 0) {
            // Gol del jugador 2
            player2.score += 1;
            this.resetPosition(board);
        } else if (this.x >= board.width) {
            // Gol del jugador 1
            player1.score += 1;
            this.resetPosition(board);
        }
    }

    // Reset ball position to center
    resetPosition(board) {
        this.x = (board.width / 2) - (this.width / 2);
        this.y = (board.height / 2) - (this.height / 2);
        this.velocityX = -this.velocityX; // Cambiar la dirección tras un gol
    }
}

let context;
let board = new BoardL(900, 500);
let player1 = new PlayerL(1, board);
let player2 = new PlayerL(2, board);
let ball = new BallL(board);

function initializeLocalGame() {
    loadGameCanvas();
    console.log('initializeGame called');
    let canvas = document.getElementById("board");
    context = canvas.getContext("2d");
    canvas.width = board.width;
    canvas.height = board.height;

    // Control players using keyboard
    document.addEventListener("keydown", movePlayer);
    document.addEventListener("keyup", stopPlayer);

    // Start the game loop
    gameLoop();
}

// Move players based on keyboard input
function movePlayer(e) {
    switch (e.code) {
        // Player 1 controls (W and S)
        case "KeyW":
            player1.velocityY = -5;
            break;
        case "KeyS":
            player1.velocityY = 5;
            break;

        // Player 2 controls (Arrow Up and Arrow Down)
        case "ArrowUp":
            player2.velocityY = -5;
            break;
        case "ArrowDown":
            player2.velocityY = 5;
            break;
    }
}

// Stop players when keys are released
function stopPlayer(e) {
    switch (e.code) {
        case "KeyW":
        case "KeyS":
            player1.velocityY = 0;
            break;

        case "ArrowUp":
        case "ArrowDown":
            player2.velocityY = 0;
            break;
    }
}

// Game loop to update positions and render the game
function gameLoop() {
    context.clearRect(0, 0, board.width, board.height);
    context.fillStyle = "Black";
    context.fillRect(0, 0, board.width, board.height);

    // Move and constrain players
    player1.move();
    player1.constrain(board);
    player2.move();
    player2.constrain(board);

    // Move and bounce the ball
    ball.move();
    ball.bounce(board, player1, player2);

    // Draw players
    context.fillStyle = "skyblue";
    context.fillRect(player1.x, player1.y, player1.width, player1.height);
    context.fillRect(player2.x, player2.y, player2.width, player2.height);

    // Draw ball
    context.fillStyle = "White";
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    // Display scores
    context.font = "30px Arial";
    context.fillStyle = "white";
    context.fillText("Player 1: " + player1.score, 50, 50);
    context.fillText("Player 2: " + player2.score, board.width - 200, 50);

    // Continuously call gameLoop
    requestAnimationFrame(gameLoop);
}

window.initializeLocalGame = initializeLocalGame;
