import json# Maybe not needed
import smtplib, ssl
from django.shortcuts import render, redirect
from django.db import IntegrityError
from django.core.exceptions import ValidationError
import requests
import os

from http import HTTPStatus
from django.http import HttpResponse, JsonResponse

from django.contrib.auth import authenticate, login, logout

from .models import CustomUser
from django.conf import settings
from django.contrib.auth.models import User 
from .validators import validateUsername, validateEmail, validatePassword, generate_random_digits
from email.mime.text import MIMEText
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from datetime import timedelta
from django.utils import timezone
from .jwtUtils import create_jwt_token, get_user_from_jwt
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

@csrf_exempt
def main_view(request):

	if not request.user.is_authenticated:
		if request.method == 'GET':
			return render(request, 'pong_app/index.html')
	return render(request, "pong_app/index.html")

# This is a protection that will be used for almost all views after logging into the application
# It will be used as decorator on top of the views
@csrf_exempt
def jwt_required(viewFunction):

	def wrapper(request, *args, **kwargs):
		auth_header = request.headers.get('Authorization')
		if auth_header and auth_header.startswith('Bearer '):
			token = auth_header.split(' ')[1]
			user = get_user_from_jwt(token)
			if user:
				request.user = user
				return viewFunction(request, *args, **kwargs)
			return JsonResponse({'status': 'error', 'message': 'Unauthorized'}, status=401)
	return wrapper

# This view is in charge of checking the token received, if the token is valid and the user exists,
# it will generate a new token for the user.
@csrf_exempt
def refreshView(request):

	if request.method == 'POST':
		token = request.POST.get('token')
		user = get_user_from_jwt(token)
		if user:
			new_token = create_jwt_token(user)
			return JsonResponse({'status': 'success', 'token': new_token}, status=200)
		else:
			return JsonResponse({'status': 'error', 'message': 'Invalid or expired token'}, status=401)
	return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)

@csrf_exempt
def signupView(request):

	if request.method == 'POST':
		data = json.loads(request.body)
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
			return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
		if not password == confPass:
			return JsonResponse({'status': 'error', 'message': 'Invalid password confirmation'}, status=400)
		if CustomUser.objects.filter(username=username).exists():
			return JsonResponse({'status': 'error', 'message': 'Username already in use'}, status=400)
		if CustomUser.objects.filter(email=email).exists():
			return JsonResponse({'status': 'error', 'message': 'Email already in use'}, status=400)
		# Create the user after passing all the requirements	
		user = CustomUser.objects.create_user(username, email=email)
		user.is_active = False 
		user.set_password(password + settings.PEPPER)
		user.save()

		# Generating link for confirmation email
		token_generator = PasswordResetTokenGenerator()
		domain = settings.HOST
		uid = urlsafe_base64_encode(force_bytes(user.id))
		token = token_generator.make_token(user)
		activation_link = f'http://{domain}:8000/activate/{uid}/{token}/'
		message = MIMEText(f'Please click the following link to activate your account\n {activation_link}')
		message['Subject'] = 'Account confirmation'
		message['From'] = settings.EMAIL_HOST_USER 
		message['To'] = email 

		# Starting the server smtp connection and sending the email
		smtp_connection = smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT)
		smtp_connection.starttls()
		smtp_connection.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
		smtp_connection.send_message(message)
		smtp_connection.quit()

		return JsonResponse({'status': 'success', 'message': 'User created succesfully!'}, status=200)


@csrf_exempt
def ActivateAccountView(request, uidb64, token):

	if request.method == 'GET':
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
			return redirect(f'http://{settings.HOST}:8000')
		else:
					# Render a template with an error message if the token is invalid
			return redirect(f'http://{settings.HOST}:8000')
	return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)


@csrf_exempt
def loginView(request):

	if request.method == 'POST':
		data = json.loads(request.body)
		username = data.get('username')
		password = data.get('password')

		try:
			user = CustomUser.objects.get(username=username)
		except CustomUser.DoesNotExist:
			return JsonResponse({'error': 'Invalid username'}, status=401)

		# Check the attribute is_active, if it's false, means the user has not verified
		# their email
		if user.is_active is False:
			return JsonResponse({'error': 'Email not verified'}, status=401)

		# The password is correct
		if user.check_password(password + settings.PEPPER):
			# If the user has 2FA active, we send the needed code
			if user.tfa is True:
				user.otp = generate_random_digits()
				user.otp_expDate = timezone.now() + timedelta(hours=1)
				user.save()
				email = user.email
				userOtp = user.otp

				message = MIMEText(f'Your verification code is: {userOtp}')
				message['Subject'] = 'Verification code'
				message['From'] = settings.EMAIL_HOST_USER 
				message['To'] = email

				smtp_connection = smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT)
				smtp_connection.starttls()
				smtp_connection.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
				smtp_connection.send_message(message)
				smtp_connection.quit()

				return JsonResponse({'status': 'success', 'message': 'Verification code sent'}, status=200)
			token = create_jwt_token(user)
			return JsonResponse({
					'status': 'success',
					'message': 'Logged in successfully!',
					'access': token}, status=200)
		else:
			return JsonResponse({'status': 'error', 'message': 'Invalid credentials'}, status=401)
	return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)


@csrf_exempt
def verify2FA(request):
	if request.method == 'POST':
		username = request.POST.get('username')
		otp = request.POST.get('otp')
		user = CustomUser.objects.get(username=username)

		if user is not None:
			if (user.otp == otp and user.otp_expDate is not None and user.otp_expDate > timezone.now()):
				token = create_jwt_token(user)
				return JsonResponse({
						'status': 'success',
						'message': 'Logged in successfully!',
						'access': token},
						status=200
					)
			else:
				return JsonResponse({'status': 'error', 'message': 'Expired code'}, status=400)
		else:
			return JsonResponse({'status': 'error', 'message': 'Invalid code'}, status=400)
	return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)


@jwt_required
def Home(request):
	if request.method == 'GET':
		content = {'message': 'Welcome to the home page!', 'username': request.user.username}
		return JsonResponse(content, status=200)
	return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)


@jwt_required
def Profile(request):
	if request.method == 'GET':
		user = request.user
		content = {'username': user.username, 'email': user.email, 'tfa': user.tfa, 'avatar': user.avatar.url if user.avatar else None,}
#'game_stats': request.user.game_stats,
#'tournament_stats': request.user.tournament_stats
		return JsonResponse(content, status=200)
	return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)

# View needed to edit the User's information. Auto-fills the current user's info, when new data
# is entered, checks if it is valid (passes check for characters and if it's repeated or not).


@csrf_exempt
@jwt_required
def	EditProfile(request):
	if request.method == 'PUT':
		user = request.user

		try:
		# Do we need to check if the info entered is correct like in the front end?
			user.username = request.POST.get('username', user.username)
			if CustomUser.objects.filter(username=user.username).exclude(id=user.id).exists():
				return JsonResponse({'status': 'error', 'message': 'Username in use'}, status=400)
			if request.POST.get('twofa', user.tfa) == 'on':
				user.tfa = True
			else:
				user.tfa = False 
			if request.POST.get('password'):
				user.set_password(request.POST.get('password'))
			if 'avatar' in request.FILES:
				avatar = request.FILES.get('avatar')
				if avatar.size == 0:
					raise ValidationError("The uploaded file is empty!")
				else:
					user.avatar = avatar
			user.save()
			return JsonResponse({'status': 'success', 'message': 'Profile updated successfully!'}, status=200)
		except IntegrityError as e:
			return JsonResponse({'status': 'error', 'message': 'Username in use'}, status=400)
		except ValidationError as e:
			return JsonResponse({'status': 'error', 'message': 'File is empty'}, status=400)
		return JsonResponse({'status': 'error', 'message': 'An error ocurred'}, status=400)
	return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)


@csrf_exempt
def  authSettings(request):

	if request.method == 'GET':
		data = {
			'status': 'success',
			'client_id': settings.CLIENT_ID,
			'redirect_uri': settings.REDIRECT_URI,
			'auth_endpoint': settings.AUTH_ENDPOINT,
			'scope': settings.SCOPE,
		}
		return JsonResponse(data, status=200)
	return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)


@csrf_exempt
def authVerify(request):
	
	if request.method == 'POST':
		code = request.POST.get('code')
		if not code:
			return JsonResponse({'status': 'error', 'message': 'No code provided'}, status=400)
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
			return JsonResponse({'status': 'error', 'message': 'No access token was found'}, status=400)
		userResponse = requests.get(settings.USER_INFO_URL, headers=
		{
			'Authorization': f'Bearer {accessToken}'
		})
		if userResponse.status_code != 200:
			return JsonResponse({'status': 'error', 'message': 'Could not retrieve the user data'}, status=400)
		userInfo = userResponse.json()
		return JsonResponse({'status': 'success', 'userInfo': userInfo}, status=200)
	return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)


@csrf_exempt
def authCreateUser(request):
	
	if request.method == 'POST':
		userInfo = request.POST.get('userInfo')
		if not userInfo:
			return JsonResponse({'status': 'error', 'message': 'No user information'}, status=401)
		username = "ft_" + userInfo['login']
		email = userInfo['email']
		password = ""
		if CustomUser.objects.filter(username=username).exists():
			return JsonResponse({'status': 'error', 'message': 'Username already in use'}, status=400)
		if CustomUser.objects.filter(email=email).exists():
			return JsonResponse({'status': 'error', 'message': 'Email already in use'}, status=400)
		user = CustomUser.objects.create_user(username, email=email, password=password)
		# Could use the CustomUser.objects.get_or_create() and later check if the user exists 
		token = create_jwt_token(user)

		redirect_url = f"http://{settings.HOST}:8000?access={token}"
		return JsonResponse({'status': 'success', 'redirect_url': redirect_url}, status=200)
	return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)


# FRIENDS

@jwt_required
def FriendsList(request):

	if request.method == 'GET':
		user = request.user
		friends = user.friends.all()
		friends_data = [{'username': friend.username, 'online': friend.is_active} for friend in friends]
		return JsonResponse(friends_data, status=200)
	return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)


@jwt_required
def AddFriend(request):

	if request.method == 'POST':
		user = request.user
		friend_username = request.POST.get('friend_username')
		try:
			friend = CustomUser.objects.get(username=friend_username)
			user.friends.add(friend)
			return JsonResponse({'status': 'success', 'message': f'{friend_username} added as a friend'}, status=200)
		except CustomUser.DoesNotExist:
			return JsonResponse({'status': 'error', 'message': 'User not found'}, status=404)
	return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)


@jwt_required
def RemoveFriend(request):

	if request.method == 'POST':
		user = request.user
		friend_username = request.POST.get('friend_username')
		try:
			friend = CustomUser.objects.get(username=friend_username)
			user.friends.remove(friend)
			return JsonResponse({'status': 'success', 'message': f'{friend_username} removed from friends'}, status=200)
		except CustomUser.DoesNotExist:
			return JsonResponse({'status': 'error', 'message': 'User not found'}, status=404)
	return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)



def outOfBounds(yPosition, player, board):
		return yPosition < 0 or yPosition + player > board

def Move(request):
	if request.method == 'POST':
		player1 = request.POST.get('Player1')
		key = request.POST.get('key')
		player2 = request.POST.get('Player2')
		key = request.POST.get('key')
		speed1 = request.POST.get('speed1')
		speed2 = request.POST.get('speed2')
		# player 1
		if key == 'KeyW':
			speed1 = -3
		elif key == 'KeyS':
			speed1 = 3
		# player 2
		elif key == 'ArrowUp':
			speed2 = -3
		elif key == 'ArrowDown':
			speed2 = 3
		try:
			speed1 = int(speed1)
			if not outOfBounds(player1 + speed1, 10, 500):
				player1 += int(speed1)
		except:
				pass
		try:
			speed2 = int(speed2)
			if not outOfBounds(player2 + speed2, 10, 500):
				player2 += int(speed2)
		except:
			pass
		position_updated = {
			'Player1': player1,
			'Player2': player2,
			'Speed1': speed1,
			'Speed2': speed2,
		}

		return JsonResponse(position_updated)
