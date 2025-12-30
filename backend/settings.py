
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
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# ...existing code...