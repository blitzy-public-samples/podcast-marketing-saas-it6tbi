# Requirement Addressed: Reverse Proxy Configuration (7.3.1 Architecture Patterns)
# Base image for Nginx server
FROM nginx:1.21.6

# Requirement Addressed: Frontend and Backend Integration (8.3 API Design/8.3.2 Interface Specifications)
# Copy custom Nginx configuration for reverse proxy settings
COPY ./nginx.conf /etc/nginx/nginx.conf

# Requirement Addressed: Static Asset Serving (8.1 User Interface Design/Design Specifications)
# Create directory for static assets
RUN mkdir -p /usr/share/nginx/html

# Copy static assets from the frontend application
COPY ../../src/web/public/favicon.ico /usr/share/nginx/html/
COPY ../../src/web/public/logo.svg /usr/share/nginx/html/
COPY ../../src/web/public/manifest.json /usr/share/nginx/html/
COPY ../../src/web/public/robots.txt /usr/share/nginx/html/

# Set proper permissions for nginx user
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port 80 for HTTP traffic
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]

# Configure health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1