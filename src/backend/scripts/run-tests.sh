#!/bin/bash

# Human Tasks:
# 1. Verify that Poetry is installed and properly configured in the development environment
# 2. Ensure pytest and required plugins are installed in the virtual environment
# 3. Confirm that Django test settings module exists at core.settings.test
# 4. Review coverage thresholds in pytest.ini if adjustments are needed
# 5. Set up test database with appropriate permissions for the test user

# Set strict error handling
set -euo pipefail

# Requirement Addressed: Automated Testing (7.3.1 Architecture Patterns)
# This script automates the execution of tests, ensuring consistency and reducing manual errors.

# Function to check if Poetry is installed
check_poetry() {
    if ! command -v poetry &> /dev/null; then
        echo "Error: Poetry is not installed. Please install Poetry first."
        exit 1
    fi
}

# Function to check if virtual environment is activated
check_venv() {
    if [[ -z "${VIRTUAL_ENV:-}" ]]; then
        echo "Virtual environment is not activated. Activating using Poetry..."
        poetry shell
    fi
}

# Function to install dependencies
install_dependencies() {
    echo "Installing project dependencies..."
    if [[ -f "poetry.lock" ]]; then
        poetry install
    else
        echo "Error: poetry.lock file not found. Please run 'poetry install' first."
        exit 1
    fi
}

# Function to run tests with pytest
run_tests() {
    echo "Running tests with pytest..."
    
    # Set Django settings module for tests
    export DJANGO_SETTINGS_MODULE="core.settings.test"
    
    # Run pytest with configuration from pytest.ini
    # pytest v7.4.0
    # pytest-django v4.5.2
    # pytest-cov v4.1.0
    poetry run pytest
    
    # Store the exit code
    local test_exit_code=$?
    
    # Return the test exit code
    return $test_exit_code
}

# Main execution
main() {
    echo "Starting test execution..."
    
    # Change to the backend directory
    cd "$(dirname "$0")/.." || exit 1
    
    # Check Poetry installation
    check_poetry
    
    # Check and activate virtual environment
    check_venv
    
    # Install dependencies
    install_dependencies
    
    # Run the tests
    if run_tests; then
        echo "All tests passed successfully!"
        exit 0
    else
        echo "Tests failed. Please check the test output above."
        exit 1
    fi
}

# Execute main function
main