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
