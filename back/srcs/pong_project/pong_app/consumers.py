import json
from channels.generic.websocket import WebsocketConsumer
import logging

logger = logging.getLogger(__name__)

def outOfBounds(yPosition, player, board):
		return yPosition < 0 or yPosition + player > board

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
        # player 1
        if key == "KeyW":
            speed1 = -3
        elif key == "KeyS":
            speed1 = 3
        # player 2
        elif key == "ArrowUp":
            speed2 = -3
        elif key == "ArrowDown":
            speed2 = 3
        try:
            speed1 = int(speed1)
            if not outOfBounds(player1 + speed1, 10, 500):
                player1 += int(speed1)
        except:
                pass
        try:
            speed2 = int(speed2)
            if not outOfBounds(player2 + speed2, 10, 500):
                player2 += int(speed2)
        except:
            pass
        position_updated = {
            'Player1': player1,
            'Player2': player2,
            'Speed1': speed1,
            'Speed2': speed2,
        }

        self.send(text_data=json.dumps(position_updated))
