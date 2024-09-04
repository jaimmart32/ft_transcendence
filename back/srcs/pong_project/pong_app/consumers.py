import json
from channels.generic.websocket import WebsocketConsumer
#from channels.generic.websocket import AsyncWebsocketConsumer
import logging
import time
import threading
from .models import Paddle, Board, Ball

logger = logging.getLogger(__name__)

def outOfBounds(yPosition, player, board):
    return yPosition < 0 or yPosition + player > board

def ballOutOfBounds(yPosition, ball, board):
    return yPosition < 0 or yPosition + ball > board

def ballSaved(ball, player1, player2):
    if (ball.x is player1.x + player1.width) and (ball.y >= player1.y and ball.y <= player1.y + player1.height):
        return True
    elif (ball.x is player2.x - ball.width) and (ball.y >= player2.y and ball.y <= player2.y + player2.height):
        return True
    return False

class PongConsumer(WebsocketConsumer):
    def connect(self):
        logger.info(self.scope)  # Print the scope to debug the connection
        self.accept()
        self.running = True
        self.board = Board()
        self.ball = Ball(board=self.board)
        self.player1 = Paddle(number=1, board=self.board)
        self.player2 = Paddle(number=2, board=self.board)
        self.lock = threading.Lock()  # Initialize the lock
        self.game_thread = threading.Thread(target=self.game_loop)
        self.game_thread.start()

    def move_players(self):
        with self.lock:  # Acquire the lock before modifying shared resources
            if not outOfBounds(self.player1.y + self.player1.velocityY, self.player1.height, self.board.height):
                self.player1.y += self.player1.velocityY
            if not outOfBounds(self.player2.y + self.player2.velocityY, self.player1.height, self.board.height):
                self.player2.y += self.player2.velocityY

    def move_ball(self):
        with self.lock:  # Acquire the lock before modifying shared resources
            if ballOutOfBounds(self.ball.y, self.ball.height, self.board.height):
                self.ball.velocityY = -self.ball.velocityY
            if ballSaved(self.ball, self.player1, self.player2):
                self.ball.velocityX = -self.ball.velocityX
            # check if the ball was saved or if it was scored
            self.ball.x += self.ball.velocityX
            self.ball.y += self.ball.velocityY
    
    def game_loop(self):
        self.running = True
        while self.running:
            self.move_ball()
            self.move_players()
            position_updated = {
                    'Player1': self.player1.y,
                    'Player2': self.player2.y,
                    'ballX': self.ball.x,
                    'ballY': self.ball.y,
                }

            time.sleep(0.016)  # Approx 60 FPS

            self.send(text_data=json.dumps(position_updated))
             
    
    def disconnect(self, close_code):
        logger.info(f"Disconnected: {close_code}")
        self.running = False

    def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            key = text_data_json["key"]
            action = text_data_json["action"]
            if key in ["KeyW", "KeyS", "ArrowUp", "ArrowDown"]:
                with self.lock:  # Acquire the lock before modifying shared resources
                    if action == "move":
                        if key == "KeyW":
                            self.player1.velocityY = -3
                        elif key == "KeyS":
                            self.player1.velocityY = 3
                        # player 2
                        elif key == "ArrowUp":
                            self.player2.velocityY = -3
                        elif key == "ArrowDown":
                            self.player2.velocityY = 3
                    else:
                        if key == "KeyW":
                            self.player1.velocityY = 0
                        elif key == "KeyS":
                            self.player1.velocityY = 0
                        # player 2
                        elif key == "ArrowUp":
                            self.player2.velocityY = 0
                        elif key == "ArrowDown":
                            self.player2.velocityY = 0
            position_updated = {
                    'Player1': self.player1.y,
                    'Player2': self.player2.y,
                    'ballX': self.ball.x,
                    'ballY': self.ball.y,
                }
            self.send(text_data=json.dumps(position_updated))
        except json.JSONDecodeError as e:
            logger.error("Failed to parse JSON: %s", e)
        except Exception as e:
            logger.error("Unexpected error: %s", e)

