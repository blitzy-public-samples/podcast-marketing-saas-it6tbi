# Podcast Marketing Automation SaaS Platform

The Podcast Marketing Automation SaaS platform automates podcast transcription, metadata generation, and multi-channel marketing content creation. It reduces marketing workflow time by up to 80% and increases social media engagement.

## Backend Setup

Refer to `src/backend/README.md` for detailed instructions on setting up the backend services, including Docker Compose configurations and API usage.

Key features:
- Podcast management and audio processing
- Multi-platform social media marketing automation 
- AI-powered transcription using Whisper
- Content generation using GPT
- Analytics and performance tracking
- Secure authentication and authorization

### Prerequisites

- Python 3.11+
- PostgreSQL 15+
- Redis 6.2.6+
- Docker and Docker Compose
- AWS Account (for S3 storage)

### Human Tasks Before Deployment

1. Configure AWS credentials and region in environment variables
2. Set up Facebook, Twitter, LinkedIn, and Instagram API credentials
3. Create and configure OpenAI API key for AI services
4. Review and adjust rate limiting settings in production
5. Configure logging directory permissions
6. Set up monitoring for API endpoints and task queues
7. Verify SSL certificate configuration for production
8. Review database backup and recovery procedures

## Frontend Setup

Refer to `src/web/README.md` for detailed instructions on setting up the frontend application, including development and deployment steps.

Key features:
- Next.js 13.4.0 with TypeScript
- TailwindCSS for styling
- Responsive design and accessibility
- Dark mode support
- Comprehensive test coverage

### Prerequisites

- Node.js 18.x or higher
- npm 8.x or higher
- Docker and Docker Compose (for containerized development)

## Infrastructure Setup

The infrastructure is managed using Terraform. Refer to `infrastructure/terraform/main.tf` for details on provisioning cloud resources.

Key components:
- AWS infrastructure configuration
- Kubernetes cluster setup
- Database and cache services
- Monitoring and logging
- CI/CD pipelines

## Contribution Guidelines

Refer to `CONTRIBUTING.md` for guidelines on contributing to the project, including:
- Code style and standards
- Testing requirements
- Pull request process
- Development workflow

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.