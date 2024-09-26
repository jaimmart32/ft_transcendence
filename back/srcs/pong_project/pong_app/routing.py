#This file defines routes for WebSockets, similar to how urls.py handles HTTP routes in Django. 
#The re_path function is like path, but allows regular expressions to define more complex paths.
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/pong-socket/', consumers.PongConsumer.as_asgi()),
]