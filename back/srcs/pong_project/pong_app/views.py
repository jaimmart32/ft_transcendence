from django.shortcuts import render

# Create your views here.

def main_view(request):
	if request.method == 'GET'
		return render(request, '../templates/pong_app/index.html')
		
def signup_view(request):
	if request.method == 'POST'
		data = json.loads(request.body)
		email = data.get('email')
		password = data.get('password')
	
		if User.objects.filter(email=email).exists():
			return JsonResponse({'status': 'error', 'message': 'Email already in use'})
		user = User.objects.create_user(email=email, password=password)
		return JsonResponse({'status': 'success', 'message': 'User created succesfully!'})

	return JsonResponse({'status': 'error', 'message': 'Invalid request'})

def login_view(request):
	if request.method == 'POST'
		data = json.loads(request.body)
		username = data.get('username')
		password = data.get('password')
	
		if User.objects.filter(username=username).exists():
			user = User.objects.get(username=username)
			if user.password == password
				return JsonResponse({'status': 'success', 'message': 'Logged in succesfully!'})
			return JsonResponse({'status': 'error', 'message': 'Invalid password'})

		return JsonResponse({'status': 'error', 'message': 'User does not exist'})

	return JsonResponse({'status': 'error', 'message': 'Invalid request'})
