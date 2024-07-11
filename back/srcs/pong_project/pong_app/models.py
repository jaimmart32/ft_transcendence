from django.db import models

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=16)
    password = models.CharField(max_length=16)
    games_played = models.IntegerField()
    wins = models.IntegerField()
    losses = models.IntegerField()
    championships = models.IntegerField()
    connected = models.BooleanField()

    def __str__(self):
        return f"{self.username}"


class Tournament(models.Model):
    name = models.CharField(max_length=16)
    winner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="winner")
    runner_up = models.ForeignKey(User, on_delete=models.CASCADE, related_name="runner_up")

    def __str__(self):
        return f"{self.id}: {self.winner} beat {self.runner_up} to win {self.name}"

