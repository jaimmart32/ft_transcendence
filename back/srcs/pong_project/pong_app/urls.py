from django.urls import path
from . import views

urlpatterns = [
	path('signup/', views.signup_view, name='signup'),
	path('', views.main_view, name='main'),
]
