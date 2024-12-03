# Use the official Redis base image version 6.2.6
# Requirement addressed: Infrastructure Requirements (7.5 Deployment Architecture/Infrastructure Requirements)
FROM redis:6.2.6-alpine

# Create directory for Redis configuration
RUN mkdir -p /usr/local/etc/redis

# Copy custom Redis configuration
# Requirement addressed: Caching Layer (7.2 Component Details/Data Storage Components)
RUN echo "\
# Redis configuration for high availability and performance\n\
# Basic configuration\n\
bind 0.0.0.0\n\
protected-mode yes\n\
port 6379\n\
tcp-backlog 511\n\
timeout 0\n\
tcp-keepalive 300\n\
daemonize no\n\
supervised no\n\
pidfile /var/run/redis_6379.pid\n\
loglevel notice\n\
logfile \"\"\n\
databases 16\n\
always-show-logo no\n\
\n\
# Snapshotting configuration\n\
save 900 1\n\
save 300 10\n\
save 60 10000\n\
stop-writes-on-bgsave-error yes\n\
rdbcompression yes\n\
rdbchecksum yes\n\
dbfilename dump.rdb\n\
dir /data\n\
\n\
# Memory management\n\
maxmemory 2gb\n\
maxmemory-policy allkeys-lru\n\
maxmemory-samples 5\n\
\n\
# Security features\n\
rename-command FLUSHDB \"\"\n\
rename-command FLUSHALL \"\"\n\
rename-command DEBUG \"\"\n\
\n\
# Performance tuning\n\
activerehashing yes\n\
lazyfree-lazy-eviction yes\n\
lazyfree-lazy-expire yes\n\
lazyfree-lazy-server-del yes\n\
replica-lazy-flush yes\n\
\n\
# Client connection settings\n\
maxclients 10000\n\
\n\
# Append only mode configuration\n\
appendonly yes\n\
appendfilename \"appendonly.aof\"\n\
appendfsync everysec\n\
no-appendfsync-on-rewrite no\n\
auto-aof-rewrite-percentage 100\n\
auto-aof-rewrite-min-size 64mb\n\
aof-load-truncated yes\n\
aof-use-rdb-preamble yes\n\
\n\
# Slow log configuration\n\
slowlog-log-slower-than 10000\n\
slowlog-max-len 128\n\
\n\
# Latency monitoring\n\
latency-monitor-threshold 100\n\
" > /usr/local/etc/redis/redis.conf

# Set the working directory
WORKDIR /data

# Expose Redis port
EXPOSE 6379

# Start Redis with the custom configuration
CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]

# Set health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD redis-cli ping || exit 1