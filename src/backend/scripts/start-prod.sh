#!/bin/bash

# Human Tasks:
# 1. Ensure environment variables are properly set in production environment:
#    - DJANGO_SETTINGS_MODULE
#    - SECRET_KEY
#    - ALLOWED_HOSTS
#    - DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT
#    - CELERY_BROKER_URL
#    - CELERY_RESULT_BACKEND
# 2. Verify Gunicorn and Celery are installed with correct versions
# 3. Configure appropriate number of Gunicorn workers based on server capacity
# 4. Set up proper logging directories with correct permissions
# 5. Configure process monitoring (e.g., supervisord) for production deployment

# Set strict error handling
set -euo pipefail

# Requirement Addressed: Production Environment Initialization (7.3.1 Architecture Patterns)
# Ensures proper environment setup for production deployment

# Set environment variables
export DJANGO_SETTINGS_MODULE="core.settings.production"

# Function to check if required environment variables are set
check_environment() {
    local required_vars=(
        "SECRET_KEY"
        "ALLOWED_HOSTS"
        "DB_NAME"
        "DB_USER"
        "DB_PASSWORD"
        "DB_HOST"
        "DB_PORT"
        "CELERY_BROKER_URL"
        "CELERY_RESULT_BACKEND"
    )

    for var in "${required_vars[@]}"; do
        if [[ -z "${!var:-}" ]]; then
            echo "Error: Required environment variable $var is not set"
            exit 1
        fi
    done
}

# Function to start Gunicorn server
start_gunicorn() {
    local bind_address="$1"
    echo "Starting Gunicorn server on $bind_address..."
    
    # Calculate number of workers based on CPU cores
    # Using the recommended formula: (2 x NUM_CORES) + 1
    local num_workers=$(($(nproc) * 2 + 1))
    
    # Start Gunicorn with production configurations
    # gunicorn version: 20.1.0
    gunicorn core.wsgi:application \
        --bind "$bind_address" \
        --workers $num_workers \
        --worker-class sync \
        --timeout 120 \
        --keep-alive 5 \
        --max-requests 1000 \
        --max-requests-jitter 50 \
        --log-level info \
        --access-logfile /var/log/gunicorn/access.log \
        --error-logfile /var/log/gunicorn/error.log \
        --capture-output \
        --enable-stdio-inheritance \
        --daemon
}

# Function to start Celery worker
start_celery_worker() {
    local app_name="$1"
    echo "Starting Celery worker for $app_name..."
    
    # Start Celery worker with production configurations
    celery -A "$app_name" worker \
        --loglevel=info \
        --concurrency=8 \
        --max-tasks-per-child=1000 \
        --time-limit=3600 \
        --soft-time-limit=3300 \
        --pidfile=/var/run/celery/worker.pid \
        --logfile=/var/log/celery/worker.log \
        --detach
}

# Main execution
main() {
    echo "Starting production services..."
    
    # Check environment variables
    check_environment
    
    # Create necessary directories for logs
    mkdir -p /var/log/gunicorn /var/log/celery /var/run/celery
    
    # Start Gunicorn server
    start_gunicorn "0.0.0.0:8000"
    
    # Start Celery worker
    start_celery_worker "core"
    
    echo "All production services started successfully"
}

# Execute main function
main