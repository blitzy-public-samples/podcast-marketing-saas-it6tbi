# Use the official Python 3.11-slim base image
# Requirement Addressed: Backend Containerization (7.5 Deployment Architecture/Production Environment)
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=core.settings.production

# Set working directory
WORKDIR /app

# Install system dependencies
# Requirement Addressed: Dependency Management (9.2 Frameworks & Libraries)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
# Requirement Addressed: Dependency Management (9.2 Frameworks & Libraries)
RUN pip install --no-cache-dir -r requirements.txt

# Create necessary directories
RUN mkdir -p /var/log/gunicorn /var/log/celery /var/run/celery \
    && chmod -R 755 /var/log/gunicorn /var/log/celery /var/run/celery

# Copy the backend source code
COPY . .

# Create a non-root user for security
RUN useradd -m appuser && chown -R appuser:appuser /app /var/log/gunicorn /var/log/celery /var/run/celery
USER appuser

# Expose port 8000 for the application
EXPOSE 8000

# Set the entrypoint script
COPY scripts/start-prod.sh /app/scripts/start-prod.sh
RUN chmod +x /app/scripts/start-prod.sh

# Start the application using the production script
CMD ["/bin/bash", "scripts/start-prod.sh"]