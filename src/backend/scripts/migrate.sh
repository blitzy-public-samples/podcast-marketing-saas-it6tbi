#!/bin/bash

# Database Migration Automation Script
# Requirements Addressed:
# - Database Migration Automation (7.3 Technical Decisions/7.3.1 Architecture Patterns):
#   Provides a streamlined process for applying database migrations, ensuring consistency 
#   and reducing manual errors.

# Human Tasks:
# 1. Ensure database credentials are properly configured in .env file
# 2. Verify database user has sufficient privileges for migrations
# 3. Review migration files before applying to production
# 4. Backup database before running migrations in production
# 5. Configure logging directory permissions

# Set error handling
set -e  # Exit on error
set -u  # Exit on undefined variables

# Set up logging
LOG_DIR="logs"
LOG_FILE="$LOG_DIR/migrations.log"
mkdir -p "$LOG_DIR"

# Logging function
log() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] $1" | tee -a "$LOG_FILE"
}

# Function to load environment variables
load_env() {
    if [ -f .env ]; then
        log "Loading environment variables from .env file"
        set -a
        source .env
        set +a
    else
        log "Warning: .env file not found. Using existing environment variables."
    fi
}

# Function to run Django management commands
run_django_command() {
    local command=$1
    log "Running Django command: $command"
    python manage.py $command
}

# Main migration process
main() {
    log "Starting database migration process"

    # Set Django settings module for production
    export DJANGO_SETTINGS_MODULE="core.settings.production"
    log "Set DJANGO_SETTINGS_MODULE to $DJANGO_SETTINGS_MODULE"

    # Load environment variables
    load_env

    # Make migrations
    log "Generating database migrations"
    if ! run_django_command makemigrations; then
        log "Error: Failed to generate migrations"
        exit 1
    fi

    # Apply migrations
    log "Applying database migrations"
    if ! run_django_command migrate; then
        log "Error: Failed to apply migrations"
        exit 1
    fi

    log "Database migration completed successfully"
}

# Execute main function
if ! main; then
    log "Migration process failed"
    exit 1
fi

exit 0