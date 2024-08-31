import json
from channels.generic.websocket import WebsocketConsumer
import logging
import time

logger = logging.getLogger(__name__)

def outOfBounds(yPosition, player, board):
		return yPosition < 0 or yPosition + player > board

def ballOutOfBounds(yPosition, ball, board):
        return yPosition < 0 or yPosition + ball> board

class PongConsumer(WebsocketConsumer):
    def connect(self):
        logger.info(self.scope)  # Print the scope to debug the connection
        self.accept()

    def disconnect(self, close_code):
        logger.info(f"Disconnected: {close_code}")

    def receive(self, text_data):
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

