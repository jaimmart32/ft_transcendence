from django.shortcuts import render
import json# Maybe not needed
from django.http import JsonResponse# Maybe not needed
from rest_framework.views import APIView
from rest_framework.response import Response 
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from . import models
from django.contrib.auth.models import User 

# Create your views here.

def main_view(request):
	if request.method == 'GET':
		return render(request, 'pong_app/index.html')
		
class signup(APIView):
	permission_classes = [AllowAny]
	def post (self, request):
		data = request.data
		username = data.get('username')
		email = data.get('email')
		password = data.get('password')
		if User.objects.filter(username=username).exists():
			return Response({'status': 'error', 'message': 'Username already in use'})
		if User.objects.filter(email=email).exists():
			return Response({'status': 'error', 'message': 'Email already in use'})
		user = User.objects.create_user(username, email=email, password=password)
		return Response({'status': 'success', 'message': 'User created succesfully!'})

class login(APIView):
	permission_classes = [AllowAny]
	def post (self, request):
		data = request.data
		username = data.get('username')
		password = data.get('password')
		user = authenticate(request, username=username, password=password)
		if user is not None:
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
