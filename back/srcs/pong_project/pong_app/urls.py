from django.urls import path, re_path
from . import views
from django.views.generic import TemplateView

urlpatterns = [
	path('signup/', views.signupView, name='signup'),
	path('activate/<uidb64>/<token>/', views.ActivateAccountView, name='activate'),
	path('login/', views.loginView, name='login'),
	path('logout/', views.logoutView, name='logout'),
	path('login/verify-2fa/', views.verify2FA, name='verify2FA'),
	path('', views.main_view, name='main'),

	path('verify-refresh/', views.verifyRefresh, name='verify-refresh'),

	path('home/', views.Home, name='home'),
	path('home/profile/', views.Profile, name='profile'),
	path('home/profile/edit/', views.EditProfile, name='edit_profile'),
	path('get_user_info/', views.getUserInfo, name='get_user_info'),


	path('api/auth-settings/', views.authSettings, name='auth_settings'),
	path('api/auth/verify/', views.authVerify, name='verify'),
	path('api/auth/create-user/', views.authCreateUser, name='create-user'),

	path('callback.html', TemplateView.as_view(template_name='callback.html'), name='callback_html'),
	path('index.html', TemplateView.as_view(template_name='index.html'), name='index_html'),
	
	# Friends
	path('home/friends/', views.FriendsList, name='friends-list'),
	path('home/friends/add/', views.AddFriend, name='add-friend'),
	path('home/friends/remove/', views.RemoveFriend, name='remove-friend'),

	# Tournaments
	path('home/game/tournament/create/', views.create_tournament_view, name='create_tournament'),

	# Game
	#path('<str:game_id>/', views.game, name='create_game')
]
