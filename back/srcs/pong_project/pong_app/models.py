from django.db import models
from django.contrib.auth.models import AbstractUser 

# Create your models here.

class	CustomUser(AbstractUser):
	# Preferred language
	# lang = models.CharField(max_length=2)
	tfa = models.BooleanField(default=False)
	# Game stats for every game played, including the tournament games(total/wins/losses)
	game_stats = models.JSONField(default=dict)
	# Tournament stats ONLY for tournament, not the rounds in the tournament(total/wins/losses)
	tournament_stats = models.JSONField(default=dict)
	# Online or offline status
	status = models.BooleanField(defult=False)

	def __str__(self):
		return f"{self.username}"

class Tournament(models.Model):
	name = models.CharField(max_length=12)
	# Key = User chosen tag, value = user instance
	participants = models.JSONField(default=dict)
	winner = models.CharField(max_length=12, blank=True, null=True)

	def __str__(self):
		return f"Winner of {self.name}: {self.winner}!"

class	Game(models.Model):
	player1 = models.CharField(max_length=8)
	player2 = models.CharField(max_length=8)
	winner = models.CharField(max_length=8, blank=True, null=True)
	# Game format:
	# game = 3 rounds
	# round = 20 seconds
	# If draw, +1 round, first who scores is the winner
	scores1 = models.JSONField(default=list)
	scores2 = models.JSONField(default=list)

	def __str__(self):
		return f"Winner: {self.winner}!"
