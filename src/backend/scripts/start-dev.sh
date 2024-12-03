#!/bin/bash

# This script starts the Django development server with appropriate settings
# for local development.
#
# Requirements Addressed:
# - Development Environment Setup (7.3.1 Architecture Patterns):
#   Provides a script to streamline the process of starting the development server,
#   ensuring consistency and ease of use for developers.

# Human Tasks:
# 1. Ensure Python virtual environment is activated before running this script
# 2. Verify that required environment variables are set in local environment
# 3. Check that database migrations are up to date
# 4. Confirm Redis server is running if using Celery in development

# Set the Django settings module to use development settings
export DJANGO_SETTINGS_MODULE="core.settings.development"

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Navigate to the backend root directory (two levels up from scripts)
cd "${SCRIPT_DIR}/../"

# Start the Django development server
# The manage.py script will use the development settings module we exported above
python manage.py runserver 0.0.0.0:8000