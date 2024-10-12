import base64
from django.core.files.base import ContentFile
from django.core.exceptions import ValidationError
from PIL import Image
from io import BytesIO

def handle_avatar_upload(user, avatar_data, min_width=100, min_height=100, max_width=2000, max_height=2000, max_size=1*1024*1024):
	try:
		# Check extensions
		format, imgstr = avatar_data.split(';base64,')
		ext = format.split('/')[-1].lower()
		if ext not in ['jpeg', 'jpg', 'png', 'gif']:
			raise ValidationError("Unsupported file extension.")
		# Cjeck image size
		img_data = base64.b64decode(imgstr)
		if len(img_data) == 0:
			raise ValidationError("The uploaded file is empty.")
		if len(img_data) > max_size:
			raise ValidationError("The uploaded file exceeds the maximum allowed size of 1MB.")

		# Check image dimensions
		image = Image.open(BytesIO(img_data))
		width, height = image.size
		if width < min_width or height < min_height:
			raise ValidationError(f"The image is too small (minimum size: {min_width}x{min_height}px).")
		if width > max_width or height > max_height:
			raise ValidationError(f"The image is too large (maximum size: {max_width}x{max_height}px).")

		# Save file 
		avatar_file = ContentFile(img_data, name=f'{user.id}_avatar.{ext}')
		print(avatar_file.name, flush=True)
		user.avatar = avatar_file
	except Exception as e:
		raise ValidationError(str(e))

