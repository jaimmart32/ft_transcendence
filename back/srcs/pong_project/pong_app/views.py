import json# Maybe not needed
from django.shortcuts import render, redirect
from django.db import IntegrityError
import requests
import os
from django.http import HttpResponse, JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response 
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from rest_framework_simplejwt.tokens import RefreshToken

from .models import CustomUser
from django.conf import settings
from django.contrib.auth.models import User 

# Create your views here.

def main_view(request):
	if not request.user.is_authenticated:
		if request.method == 'GET':
			return render(request, 'pong_app/index.html')
	return render(request, "pong_app/index.html")
		
class signupClass(APIView):
	permission_classes = [AllowAny]
	def post (self, request):
		data = request.data
		username = data.get('username')
		email = data.get('email')
		password = data.get('password')
		if CustomUser.objects.filter(username=username).exists():
			return Response({'status': 'error', 'message': 'Username already in use'})
		if CustomUser.objects.filter(email=email).exists():
			return Response({'status': 'error', 'message': 'Email already in use'})
		CustomUser.objects.create_user(username, email=email, password=password)
		return Response({'status': 'success', 'message': 'User created succesfully!'})

class loginClass(APIView):
	permission_classes = [AllowAny]
	def post(self, request):
		data = request.data
		username = data.get('username')
		password = data.get('password')
		user = authenticate(request, username=username, password=password)
		if user is not None:
			refresh = RefreshToken.for_user(user)
			login(request, user)
			return Response({
                'status': 'success',
                'message': 'Logged in successfully!',
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            })
		else:
			return Response({'status': 'error', 'message': 'Invalid credentials'})

class Home(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        content = {'message': 'Welcome to the home page!', 'username': request.user.username}
        return Response(content)

class Profile(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        content = {'username': request.user.username, 'email': request.user.email, 'tfa': request.user.tfa}
#'lang': request.user.lang,
#'game_stats': request.user.game_stats,
#'tournament_stats': request.user.tournament_stats
        return Response(content)

# View needed to edit the User's information. Auto-fills the current user's info, when new data
# is entered, checks if it is valid (passes check for characters and if it's repeated or not).

class	EditProfile(APIView):
	permission_classes = [IsAuthenticated]

	def put(self, request):
		user = request.user
		data = request.data

		try:
		# Do we need to check if the info entered is correct like in the front end?
			user.username = data.get('username', user.username)
			if CustomUser.objects.filter(username=user.username).exclude(id=user.id).exists():
				return Response({'status': 'error', 'message': 'Username in use'})
			user.email = data.get('email', user.email)
			if CustomUser.objects.filter(email=user.email).exclude(id=user.id).exists():
					return Response({'status': 'error', 'message': 'Email in use'})
			if data.get('twofa', user.tfa) == 'on':
				user.tfa = True
			else:
				user.tfa = False 
			if data.get('password'):
				user.set_password(data.get('password'))
			if 'avatar' in request.FILES:
				user.avatar = request.FILES['avatar']
				
			user.save()
			return Response({'status': 'success', 'message': 'Profile updated successfully!'})
		except IntegrityError as e:
			return Response({'status': 'error', 'message': 'Username in use'})
		return Response({'status': 'error', 'message': 'An error ocurred'})


class authSettings(APIView):

	permission_classes = [AllowAny]
	def get(self, request):
		data = {
			'status': 'success',
			'client_id': settings.CLIENT_ID,
			'redirect_uri': settings.REDIRECT_URI,
			'auth_endpoint': settings.AUTH_ENDPOINT,
			'scope': settings.SCOPE,
		}
		return Response(data)

class authVerify(APIView):
	
	permission_classes = [AllowAny]
	def post(self, request):
		code = request.data.get('code')
		if not code:
			return Response({'status': 'error', 'message': 'No code provided'})
		tokenResponse = requests.post(settings.TOKEN_URL, data=
		{
			'grant_type': 'authorization_code',
			'client_id': settings.CLIENT_ID,
			'client_secret': settings.CLIENT_SECRET,
			'redirect_uri': settings.REDIRECT_URI,
			'code': code
		})
		tokenData = tokenResponse.json()
		accessToken = tokenData.get('access_token')
		if not accessToken:
			return Response({'status': 'error', 'message': 'No access token was found'})
		userResponse = requests.get(settings.USER_INFO_URL, headers=
		{
			'Authorization': f'Bearer {accessToken}'
		})
		if userResponse.status_code != 200:
			return Response({'status': 'error', 'message': 'Could not retrieve the user data'})
		userInfo = userResponse.json()
		return Response({'status': 'success', 'userInfo': userInfo})

class authCreateUser(APIView):
	
	permission_classes = [AllowAny]
	def post(self, request):
		userInfo = request.data.get('userInfo')
		if not userInfo:
			return Response({'status': 'error', 'message': 'No user information'})
		username = "ft_" + userInfo['login']
		email = userInfo['email']
		password = ""
		if CustomUser.objects.filter(username=username).exists():
			return Response({'status': 'error', 'message': 'Username already in use'})
		if CustomUser.objects.filter(email=email).exists():
			return Response({'status': 'error', 'message': 'Email already in use'})
		user = CustomUser.objects.create_user(username, email=email, password=password)
		# Could use the CustomUser.objects.get_or_create() and later check if the user exists 
		refresh = RefreshToken.for_user(user)

		redirect_url = f"{settings.FRONT_REDIRECT}?access={refresh.access_token}&refresh={refresh}"
		return Response({'status': 'success', 'redirect_url': redirect_url}, status=200)

class Move(APIView):
    permission_classes = [AllowAny]
    def post(self, request):   
        print("move!")
        return Response({'status': 'error', 'message': 'Invalid credentials'})


def index(request):
    return render(request, 'index.html')

def login42(request):
    return redirect(f'{AUTHORIZATION_URL}?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code')


"""
def callback(request):
    code = request.GET.get('code')
    token_response = requests.post(TOKEN_URL, data={
        'grant_type': 'authorization_code',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'code': code,
        'redirect_uri': REDIRECT_URI,
    }).json()

    access_token = token_response.get('access_token')
    request.session['access_token'] = access_token
    return redirect('profile42')
    """

def profile42(request):
    access_token = request.session.get('access_token')
    if not access_token:
        return redirect('index')
    user_info_response = requests.get(USER_INFO_URL, headers={
        'Authorization': f'Bearer {access_token}'
    }).json()
    username = "ft_" + user_info_response['login']
    email = user_info_response['email']
    password = ""
    user = CustomUser.objects.create_user(username, email=email, password=password)
    refresh = RefreshToken.for_user(user)
    # return Response({
    #             'status': 'success',
    #             'message': 'Logged in successfully!',
    #             'access': str(refresh.access_token),
    #             'refresh': str(refresh)
    #         })
    return render(request, 'pong_app/testing.js', {
                 'status': 'success',
                 'message': 'Logged in successfully!',
                'access': str(refresh.access_token),
                'refresh': str(refresh)
           })
