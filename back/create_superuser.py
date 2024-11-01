# Importa el módulo os para interactuar con las variables de entorno del sistema operativo
import os
# Importa el módulo django para configurar y usar Django en el script
import django
# Importa la función get_user_model para obtener el modelo de usuario personalizado
from django.contrib.auth import get_user_model

# Establece la variable de entorno DJANGO_SETTINGS_MODULE para que apunte al archivo de configuración de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pong_project.settings')
# Configura Django para que esté listo para usarse con la configuración especificada
django.setup()
# Obtiene el modelo de usuario personalizado configurado en Django (CustomUser en este caso)
User = get_user_model()

# Obtiene las credenciales del superusuario de las variables de entorno, con valores predeterminados si no están establecidas
username = os.getenv('DJANGO_SUPERUSER_USERNAME', 'admin')
email = os.getenv('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
password = os.getenv('DJANGO_SUPERUSER_PASSWORD', 'adminpass')

# Comprueba si ya existe un usuario con el nombre de usuario especificado, si no, lo crea
#
if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f'Superuser {username} created')
else:
    print(f'Superuser {username} already exists')

# Crea usuarios para disminuir el numero de acciones a la hora de testear
from django.conf import settings

contraseña = 'Password1' + settings.PEPPER
user1 = User.objects.create_user(username='josito', email='josito@gmail.com', is_active=True)
user2 = User.objects.create_user(username='pepita', email='pepita@gmail.com', is_active=True)
user3 = User.objects.create_user(username='bri', email='bri@gmail.com', is_active=True)
user4 = User.objects.create_user(username='javi', email='javi@gmail.com', is_active=True)
user1.set_password(contraseña)
user2.set_password(contraseña)
user3.set_password(contraseña)
user4.set_password(contraseña)
user1.save()
user2.save()
user3.save()
user4.save()