FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install build dependencies + curl (required for healthcheck)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    gcc \
    curl \
 && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir --upgrade pip setuptools wheel \
 && pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . /app

ENV PYTHONUNBUFFERED=1
ENV PORT=8000
EXPOSE 8000

# Healthcheck: use curl so it works regardless of which port Coolify assigns via $PORT
HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -fs http://127.0.0.1:${PORT:-8000}/health/ || exit 1

# Run collectstatic and migrations before starting gunicorn
CMD ["sh", "-c", "python manage.py collectstatic --noinput && python manage.py migrate --noinput && gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 3"]
