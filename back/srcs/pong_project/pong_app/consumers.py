import json
from channels.generic.websocket import AsyncWebsocketConsumer
import contextlib
import random
#from channels.generic.websocket import WebsocketConsumer
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


class PongConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.game_id = int(self.scope['url_route']['kwargs']['game_id'])
        self.user_id = int(self.scope['url_route']['kwargs']['userid'])
        print("args:", self.user_id, flush=True)
        self.user = await asyncio.to_thread(CustomUser.objects.get, id=self.user_id)
        #self.user = CustomUser.objects.get(id=self.user_id)
        print("user:", self.user.username, flush=True)
        self.group_name = f'pong_app_{self.game_id}'

        # Add the WebSocket connection to the group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        #self.game = await asyncio.to_thread(Game.objects.get, id=self.game_id)

        with contextlib.suppress(KeyError):
            if len(self.channel_layer.groups[self.group_name]) > 2:
                await self.close()

        # Save the game state with the player assignments
        #await self.game.save()
        #await asyncio.to_thread(self.game.save)

        await self.accept()

        self.running = True
        self.board = Board()
        self.ball = Ball(board=self.board)
        self.player1 = Paddle(number=1, board=self.board)
        self.player2 = Paddle(number=2, board=self.board)
        #asyncio.create_task(self.game_loop())
        self.lock = threading.Lock()  # Initialize the lock
        self.game_thread = threading.Thread(target=self.game_loop)
        self.game_thread.start()


    def ballSaved(self):
        if (self.ball.x + self.ball.velocityX <= self.player1.x + self.player1.width) and (self.ball.x >= self.player1.x) and \
                (self.player1.y <= self.ball.y <= self.player1.y + self.player1.height):
            paddle_center = self.player1.y + self.player1.height / 2
            hit_pos = (self.ball.y - paddle_center) / (self.player1.height / 2)
            self.ball.velocityY += hit_pos * 3  # Modify the vertical velocity
            
            self.ball.x = self.player1.x + self.player1.width + 1
            return True

        elif (self.ball.x + self.ball.velocityX >= self.player2.x - self.ball.width) and (self.ball.x <= self.player2.x) and \
                (self.player2.y <= self.ball.y <= self.player2.y + self.player2.height):
            paddle_center = self.player2.y + self.player2.height / 2
            hit_pos = (self.ball.y - paddle_center) / (self.player2.height / 2)
            self.ball.velocityY += hit_pos * 3
            
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
                    self.running = False
                    #self.disconnect("game over") # TODO: when you restart the game it gets a bit weird so it has to be improved
                # Reset the ball after scoring
                self.ball = Ball(board=self.board)
    
    
    async def game_loop(self):
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

            await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'send_position',
                'position': position_updated
            }
        )
             
    
    async def disconnect(self, close_code):
        logger.info(f"Disconnected: {close_code}")
        self.running = False
        #self.game_thread.join()  # Wait for the thread to finish before exiting
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

        # Remove players from the game
        if self.player_role == 'player1':
            self.game.player1 = None
        elif self.player_role == 'player2':
            self.game.player2 = None

        self.game.save()

    async def send_position(self, event):
        position = event['position']
        await self.send(text_data=json.dumps(position))

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            key = text_data_json['position']["key"]
            action = text_data_json['position']["action"]
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

