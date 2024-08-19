//board

class Board{
    constructor(width=500, height=500){
        this.width = width;
        this.height = height;
    }
}
        
//players
class Player{
    constructor(number, board){
        this.width = board.width / 50;
        this.height = this.width * 5;
        this.velocityY = 0;
        if (number == 1){
            this.x = 10;
            this.y = (board.height / 2) - (this.height / 2);
        }
        else{
            this.x = board.width - (this.width * 2);
            this.y = (board.height / 2) - (this.height / 2);
        }
    }
}
                        
//ball
class Ball{
    constructor(board){
        this.width = board.width / 50;
        this.height = board.height / 50;
        this.x = (board.width / 2) - (this.height / 2);
        this.y = (board.height / 2) - (this.height / 2);
        this.velocityX = 1;
        this.velocityY = 2;
    }
}
           
let context;
let board = new Board(500, 500);
let player1 = new Player(1, board);
let player2 = new Player(2, board);
let ball = new Ball(board);



function initializeGame(){
    const socket = new WebSocket('ws://' + window.location.host + '/ws/pong-socket/');
    socket.onopen = function(event) {
        console.log("WebSocket is open now.");
    };
    
    socket.onclose = function(event) {
        console.log("WebSocket is closed now.");
    };
    
    socket.onerror = function(error) {
        console.error("WebSocket Error: ", error);
    };
    socket.onmessage = function(event){
        const data = JSON.parse(event.data);
        console.log(data);
    }

    player1.velocityY = 0;
    player2.velocityY = 0;

    let canvas = document.getElementById("board");
    context = canvas.getContext("2d");

    // draw players
    context.fillStyle = "skyblue";
    canvas.width = board.width;
    canvas.height = board.height;
    context.fillRect(player1.x, player1.y, player1.width, player1.height);
    context.fillRect(player2.x, player2.y, player2.width, player2.height);

    requestAnimationFrame(update);
    //document.addEventListener("keyup", movePlayer);
    document.addEventListener("keyup", moveDjango);
        
    function moveDjango(e){
        //socket.send(JSON.stringify({'Player1': 'test'}));
        socket.send(JSON.stringify(
        {
            'Player1': player1.y,
            'Player2': player2.y,
            'key': e.code,
            'speed1': player1.velocityY,
            'speed2': player2.velocityY,
        }))
        //player1.y = data['Player1'];
        //player2.y = data['Player2'];
        //player1.velocityY = data['speed1'];
        //player2.velocityY = data['speed2'];
    }
            
    function update() {
        requestAnimationFrame(update);
        context.clearRect(0, 0, board.width, board.height);

        // draw players
        context.fillStyle = "skyblue";
        context.fillRect(player1.x, player1.y, player1.width, player1.height);
        context.fillRect(player2.x, player2.y, player2.width, player2.height);

        //ball
        context.fillStyle = "White"
        ball.x += ball.velocityX;
        if (ballOutOfBounds(ball.y + ball.velocityY, ball, board)){
            ball.velocityY = ball.velocityY * -1;    
        }
        ball.y += ball.velocityY;
        context.fillRect(ball.x, ball.y, ball.width, ball.height);
    }

    function ballOutOfBounds(yPosition, ball, board) {
        return (yPosition < 0 || yPosition + ball.height > board.height)
    }
}

window.initializeGame = initializeGame;