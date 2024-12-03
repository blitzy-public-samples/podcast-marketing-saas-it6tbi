# Podcast Marketing Automation Frontend

This document provides an overview of the frontend application, including setup instructions, development guidelines, and deployment steps for the React-based SPA.

## Introduction

The frontend application is built using Next.js 13.4.0 with TypeScript, providing a modern and scalable Single Page Application (SPA) for the Podcast Marketing Automation platform. The application leverages TailwindCSS for styling, with a focus on responsive design and accessibility.

## Setup Instructions

### Prerequisites
- Node.js 18.x or higher
- npm 8.x or higher
- Docker and Docker Compose (for containerized development)

### Environment Configuration
1. Copy the environment template file:
```bash
cp .env.example .env
```

2. Configure the following environment variables:
```
REACT_APP_API_BASE_URL=https://api.example.com
REACT_APP_AUTH_CLIENT_ID=your-client-id
REACT_APP_ANALYTICS_KEY=your-analytics-key
```

### Local Development
1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production
1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Development Guidelines

### Code Structure
- `src/components/` - Reusable UI components
- `src/pages/` - Next.js page components
- `src/theme/` - Theme configuration and styling utilities
- `src/types/` - TypeScript type definitions
- `src/lib/` - Utility functions and constants
- `src/styles/` - Global styles and TailwindCSS configuration

### Styling Guidelines
- Use TailwindCSS utility classes for styling
- Follow the theme configuration in `src/theme/`
- Maintain dark mode compatibility
- Ensure responsive design across breakpoints
- Follow WCAG 2.1 AA accessibility standards

### Testing
Run the test suite:
```bash
npm test
```

### Linting
Run the linter:
```bash
npm run lint
```

## Deployment Steps

### Using Docker

1. Build the Docker image:
```bash
docker build -t podcast-marketing-frontend .
```

2. Run using Docker Compose:
```bash
docker-compose up -d
```

### Production Deployment

1. Ensure environment variables are properly configured
2. Build the production image:
```bash
docker build -t podcast-marketing-frontend:production \
  --build-arg NODE_ENV=production .
```

3. Deploy using Docker Compose:
```bash
docker-compose -f docker-compose.yml up -d
```

### Health Checks
The application includes a health check endpoint at `/health` that can be used to monitor the application status.

### Monitoring
- Application metrics are exposed for Prometheus scraping
- Health checks are configured in the Docker container
- Logging is configured for production environments

## Dependencies

### Core Dependencies
- next: ^13.4.0
- react: ^18.2.0
- react-dom: ^18.2.0
- axios: ^1.4.0
- i18next: ^22.4.9

### Development Dependencies
- typescript: ^5.0.0
- tailwindcss: ^3.3.0
- @tailwindcss/forms: ^0.5.4
- @tailwindcss/typography: ^0.5.9
- @types/react: ^18.2.17
- eslint: ^8.45.0
- jest: ^29.0.0

## Additional Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)