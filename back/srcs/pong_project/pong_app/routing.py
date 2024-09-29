from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'wss/pong-socket/(?P<game_id>\w+)/$', consumers.PongConsumer.as_asgi()), 
    # 'w+' sirve para crear nuevas rooms por cada llamada mientras que el 
    # '$' sirve para indicar que ahí se acaba la url, si añades algo después no lo va a encontrar
]