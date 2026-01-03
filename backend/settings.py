import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

DEBUG = False
ALLOWED_HOSTS = ["*"]


INSTALLED_APPS = [
    # ...existing code...
    'rest_framework',
    'rest_framework.authtoken',
    # ...existing code...
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
}

ROOT_URLCONF = "backend.urls"



STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# ...existing code...
