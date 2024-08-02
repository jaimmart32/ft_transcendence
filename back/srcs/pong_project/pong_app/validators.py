import re
import os
import hashlib 
from django.core.exceptions import ValidationError
from django.conf import settings

def validateUsername(username):
	pattern = re.compile(r'^(?!ft_)[a-zA-Z0-9._%+-]{1,8}$')

	if not pattern.match(username):
		raise ValidationError('Invalid username: must not start with "ft_", must be 1-8 characters long, and contain only alphanumeric characters and ._%+-')

def validateEmail(email):
	pattern = re.compile(r'^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$')

	if not pattern.match(email):
		raise ValidationError('Invalid email format')


def validatePassword(password):
	pattern = re.compile(r'(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,128}')

	if not pattern.match(password):
		raise ValidationError('Password must be at least 8 characters long, contain at least one digit, one lowercase letter, and one uppercase letter')


def hashPassword(password):
	# Generates a random 16-bit string
	salt = os.urandom(16)
	modified_pass = password + settings.PEPPER
	
	hashed = hashlib.pbkdf2_hmac('sha256', modified_pass.encode(), salt, 100000)

	return salt + hashed


def validateHash(stored_pass, provided_pass):

	# Get the first 16 bytes, which will be the salt previously stored
	salt = stored_pass[:16]
	# Get the hash, it will be the remaining bytes starting after the 16th
	stored_hash = stored_pass[16:]
	modified_pass = provided_pass + settings.PEPPER

	# We will generate a new hash with the provided_pass, using our pepper,
	# salt, and the number of iterations
	new_hash = hashlib.pbkdf2_hmac('sha256', modified_pass.encode(), stored_pass[:16], 100000)

	# If the new hash is equal to our previously stored hash, the password is
	# correct, if not, the password is not correct.
	return new_hash == stored_hash
