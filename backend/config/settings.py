import environ
from pathlib import Path
import os

# Initialize environment variables with safe defaults
env = environ.Env(
    DEBUG=(bool, False)
)

BASE_DIR = Path(__file__).resolve().parent.parent

environ.Env.read_env(env_file=os.path.join(BASE_DIR, '.env'))

# Secret and Debug settings
SECRET_KEY = env('SECRET_KEY', default='django-insecure-key-safe-fallback-for-itc-website')
DEBUG = env('DEBUG', default=False)

ALLOWED_HOSTS_ALL = True
ALLOWED_HOSTS = ['*']

CSRF_TRUSTED_ORIGINS_ALL = True
CSRF_TRUSTED_ORIGINS = [
    'https://www.tech-iitb.org',
    'https://tech-iitb.org',
    'https://two.tech-iitb.org',
    'https://backend.tech-iitb.org',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]

# Installed apps
INSTALLED_APPS = [
    'grappelli',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'compressor',
    'config',
    'gunicorn',
    'django.contrib.sitemaps',
    'minio_storage',
    'rest_framework',
    'corsheaders',
]

# Middleware settings
MIDDLEWARE = [
    'config.middleware.TracebackMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# URL configuration
ROOT_URLCONF = 'config.urls'

# Template settings
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# WSGI application
WSGI_APPLICATION = 'config.wsgi.application'

# Database settings — Postgres with SQLite fallback if env vars missing
DATABASE_URL = env('DATABASE_URL', default='')
if DATABASE_URL:
    DATABASES = {
        'default': env.db('DATABASE_URL')
    }
    # Log connection info (safely masked)
    db_conn = DATABASES['default']
    print(f"[Database Config] Using DATABASE_URL. Connecting to host: {db_conn.get('HOST', 'localhost')}, port: {db_conn.get('PORT', '5432')}, db: {db_conn.get('NAME')}")
else:
    db_name = env('DB_NAME', default=env('POSTGRES_DB', default=env('DATABASE_NAME', default='')))
    if db_name:
        db_user = env('DB_USER', default=env('POSTGRES_USER', default=env('DATABASE_USER', default='postgres')))
        db_password = env('DB_PASSWORD', default=env('POSTGRES_PASSWORD', default=env('DATABASE_PASSWORD', default='')))
        db_host = env('DB_HOST', default=env('POSTGRES_HOST', default=env('DATABASE_HOST', default='localhost')))
        db_port = env('DB_PORT', default=env('POSTGRES_PORT', default=env('DATABASE_PORT', default='5432')))
        
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': db_name,
                'USER': db_user,
                'PASSWORD': db_password,
                'HOST': db_host,
                'PORT': db_port,
            }
        }
        print(f"[Database Config] Connecting to PostgreSQL at host: {db_host}, port: {db_port}, db: {db_name}, user: {db_user}")
    else:
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': BASE_DIR / 'db.sqlite3',
            }
        }
        print(f"[Database Config] No database credentials found. Falling back to local SQLite at {DATABASES['default']['NAME']}")

# Static files configuration (Local)
STATIC_URL = '/static/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

# Media files configuration (MinIO or local fallback)
MINIO_MEDIA_URL = env('MINIO_STORAGE_MEDIA_URL', default='')
if MINIO_MEDIA_URL:
    MEDIA_URL = MINIO_MEDIA_URL.rstrip('/') + '/'
    DEFAULT_FILE_STORAGE = "minio_storage.storage.MinioMediaStorage"
    MINIO_STORAGE_ENDPOINT = env('MINIO_STORAGE_ENDPOINT', default='localhost')
    MINIO_STORAGE_PORT = env.int('MINIO_STORAGE_PORT', default=443)
    MINIO_STORAGE_ACCESS_KEY = env('MINIO_STORAGE_ACCESS_KEY', default='')
    MINIO_STORAGE_SECRET_KEY = env('MINIO_STORAGE_SECRET_KEY', default='')
    MINIO_STORAGE_USE_HTTPS = env.bool('MINIO_STORAGE_USE_HTTPS', default=True)
    MINIO_STORAGE_MEDIA_BUCKET_NAME = env('MINIO_STORAGE_MEDIA_BUCKET_NAME', default='media')
    MINIO_STORAGE_AUTO_CREATE_MEDIA_BUCKET = True
    MINIO_STORAGE_AUTO_CREATE_MEDIA_POLICY = "READ_WRITE"
    MINIO_STORAGE_MEDIA_OBJECT_METADATA = {
        "Cache-Control": "max-age=86400"
    }
else:
    MEDIA_URL = '/media/'
    MEDIA_ROOT = BASE_DIR / 'media'
    DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'

# Whitenoise for static files in production
if not DEBUG:
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

COMPRESS_ENABLED = True
COMPRESS_OFFLINE = True
COMPRESS_CSS_FILTERS = ['compressor.filters.cssmin.CSSMinFilter']
COMPRESS_JS_FILTERS = ['compressor.filters.jsmin.JSMinFilter']

# CORS Configuration
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = ['*']
CORS_ALLOW_METHODS = ['*']
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'https://tech-iitb.org',
    'https://www.tech-iitb.org',
    'https://two.tech-iitb.org',
    'https://backend.tech-iitb.org',
]

# REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 100,
    'DEFAULT_FILTER_BACKENDS': [
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'EXCEPTION_HANDLER': 'config.api.custom_exception_handler',
}
