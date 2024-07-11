from django.shortcuts import render
import json
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response 
from rest_framework.permissions import AllowAny
from rest_framework import status 

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
		if User.objects.filter(username=username).exists():
			user = User.objects.get(username=username)
			if user.password == password:
				return Response({'status': 'success', 'message': 'Logged in succesfully!'})
			return Response({'status': 'error', 'message': 'Invalid password'})

		return Response({'status': 'error', 'message': 'User does not exist'})
