import json
#from channels.generic.websocket import AsyncWebsocketConsumer
import contextlib
import random
from channels.generic.websocket import WebsocketConsumer
import logging
import time
import threading
from .models import Paddle, Board, Ball, Game, CustomUser

logger = logging.getLogger(__name__)

def outOfBounds(yPosition, player, board):
    return yPosition < 0 or yPosition + player > board

def ballOutOfBounds(yPosition, ball, board):
    return yPosition < 0 or yPosition + ball > board


class PongConsumer(WebsocketConsumer):
    def connect(self):  # TODO: cambiar esto para que sea async
        self.game_id = int(self.scope['url_route']['kwargs']['game_id'])
        self.user = self.scope['user']
        self.game_id_group = f'pong_app_{self.game_id}'

        with contextlib.suppress(KeyError):
            if len(self.channel_layer.groups[self.group_name]) > 2:
                print("JAVI42")
                print(self.channel_layer.groups[self.group_name])
                #self.accept()

        # Resolve the lazy user object to a CustomUser instance
        if hasattr(self.user, '_wrapped') and self.user._wrapped is not None:
            resolved_user = self.user._wrapped
        else:
            resolved_user = self.user

        # Ensure that the resolved user is an instance of CustomUser
        if not isinstance(resolved_user, CustomUser):
            logger.error(f"Resolved user is not a CustomUser instance: {resolved_user}")
            self.close()
            return

        # Try to retrieve the game first without assigning player1/player2 initially
        try:
            self.game = Game.objects.get(game_id=self.game_id)
        except Game.DoesNotExist:
            # If game doesn't exist, create it without player1 and player2
            self.game = Game.objects.create(
                game_id=self.game_id,
                enough_players=False,
                winner=None,
                scores1=[],
                scores2=[]
            )

        # Determine if the user is Player 1 or Player 2 based on whether slots are taken
        if not self.game.player1:
            self.game.player1 = self.resolved_user
            self.player_role = 'player1'
        elif not self.game.player2:
            self.game.player2 = self.resolved_user
            self.player_role = 'player2'
        else:
            # Reject the connection if the room is full (both player slots taken)
            self.close()
            return

       
       # Add the WebSocket connection to the group
        self.channel_layer.group_add(
            self.game_id_group,
            self.channel_name
        )

        # Save the game state with the player assignments
        self.game.save()

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

            self.channel_layer.group_send(
            self.game_id_group,
            {
                'position': position_updated
            }
        )
             
    
    def disconnect(self, close_code):
        logger.info(f"Disconnected: {close_code}")
        self.running = False
        #self.game_thread.join()  # Wait for the thread to finish before exiting
        self.channel_layer.group_discard(
            self.game_id_group,
            self.channel_name
        )

        # Remove players from the game
        if self.player_role == 'player1':
            self.game.player1 = None
        elif self.player_role == 'player2':
            self.game.player2 = None

        self.game.save()

    def receive(self, text_data):
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
            self.channel_layer.group_send(
            self.game_id_group,
            {
                'position': position_updated
            }
        )
        except json.JSONDecodeError as e:
            logger.error("Failed to parse JSON: %s", e)
        except Exception as e:
            logger.error("Unexpected error: %s", e)

