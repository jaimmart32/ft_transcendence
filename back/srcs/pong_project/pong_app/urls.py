from django.urls import path, re_path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from django.views.generic import TemplateView

urlpatterns = [
	path('signup/', views.signupClass.as_view(), name='signup'),
	path('activate/<uidb64>/<token>/', views.ActivateAccountView.as_view(), name='activate'),
	path('login/', views.loginClass.as_view(), name='login'),
	path('login/verify-2fa/', views.verify2FA.as_view(), name='verify2FA'),
	path('', views.main_view, name='main'),

	path('home/', views.Home.as_view(), name='home'),
	path('home/profile/', views.Profile.as_view(), name='profile'),
	path('home/profile/edit/', views.EditProfile.as_view(), name='edit_profile'),

	path('token/', TokenObtainPairView.as_view, name='token_obtain_pair'),
	path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

	path('api/auth-settings/', views.authSettings.as_view(), name='auth_settings'),
	path('api/auth/verify/', views.authVerify.as_view(), name='verify'),
	path('api/auth/create-user/', views.authCreateUser.as_view(), name='create-user'),

	path('move/', views.Move.as_view(), name='move'),
	
	path('callback.html', TemplateView.as_view(template_name='callback.html'), name='callback_html'),
	path('index.html', TemplateView.as_view(template_name='index.html'), name='index_html'),
    	#re_path(r'^.*$', views.main_view, name='index.html')
	
	# Friends
	#path('friends/', FriendsList.as_view(), name='friends-list'),
	#path('friends/add/', AddFriend.as_view(), name='add-friend'),
	#path('friends/remove/', RemoveFriend.as_view(), name='remove-friend'),
]
