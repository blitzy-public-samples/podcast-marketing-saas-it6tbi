#!/usr/bin/env python
"""
Django Management Utility

This file serves as the command-line utility for administrative tasks in the Django backend application.

Requirements Addressed:
- Backend Management Utility (7.3.1 Architecture Patterns):
  Provides a command-line interface for managing the Django backend application,
  including server operations, migrations, and custom commands.

Human Tasks:
1. Ensure DJANGO_SETTINGS_MODULE environment variable is properly set in deployment
2. Verify Python environment and Django installation
3. Review database connection settings before running migrations
4. Configure logging settings before starting development server
"""

# Standard library imports
import os  # standard-library
import sys  # standard-library

# Django imports
from django.core.management import execute_from_command_line  # django==4.2

# Internal imports - using relative imports based on the project structure
from core import load_settings

def main():
    """
    The main entry point for the Django management utility.
    
    This function:
    1. Sets the default Django settings module
    2. Loads environment-specific settings
    3. Executes Django management commands
    
    The function does not return any value but may raise exceptions if command execution fails.
    """
    try:
        # Set the default Django settings module
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.base')
        
        # Load environment-specific settings
        load_settings()
        
        # Execute management commands
        execute_from_command_line(sys.argv)
        
    except Exception as e:
        # Print error message and exit with non-zero status
        print(f"Error executing management command: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    # Execute the main function when the script is run directly
    main()