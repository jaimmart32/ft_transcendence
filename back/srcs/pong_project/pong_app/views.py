import json# Maybe not needed
import smtplib, ssl
from django.shortcuts import render, redirect
from django.db import IntegrityError
from django.core.exceptions import ValidationError
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
from .validators import validateUsername, validateEmail, validatePassword
from email.mime.text import MIMEText
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import PasswordResetTokenGenerator

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
		confPass = data.get('confPass')
		# Validating the new user's credentials
		try:
			validateUsername(username)
			validateEmail(email)
			validatePassword(password)
		except ValidationError as e:
			return Response({'status': 'error', 'message': str(e)})
		if not password == confPass:
			return Response({'status': 'error', 'message': 'Invalid password confirmation'})
		if CustomUser.objects.filter(username=username).exists():
			return Response({'status': 'error', 'message': 'Username already in use'})
		if CustomUser.objects.filter(email=email).exists():
			return Response({'status': 'error', 'message': 'Email already in use'})
		# Create the user after passing all the requirements	
		user = CustomUser.objects.create_user(username, email=email)
		user.is_active = False 
		user.set_password(password + settings.PEPPER)
		user.save()

		# Generating link for confirmation email
		token_generator = PasswordResetTokenGenerator()
		domain = settings.FRONT_REDIRECT
		uid = urlsafe_base64_encode(force_bytes(user.id))
		token = token_generator.make_token(user)
		activation_link = f'{domain}/activate/{uid}/{token}/'
		message = MIMEText(f'Please click the following link to activate your account\n {activation_link}')
		message['Subject'] = 'Account confirmation'
		message['From'] = settings.EMAIL_HOST_USER 
		message['To'] = email 

		# Starting the server smtp connection and sending the email
		smtp_connection = smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT)
		smtp_connection.starttls()
		smtp_connection.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
		smtp_connection.send_message(message)

		return Response({'status': 'success', 'message': 'User created succesfully!'})

class ActivateAccountView(APIView):
	permission_classes = [AllowAny]
	def get(self, request, uidb64, token):
		try:
				# Decode the user ID from the URL
			uid = force_str(urlsafe_base64_decode(uidb64))
			user = CustomUser.objects.get(pk=uid)
		except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
			user = None
			# Create an instance of the token generator
		token_generator = PasswordResetTokenGenerator()
				# Check if the token is valid
		if user is not None and token_generator.check_token(user, token):
			user.is_active = True
			user.save()
				    # Redirect to the login page or another page after successful activation
			return redirect('http://localhost:8000')  # Replace 'login' with the actual name of your login URL
		else:
				    # Render a template with an error message if the token is invalid
			return redirect('http://localhost:8000')  # Replace 'login' with the actual name of your login URL

class loginClass(APIView):
	permission_classes = [AllowAny]
	def post(self, request):
		data = request.data
		username = data.get('username')
		password = data.get('password')

		try:
			user = CustomUser.objects.get(username=username)
		except CustomUser.DoesNotExist:
			return Response({ 'status': 'error', 'message': 'Invalid username'})

		if user.is_active is False:
			return Response({'status': 'error', 'message': 'Email not verified'})
		if user.check_password(password + settings.PEPPER):
			refresh = RefreshToken.for_user(user)
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
        user = request.user
        content = {'username': user.username, 'email': user.email, 'tfa': user.tfa, 'avatar': user.avatar.url if user.avatar else None,}
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
			user.username = request.POST.get('username', user.username)
			if CustomUser.objects.filter(username=user.username).exclude(id=user.id).exists():
				return Response({'status': 'error', 'message': 'Username in use'})
			user.email = request.POST.get('email', user.email)
			if CustomUser.objects.filter(email=user.email).exclude(id=user.id).exists():
					return Response({'status': 'error', 'message': 'Email in use'})
			if request.POST.get('twofa', user.tfa) == 'on':
				user.tfa = True
			else:
				user.tfa = False 
			if request.POST.get('password'):
				user.set_password(data.get('password'))
			if 'avatar' in request.FILES:
				avatar = request.FILES['avatar']
				if avatar.size == 0:
					raise ValidationError("The uploaded file is empty!")
				else:
					user.avatar = avatar
			user.save()
			return Response({'status': 'success', 'message': 'Profile updated successfully!'})
		except IntegrityError as e:
			return Response({'status': 'error', 'message': 'Username in use'})
		except ValidationError as e:
			return Response({'status': 'error', 'message': 'File is empty'})
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
		return Response({'status': 'success', 'userInfo': userInfo}, status=200)

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


def profile42(request):
    access_token = request.session.get('access_token')
    if not access_token:
        return redirect('index')

    user_info_response = requests.get(USER_INFO_URL, headers={
        'Authorization': f'Bearer {access_token}'
    }).json()

    return JsonResponse(user_info_response)


def outOfBounds(yPosition, player, board):
		return yPosition < 0 or yPosition + player > board

class Move(APIView):
	permission_classes = [AllowAny]
	def post(self, request):   
		player1 = request.data.get("Player1")
		key = request.data.get('key')
		player2 = request.data.get("Player2")
		key = request.data.get("key")
		speed1 = request.data.get("speed1")
		speed2 = request.data.get("speed2")
		# player 1
		if key == "KeyW":
			speed1 = -3
		elif key == "KeyS":
			speed1 = 3
		# player 2
		elif key == "ArrowUp":
			speed2 = -3
		elif key == "ArrowDown":
			speed2 = 3
		if not outOfBounds(player1 + speed1, 10, 500):
			try:
				player1 += speed1
			except:
				pass
		if not outOfBounds(player2 + speed2, 10, 500):
			try:
				player2 += speed2
			except:
				pass
		position_updated = {
			'Player1': player1,
			'Player2': player2,
			'Speed1': speed1,
			'Speed2': speed2,
		}

		return JsonResponse(position_updated)
