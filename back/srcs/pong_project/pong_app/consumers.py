import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.generic.websocket import WebsocketConsumer
import contextlib
import random
import asyncio
import logging
import time
import threading
from .models import Paddle, Board, Ball, Game, CustomUser

logger = logging.getLogger(__name__)

def outOfBounds(yPosition, player, board):
    return yPosition < 0 or yPosition + player > board

def ballOutOfBounds(yPosition, ball, board):
    return yPosition < 0 or yPosition + ball > board

waiting_queue = []
active_players = set()
game_states = {}

# En un archivo nuevo, por ejemplo, game_state.py
class GameState:
    def __init__(self):
        self.board = Board(width=900, height=500)
        self.ball = Ball(board=self.board)
        self.player1 = Paddle(number=1, board=self.board)
        self.player2 = Paddle(number=2, board=self.board)
        self.game_loop_started = False
        self.running = True

    def reset(self):
        self.ball = Ball(board=self.board)
        self.player1.score = 0
        self.player2.score = 0
        self.running = True


class PongConsumer(AsyncWebsocketConsumer):
    async def connect(self):

        self.user_id = int(self.scope['url_route']['kwargs']['userid'])
        self.group_name = None
        self.player_number = None
        self.game_state = None

        if self.user_id in active_players:
            await self.close()  # Close the WebSocket connection
            logger.info(f"Player {self.user_id} is already connected. Closing duplicate connection.")
            return
        active_players.add(self.user_id)
        waiting_queue.append(self)
        print(f'!!!!!! queue length = {len(waiting_queue)}', flush=True)
        self.user = await CustomUser.objects.aget(id=self.user_id)
        #self.user = CustomUser.objects.get(id=self.user_id)

        await self.accept()
        # if there are sufficient players start if not wait
        if len(waiting_queue) >= 2:
                
            self.player_1 = waiting_queue.pop(0)
            self.player_2 = waiting_queue.pop(0)

            # Create unique identifier for game
            self.group_name = f'pong_game_{self.player_1.user_id}_{self.player_2.user_id}'

            self.player_1.game_state = GameState()
            self.player_2.game_state = self.player_1.game_state
            game_states[self.group_name] = self.player_1.game_state
            # Asign same room for players
            await self.player_1.start_game(self.group_name, 1)
            await self.player_2.start_game(self.group_name, 2)

#            await self.send(text_data=json.dumps({'message': 'Ws connextion established'}))

    async def start_game(self, group_name, player_number):
        print(self.channel_name, flush=True)
        self.group_name = group_name
        self.player_number = player_number
        #self.game_state = GameState()

        #game_states[group_name] = self.game_state

        # Add this player to room
        await self.channel_layer.group_add(self.group_name, self.channel_name)

        print(f"!!!!!!Jugador {self.player_number} se unió a la sala: {self.group_name}!!!!!!", flush=True)

        if player_number == 1:# and not hasattr(self.game_state, 'game_loop_started'):
            print("INIZIALICING GAME OBJECTS", flush=True)
            self.game_state.board = Board(width=900, height=500)
            self.game_state.ball = Ball(board=self.game_state.board)
            self.game_state.player1 = Paddle(number=1, board=self.game_state.board)
            self.game_state.player2 = Paddle(number=2, board=self.game_state.board)
            
            self.game_state.game_loop_started = True
            asyncio.create_task(self.game_loop())
        self.running = True



    def ballSaved(self):
        if (self.game_state.ball.x + self.game_state.ball.velocityX <= self.game_state.player1.x + self.game_state.player1.width) and (self.game_state.ball.x >= self.game_state.player1.x) and \
                (self.game_state.player1.y <= self.game_state.ball.y <= self.game_state.player1.y + self.game_state.player1.height):
            paddle_center = self.game_state.player1.y + self.game_state.player1.height / 2
            hit_pos = (self.game_state.ball.y - paddle_center) / (self.game_state.player1.height / 2)
            self.game_state.ball.velocityY += hit_pos * 3  # Modify the vertical velocity
            
            self.game_state.ball.x = self.game_state.player1.x + self.game_state.player1.width + 1
            return True

        elif (self.game_state.ball.x + self.game_state.ball.velocityX >= self.game_state.player2.x - self.game_state.ball.width) and (self.game_state.ball.x <= self.game_state.player2.x) and \
                (self.game_state.player2.y <= self.game_state.ball.y <= self.game_state.player2.y + self.game_state.player2.height):
            paddle_center = self.game_state.player2.y + self.game_state.player2.height / 2
            hit_pos = (self.game_state.ball.y - paddle_center) / (self.game_state.player2.height / 2)
            self.game_state.ball.velocityY += hit_pos * 3
            
            self.game_state.ball.x = self.game_state.player2.x - self.game_state.ball.width - 1
            return True

        return False


    def move_players(self):
        if not outOfBounds(self.game_state.player1.y + self.game_state.player1.velocityY, self.game_state.player1.height, self.game_state.board.height):
            self.game_state.player1.y += self.game_state.player1.velocityY
        if not outOfBounds(self.game_state.player2.y + self.game_state.player2.velocityY, self.game_state.player1.height, self.game_state.board.height):
            self.game_state.player2.y += self.game_state.player2.velocityY
    
    def score(self):
        if self.game_state.ball.x >= self.game_state.board.width:
            self.game_state.player1.score += 1
            return True
        elif self.game_state.ball.x <= 0 - self.game_state.ball.width:
            self.game_state.player2.score += 1
            return True
        return False

    def move_ball(self):
#        print("MOVE BALL CALLED", flush=True)
        #print("Before: ", self.game_state.ball.x, flush=True)
        #async with self.lock:  # Acquire the lock before modifying shared resources CHECK IF NEEDED
        if ballOutOfBounds(self.game_state.ball.y, self.game_state.ball.height, self.game_state.board.height):
            self.game_state.ball.velocityY = -self.game_state.ball.velocityY

        # Ensure that the ball has a minimum speed to avoid getting stuck
        if abs(self.game_state.ball.velocityX) < 5:
            self.game_state.ball.velocityX = 5 if self.game_state.ball.velocityX > 0 else -5

        if self.ballSaved():
            self.game_state.ball.velocityX = -self.game_state.ball.velocityX

        # Move the ball as usual
        self.game_state.ball.x += self.game_state.ball.velocityX
        self.game_state.ball.y += self.game_state.ball.velocityY

        
        #

        # Check if the ball is out of bounds to score
        if self.score():
            if self.game_state.player1.score == 7 or self.game_state.player2.score == 7:
                position_updated = {
                    'Player1': self.game_state.player1.y,
                    'Player2': self.game_state.player2.y,
                    'ballX': self.game_state.ball.x,
                    'ballY': self.game_state.ball.y,
                    'Score1': self.game_state.player1.score,
                    'Score2': self.game_state.player2.score
                }
                self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'send_position',
                    'position': position_updated
                }
            )
                self.running = False
                #self.disconnect("game over") # TODO: when you restart the game it gets a bit weird so it has to be improved
            # Reset the ball after scoring
            self.game_state.ball = Ball(board=self.game_state.board)
        
    
    
    async def game_loop(self):
        print("GAME LOOP CALLED", flush=True)
        self.running = True
        while self.running:
            self.move_ball()
            self.move_players()
            position_updated = {
                    'Player1': self.game_state.player1.y,
                    'Player2': self.game_state.player2.y,
                    'ballX': self.game_state.ball.x,
                    'ballY': self.game_state.ball.y,
                    'Score1': self.game_state.player1.score,
                    'Score2': self.game_state.player2.score
                }
            #print(f'Player: {self.user_id}, ballx: {self.game_state.ball.x}', flush=True)
            #print(self.game_state.player1.y, flush=True)
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'send_position',
                    'position': position_updated
                }
            )

            await asyncio.sleep(0.03)  # 0.016 -> Approx 60 FPS
#            await self.send(text_data=json.dumps({
#                'type': 'send_position',
#                'position': position_updated
#            }))
             
    
    async def disconnect(self, close_code):
        logger.info(f"Disconnected: {close_code}")
        self.running = False
        active_players.discard(self.user_id)
        #self.game_thread.join()  # Wait for the thread to finish before exiting
        if self.group_name:
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )
        
        # Close the WebSocket connection
        await super().disconnect(close_code)

        # Remove game state if both players disconnect
        #if self.group_name in game_states and not any(player.running for player in [self.player_1, self.player_2]):
        #    del game_states[self.group_name]

    async def send_position(self, event):
        #print("SENDING POSITION", flush=True)
        position = event['position']
        await self.send(text_data=json.dumps(position))

    async def receive(self, text_data):
        print("!!!!!RECIBIDO!!!", flush=True)
        try:
            text_data_json = json.loads(text_data)
            key = text_data_json['position']["key"]
            action = text_data_json['position']["action"]

            # Determinar qué jugador envió la actualización
            print(f"\033[91mPlayer number : {self.player_number}\033[0m", flush=True)
            print(f"\033[91mKey : {key}\033[0m", flush=True)
            print(f"\033[91mAction : {action}\033[0m", flush=True)
            player = self.game_state.player1 if self.player_number == 1 else self.game_state.player2
        
            if action == "move":
                if key == "ArrowUp":
                    player.velocityY = -10
                elif key == "ArrowDown":
                    player.velocityY = 10
            else:
                player.velocityY = 0

            position_updated = {
                    'Player1': self.game_state.player1.y,
                    'Player2': self.game_state.player2.y,
                    'ballX': self.game_state.ball.x,
                    'ballY': self.game_state.ball.y,
                    'Score1': self.game_state.player1.score,
                    'Score2': self.game_state.player2.score
                }
            await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'send_position',
                'position': position_updated
            }
        )
        except json.JSONDecodeError as e:
            logger.error("Failed to parse JSON: %s", e)
        except Exception as e:
            logger.error("Unexpected error: %s", e)

    def update_game_stats(self, winner):
        player1_user = CustomUser.objects.get(id=self.game_state.player1.user_id)
        player2_user = CustomUser.objects.get(id=self.game_state.player2.user_id)

        player1_stats = player1_user.game_stats
        player1_stats['total'] = player1_stats.get('total', 0) + 1
        if winner == 1:
            player1_stats['wins'] = player1_stats.get('wins', 0) + 1
        else:
            player1_stats['losses'] = player1_stats.get('losses', 0) + 1
        player1_user.game_stats = player1_stats
        player1_user.save()

        player2_stats = player2_user.game_stats
        player2_stats['total'] = player2_stats.get('total', 0) + 1
        if winner == 2:
            player2_stats['wins'] = player2_stats.get('wins', 0) + 1
        else:
            player2_stats['losses'] = player2_stats.get('losses', 0) + 1
        player2_user.game_stats = player2_stats
        player2_user.save()