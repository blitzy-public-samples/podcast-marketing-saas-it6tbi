# Backend Services Documentation

This document provides comprehensive documentation for setting up and using the backend services of the Podcast Marketing Automation SaaS platform.

## Overview

The backend is built using Django and provides RESTful APIs for podcast management, marketing automation, and analytics. It integrates with AI services for transcription and content generation.

Key features:
- Podcast management and audio processing
- Multi-platform social media marketing automation
- AI-powered transcription using Whisper
- Content generation using GPT
- Analytics and performance tracking
- Secure authentication and authorization

## Prerequisites

- Python 3.11+
- PostgreSQL 15+
- Redis 6.2.6+
- Docker and Docker Compose
- AWS Account (for S3 storage)

## Human Tasks Before Deployment

1. Configure AWS credentials and region in environment variables
2. Set up Facebook, Twitter, LinkedIn, and Instagram API credentials
3. Create and configure OpenAI API key for AI services
4. Review and adjust rate limiting settings in production
5. Configure logging directory permissions
6. Set up monitoring for API endpoints and task queues
7. Verify SSL certificate configuration for production
8. Review database backup and recovery procedures

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd src/backend
```

2. Copy environment variables template:
```bash
cp .env.example .env
```

3. Update the following environment variables in `.env`:
```
# Django Configuration
DJANGO_SECRET_KEY=<your-secret-key>
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration
POSTGRES_DB=<your-database-name>
POSTGRES_USER=<your-database-user>
POSTGRES_PASSWORD=<your-database-password>
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# AWS Configuration
AWS_ACCESS_KEY_ID=<your-aws-access-key>
AWS_SECRET_ACCESS_KEY=<your-aws-secret-key>
AWS_S3_BUCKET_NAME=<your-s3-bucket-name>
AWS_CLOUDFRONT_DISTRIBUTION=<your-cloudfront-distribution-id>

# AI Services
OPENAI_API_KEY=<your-openai-api-key>

# Social Media Integration
FACEBOOK_ACCESS_TOKEN=<your-facebook-access-token>
TWITTER_API_KEY=<your-twitter-api-key>
TWITTER_API_SECRET=<your-twitter-api-secret>
LINKEDIN_CLIENT_ID=<your-linkedin-client-id>
LINKEDIN_CLIENT_SECRET=<your-linkedin-client-secret>
INSTAGRAM_CLIENT_ID=<your-instagram-client-id>
INSTAGRAM_CLIENT_SECRET=<your-instagram-client-secret>
```

4. Build and start the services:
```bash
docker-compose up --build
```

5. Apply database migrations:
```bash
./scripts/migrate.sh
```

6. Access the development server at `http://localhost:8000`

## Development

For local development:

1. Create and activate a Python virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate  # Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set environment variable:
```bash
export DJANGO_SETTINGS_MODULE=core.settings.development
```

4. Start the development server:
```bash
./scripts/start-dev.sh
```

## Production Deployment

For production deployment:

1. Ensure all environment variables are properly configured
2. Set `DJANGO_SETTINGS_MODULE=core.settings.production`
3. Start the production services:
```bash
./scripts/start-prod.sh
```

## API Documentation

The API documentation is available at `/api/docs` when the server is running. Key endpoints include:

- `/api/podcasts/`: Podcast management endpoints
- `/api/marketing/`: Marketing automation endpoints
- `/api/analytics/`: Analytics and reporting endpoints
- `/api/ai/`: AI service endpoints

## Architecture Components

- **Django Backend**: Core application server
- **PostgreSQL**: Primary database
- **Redis**: Caching and message broker
- **Celery**: Asynchronous task processing
- **Nginx**: Reverse proxy and static file serving
- **Docker**: Container orchestration

## Monitoring and Logging

- Application logs are stored in `/var/log/gunicorn/`
- Celery worker logs are in `/var/log/celery/`
- Nginx access logs are in `/var/log/nginx/`

## Security Notes

- All sensitive credentials should be stored as environment variables
- HTTPS is enforced in production
- API endpoints are rate-limited
- JWT is used for authentication
- CORS is configured for frontend integration

## Support

For technical support or bug reports, please contact the development team or create an issue in the repository.