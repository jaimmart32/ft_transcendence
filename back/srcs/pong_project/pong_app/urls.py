from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("javi", views.index, name="index"),
    path("<str:name>", views.greet, name="greet")
]