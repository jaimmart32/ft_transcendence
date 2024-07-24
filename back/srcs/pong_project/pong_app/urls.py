from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView

urlpatterns = [
	path('signup/', views.signupClass.as_view(), name='signup'),
	path('login/', views.loginClass.as_view(), name='login'),
	#path('login42/', views.login42Class.as_view(), name='login42'),
	path('', views.main_view, name='main'),

	path('home/', views.Home.as_view(), name='home'),
	path('home/profile/', views.Profile.as_view(), name='profile'),
	path('home/profile/edit/', views.EditProfile.as_view(), name='edit_profile'),

	path('token/', TokenObtainPairView.as_view, name='token_obtain_pair'),
	path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

	path('api/auth-settings/', views.authSettings.as_view(), name='auth_settings'),
	path('api/auth/callback/', views.callback.as_view(), name='callback'),
	#path('login42/', views.login42, name='login42'),
    	#path('callback/', views.callback, name='callback'),
    	#path('profile42/', views.profile42, name='profile42'),
]
