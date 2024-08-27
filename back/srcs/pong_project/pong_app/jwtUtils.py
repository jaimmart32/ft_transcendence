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

def decode_jwt_token(token):
	try:
		payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
		return payload
	except jwt.ExpiredSignatureError:
		payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM], options={"verify_exp": False})
		user_id = payload.get('id')
		if user_id:
			try:
				user = CustomUser.objects.get(id=user_id)
				user.is_online = False
				user.save()
			except CustomUser.DoesNotExist:
				pass
		return None
	except jwt.InvalidTokenError:
		return None

def get_user_from_jwt(token):
	payload = decode_jwt_token(token)
	if payload:
		try:
			user = CustomUser.objects.get(id=payload['id'])
			return user
		except CustomUser.DoesNotExist:
			return None
	
	return None
