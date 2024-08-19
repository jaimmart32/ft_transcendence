import json
from channels.generic.websocket import WebsocketConsumer
import logging

logger = logging.getLogger(__name__)

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

        # await.self.send(text_data=json.dump)
