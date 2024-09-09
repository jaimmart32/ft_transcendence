from django.conf import settings
from .models import CustomUser
import os
import jwt 
import datetime
from django.http import HttpResponse, JsonResponse

# These functions are in charge to do all the JWT process such as creating, decoding and 
# getting the user from the JWT token.

def create_jwt_token(user):


	payload = {
			'id': user.id,
			'exp': datetime.datetime.utcnow() + settings.JWT_EXPIRATION_DELTA,
			'iat': datetime.datetime.utcnow()}


	token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
	return token

def create_jwt_refresh_token(user):


	payload = {
			'id': user.id,
			'exp': datetime.datetime.utcnow() + settings.JWT_REFRESH_EXPIRATION_DELTA,
			'iat': datetime.datetime.utcnow()}


	token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
	return token

def decode_jwt_token(token, refreshType=None):

	payload = None
	try:
		payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM], options={"verify_exp": False})
		if check_expiry(token) is True and refreshType is not None:
			user_id = payload.get('id')
			if user_id:
				try:
					user = CustomUser.objects.get(id=user_id)
					user.is_online = False
					user.save()
				except CustomUser.DoesNotExist:
					print('decode_jwt_token: user does not exist', flush=True)
					return None	
		return payload
	except jwt.InvalidTokenError:
		print('deocde_jwt_token: invalid token error', flush=True)
		return None

def check_expiry(token):
	try:
		payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
		return False 
	except jwt.ExpiredSignatureError:
		return True 
	except jwt.InvalidTokenError:
		return True 

def get_user_from_jwt(token, refreshType=None):
	payload = decode_jwt_token(token, refreshType)
	if payload:
		try:
			user = CustomUser.objects.get(id=payload['id'])
			return user
		except CustomUser.DoesNotExist:
			print('get_user_from_jwt: user doesnt exist', flush=True)
			return None
	print('get_user_from_jwt: No payload retrieved', flush=True)
	return None
