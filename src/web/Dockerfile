# Requirement: Frontend Containerization (9.5 Development & Deployment/9.5.1 Development Environment)
# Use Node.js 18 Alpine as the base image for a smaller footprint
FROM node:18-alpine

# Requirement: Frontend Deployment (7.5 Deployment Architecture)
# Set working directory for the application
WORKDIR /app

# Install dependencies first (leveraging Docker layer caching)
# Copy package files separately to optimize build caching
COPY package.json package-lock.json ./

# Requirement: Optimized Docker Build (9.5 Development & Deployment/9.5.1 Development Environment)
# Install production dependencies only
RUN npm ci --only=production && \
    # Create cache directory for Next.js
    mkdir -p .next/cache && \
    # Add non-root user for security
    addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    # Set permissions for Next.js cache directory
    chown -R nextjs:nodejs /app/.next

# Copy application source code
# .dockerignore should exclude node_modules, .git, etc.
COPY . .

# Set environment variables for production
ENV NODE_ENV=production \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build && \
    # Clean up development dependencies and npm cache
    npm prune --production && \
    npm cache clean --force && \
    # Set correct permissions
    chown -R nextjs:nodejs /app

# Switch to non-root user for security
USER nextjs

# Expose the application port
EXPOSE 3000

# Start the application in production mode
CMD ["npm", "start"]

# Health check to verify application status
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1