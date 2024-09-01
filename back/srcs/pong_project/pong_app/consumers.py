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
        return yPosition < 0 or yPosition + ball> board

class PongConsumer(WebsocketConsumer):
    def connect(self):
        logger.info(self.scope)  # Print the scope to debug the connection
        self.accept()
        self.game_thread = threading.Thread(target=self.game_loop)
        self.game_thread.start()

    def game_loop(self):
        self.running = True
        board = Board()
        ball = Ball(board=board)
        player1 = Paddle(number=1, board=board)
        player2 = Paddle(number=2, board=board)
        while self.running:
            if not ballOutOfBounds(ball.y, player1.height, board.height):
                ball.velocityY = -ball.velocityY
            # check if the ball was saved or if it was scored
            ball.x += ball.velocityX
            ball.y += ball.velocityY
            print("Ballx:", ball.x)
            position_updated = {
                    'Player1': player1.y,
                    'Player2': player2.y,
                    'Speed1': 3,
                    'Speed2': 3,
                    'ballX': ball.x,
                    'ballY': ball.y,
                    'velocityX': ball.velocityX,
                    'velocityY': ball.velocityY,
                }

            time.sleep(0.016)  # Approx 60 FPS

            self.send(text_data=json.dumps(position_updated))
             
    
    def disconnect(self, close_code):
        logger.info(f"Disconnected: {close_code}")
        self.running = False

    def move_ball(self):
        while True:
            zzz

    def receive(self, text_data):
        pass

    def other():
        try:
            text_data_json = json.loads(text_data)
            message = text_data_json["Player1"]
            logger.info("Message received: %s", message)
        except json.JSONDecodeError as e:
            logger.error("Failed to parse JSON: %s", e)
        except Exception as e:
            logger.error("Unexpected error: %s", e)

        # Logic to update position
        player1 = text_data_json["Player1"]
        key = text_data_json["key"]
        player2 = text_data_json["Player2"]
        speed1 = text_data_json["speed1"]
        speed2 = text_data_json["speed2"]
        ball = [text_data_json['ballX'], text_data_json['ballY']]
        ballspeed = [text_data_json["velocityX"], text_data_json["velocityY"]]
        # player 1
        if key in ["KeyW", "KeyS", "ArrowUp", "ArrowDown"]:
            if key == "KeyW":
                speed1 = -3
                speed2 = 0
            elif key == "KeyS":
                speed1 = 3
                speed2 = 0
            # player 2
            elif key == "ArrowUp":
                speed1 = 0
                speed2 = -3
            elif key == "ArrowDown":
                speed1 = 0
                speed2 = 3
            try:
                speed1 = int(speed1)
                if not outOfBounds(player1 + speed1, 90, 500):
                    player1 += int(speed1)
            except:
                pass
            try:
                speed2 = int(speed2)
                if not outOfBounds(player2 + speed2, 90, 500):
                    player2 += int(speed2)
            except:
                pass
        if not ballOutOfBounds(ball[1], 18, 500):
            ballspeed[1] = -ballspeed[1]
        # check if the ball was saved or if it was scored
        ball[1] += ballspeed[1]
        ball[0] += ballspeed[0]
        position_updated = {
                'Player1': player1,
                'Player2': player2,
                'Speed1': speed1,
                'Speed2': speed2,
                'ballX': ball[0],
                'ballY': ball[1],
                'velocityX': ballspeed[0],
                'velocityY': ballspeed[1],
            }

        time.sleep(0.016)  # Approx 60 FPS

        self.send(text_data=json.dumps(position_updated))

