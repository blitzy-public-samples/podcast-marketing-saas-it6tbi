# Contributing to Podcast Marketing Automation

Thank you for your interest in contributing to the Podcast Marketing Automation SaaS platform! This guide will help you get started with contributing to the project.

## Table of Contents
- [Introduction](#introduction)
- [Setting Up the Development Environment](#setting-up-the-development-environment)
- [Coding Standards](#coding-standards)
- [Submitting Issues](#submitting-issues)
- [Submitting Pull Requests](#submitting-pull-requests)
- [Testing](#testing)
- [CI/CD Pipeline](#cicd-pipeline)

## Introduction

We welcome contributions from the community to help improve and enhance the Podcast Marketing Automation platform. Whether you're fixing bugs, adding new features, or improving documentation, your help is appreciated.

## Setting Up the Development Environment

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd podcast-marketing-automation
   ```

2. **Backend Setup**
   ```bash
   cd src/backend
   # Create and activate virtual environment
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # venv\Scripts\activate  # Windows
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Set up environment variables
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Frontend Setup**
   ```bash
   cd src/web
   # Install dependencies
   npm install
   
   # Set up environment variables
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start Development Servers**
   ```bash
   # Backend
   cd src/backend
   ./scripts/start-dev.sh
   
   # Frontend
   cd src/web
   npm run dev
   ```

## Coding Standards

We follow strict coding standards to maintain code quality and consistency:

### Python (Backend)
- Follow PEP 8 style guide
- Use type hints for function parameters and return values
- Write docstrings for all modules, classes, and functions
- Maintain test coverage above 80%

### TypeScript/React (Frontend)
- Follow ESLint and Prettier configurations
- Use TypeScript for type safety
- Follow React best practices and hooks guidelines
- Write unit tests for components and utilities

### General Guidelines
- Write clear, descriptive commit messages
- Keep functions and methods focused and concise
- Document complex logic and business rules
- Add comments for requirements being addressed

## Submitting Issues

When submitting issues, please use the following templates:

### Bug Report Template
```markdown
**Description**
A clear description of the bug

**Steps to Reproduce**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS:
- Browser:
- Version:

**Additional Context**
Any other relevant information
```

## Submitting Pull Requests

1. Create a new branch from `development`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our coding standards

3. Write or update tests as needed

4. Run the test suite:
   ```bash
   # Backend
   cd src/backend
   ./scripts/run-tests.sh
   
   # Frontend
   cd src/web
   npm run test
   ```

5. Submit a pull request with the following information:
   - Clear description of changes
   - Link to related issue(s)
   - Screenshots for UI changes
   - List of requirements addressed
   - Testing steps and results

### Pull Request Checklist
- [ ] Code follows project style guidelines
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] No new linting errors
- [ ] Verified in development environment
- [ ] Requirements properly addressed
- [ ] No merge conflicts

## Testing

We maintain comprehensive test coverage for both backend and frontend:

### Backend Testing
- Use pytest for unit and integration tests
- Maintain test coverage above 80%
- Run tests using `./scripts/run-tests.sh`

### Frontend Testing
- Use Jest and React Testing Library
- Write unit tests for components and utilities
- Test responsive design and accessibility
- Run tests using `npm run test`

## CI/CD Pipeline

Our CI/CD pipeline automatically runs on all pull requests:

### Backend Pipeline
- Linting with flake8
- Type checking with mypy
- Unit tests with pytest
- Coverage reporting

### Frontend Pipeline
- ESLint checks
- TypeScript compilation
- Unit tests with Jest
- Build verification

All checks must pass before a pull request can be merged.