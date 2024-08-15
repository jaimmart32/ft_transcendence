import json
from channels.generic.websocket import WebsocketConsumer

class PongConsumer(WebsocketConsumer):
    def connect(self):
        self.accept() # We accept the incoming connections

        self.send(text_data=json.dumps({
                'message': "Hola",
            }))

        def disconnect(self, close_code):
            pass

        def receive(self, text_data):
            # Process the message received from the client
            text_data_json = json.loads(text_data)
            message = text_data_json['message']

            # Send a response back to the client
            #self.send(text_data=json.dumps({
            #    'message': message
            #}))
            print('Message:', message)