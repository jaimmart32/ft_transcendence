from django.urls import path, re_path
from . import views
from django.views.generic import TemplateView

urlpatterns = [
	path('signup/', views.signupView, name='signup'),
	path('activate/<uidb64>/<token>/', views.ActivateAccountView, name='activate'),
	path('login/', views.loginView, name='login'),
	path('login/verify-2fa/', views.verify2FA, name='verify2FA'),
	path('', views.main_view, name='main'),

	path('home/', views.Home, name='home'),
	path('home/profile/', views.Profile, name='profile'),
	path('home/profile/edit/', views.EditProfile, name='edit_profile'),

	#path('token/', TokenObtainPairView.as_view, name='token_obtain_pair'),
	#path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

	path('api/auth-settings/', views.authSettings, name='auth_settings'),
	path('api/auth/verify/', views.authVerify, name='verify'),
	path('api/auth/create-user/', views.authCreateUser, name='create-user'),

	path('move/', views.Move, name='move'),
	
	path('callback.html', TemplateView.as_view(template_name='callback.html'), name='callback_html'),
	path('index.html', TemplateView.as_view(template_name='index.html'), name='index_html'),
	
	# Friends
	path('friends/', views.FriendsList, name='friends-list'),
	path('friends/add/', views.AddFriend, name='add-friend'),
	path('friends/remove/', views.RemoveFriend, name='remove-friend'),
]
