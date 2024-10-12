from django.contrib import admin
from .models import CustomUser, Tournament, Game

# Register your models here.

admin.site.register(CustomUser)
admin.site.register(Tournament)
admin.site.register(Game)
