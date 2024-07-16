from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView

urlpatterns = [
	path('signup/', views.signup.as_view(), name='signup'),
	path('login/', views.login.as_view(), name='login'),
	path('', views.main_view, name='main'),

	path('home/', views.Home.as_view(), name='home'),

	path('token/', TokenObtainPairView.as_view, name='token_obtain_pair'),
	path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
