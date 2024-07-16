from django.db import models
from django.contrib.auth.models import AbstractUser 

# Create your models here.

class	CustomUser(AbstractUser):
	# Preferred language
	# lang = models.CharField(max_length=2)
	tfa = models.BooleanField()
	# Game stats for every game played, including the tournament games
	game_stats = 
	{
		'total' : 0,
		'wins' : 0,
		'losses' : 0,

	}
	# Tournament stats ONLY for tournament, not the rounds in the tournament
	tournament_stats =
	{
		'total' : 0,
		'wins' : 0,
		'losses' : 0,
	}
	# Online or offline status
	status = models.BooleanField()

	def __str__(self):
		return f"{self.username}"

class Tournament(models.Model):
	name = models.CharField(max_length=12)
	# Key = User chosen tag, value = user instance
	participants = 
	{
	}
	winner = models.CharField(max_length=12)

	def __str__(self):
		return f"Winner of {self.name}: {self.winner}!"

class	Game(models.Model):
	player1 = models.CharField(max_length=8)
	player2 = models.CharField(max_length=8)
	winner = models.CharField(max_length=8)
	# Game format:
	# game = 3 rounds
	# round = 20 seconds
	# If draw, +1 round, first who scores is the winner
	scores1 = []
	scores2 = []

	def __str__(self):
		return f"Winner: {self.winner}!"
