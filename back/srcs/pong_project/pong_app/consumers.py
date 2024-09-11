import json
from channels.generic.websocket import WebsocketConsumer
import random
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

    def ballSaved(self):
        # Check if the ball is within the vertical range of player 1 and near their paddle (on the left side)
        if (self.ball.x + self.ball.velocityX <= self.player1.x + self.player1.width) and (self.ball.x >= self.player1.x) and \
                (self.player1.y <= self.ball.y <= self.player1.y + self.player1.height):
            # Calculate the hit position relative to the paddle's center
            paddle_center = self.player1.y + self.player1.height / 2
            hit_pos = (self.ball.y - paddle_center) / (self.player1.height / 2)  # Get a value between -1 and 1
            self.ball.velocityY += hit_pos * 5  # Modify the vertical velocity
            
            # Ensure the ball is moved outside of the paddle to prevent getting stuck
            self.ball.x = self.player1.x + self.player1.width + 1
            return True

        # Check if the ball is within the vertical range of player 2 and near their paddle (on the right side)
        elif (self.ball.x + self.ball.velocityX >= self.player2.x - self.ball.width) and (self.ball.x <= self.player2.x) and \
                (self.player2.y <= self.ball.y <= self.player2.y + self.player2.height):
            # Calculate the hit position relative to the paddle's center
            paddle_center = self.player2.y + self.player2.height / 2
            hit_pos = (self.ball.y - paddle_center) / (self.player2.height / 2)
            self.ball.velocityY += hit_pos * 5  # Modify the vertical velocity
            
            # Ensure the ball is moved outside of the paddle to prevent getting stuck
            self.ball.x = self.player2.x - self.ball.width - 1
            return True

        return False


    def move_players(self):
        with self.lock:  # Acquire the lock before modifying shared resources
            if not outOfBounds(self.player1.y + self.player1.velocityY, self.player1.height, self.board.height):
                self.player1.y += self.player1.velocityY
            if not outOfBounds(self.player2.y + self.player2.velocityY, self.player1.height, self.board.height):
                self.player2.y += self.player2.velocityY
    
    def score(self):
        if self.ball.x >= self.board.width:
            self.player1.score += 1
            return True
        elif self.ball.x <= 0 - self.ball.width:
            self.player2.score += 1
            return True
        return False

    def move_ball(self):
        with self.lock:  # Acquire the lock before modifying shared resources
            if ballOutOfBounds(self.ball.y, self.ball.height, self.board.height):
                self.ball.velocityY = -self.ball.velocityY

            if self.ballSaved():
                # Reverse the horizontal velocity when the ball hits the paddle
                self.ball.velocityX = -self.ball.velocityX

                # Ensure that the ball has a minimum speed to avoid getting stuck
                if abs(self.ball.velocityX) < 5:
                    self.ball.velocityX = 5 if self.ball.velocityX > 0 else -5

            # Move the ball as usual
            self.ball.x += self.ball.velocityX
            self.ball.y += self.ball.velocityY

            # Check if the ball is out of bounds to score
            if self.score():
                if self.player1.score == 7 or self.player2.score == 7:
                    self.disconnect("game over")
                # Reset the ball after scoring
                self.ball = Ball(board=self.board)
    
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
                    'Score1': self.player1.score,
                    'Score2': self.player2.score
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
                            self.player1.velocityY = -10
                        elif key == "KeyS":
                            self.player1.velocityY = 10
                        # player 2
                        elif key == "ArrowUp":
                            self.player2.velocityY = -10
                        elif key == "ArrowDown":
                            self.player2.velocityY = 10
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
                    'Score1': self.player1.score,
                    'Score2': self.player2.score
                }
            self.send(text_data=json.dumps(position_updated))
        except json.JSONDecodeError as e:
            logger.error("Failed to parse JSON: %s", e)
        except Exception as e:
            logger.error("Unexpected error: %s", e)

