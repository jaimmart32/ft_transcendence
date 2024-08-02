from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from django.views.generic import TemplateView

urlpatterns = [
	path('signup/', views.signupClass.as_view(), name='signup'),
	path('login/', views.loginClass.as_view(), name='login'),
	path('', views.main_view, name='main'),

	path('home/', views.Home.as_view(), name='home'),
	path('home/profile/', views.Profile.as_view(), name='profile'),
	path('home/profile/edit/', views.EditProfile.as_view(), name='edit_profile'),

	path('token/', TokenObtainPairView.as_view, name='token_obtain_pair'),
	path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

	path('api/auth-settings/', views.authSettings.as_view(), name='auth_settings'),
	path('api/auth/verify/', views.authVerify.as_view(), name='verify'),
	path('api/auth/create-user/', views.authCreateUser.as_view(), name='create-user'),

	path('callback.html', TemplateView.as_view(template_name='callback.html'), name='callback_html'),
	path('index.html', TemplateView.as_view(template_name='index.html'), name='index_html'),
]
