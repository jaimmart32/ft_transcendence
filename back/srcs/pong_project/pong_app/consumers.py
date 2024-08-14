import json
from channels.generic.websocket import WebsocketConsumer

class PongConsumer(WebsocketConsumer):
    def connect(self):
        self.accept() # We accept the incoming connections

        # self.send(text_data=json.dumps)

        """
        def disconnect(self, close_code):
            pass

        def receive(self, text_data):
        """