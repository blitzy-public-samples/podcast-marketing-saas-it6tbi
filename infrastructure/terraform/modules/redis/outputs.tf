# Requirement addressed: 7.2 Component Details/Data Storage Components
# Redis is used as the caching layer for session management, task queues, and real-time updates
# These outputs expose the connection details for applications to connect to Redis

# Requirement addressed: 7.5 Deployment Architecture/Infrastructure Requirements
# These outputs support the infrastructure requirements by providing access details
# for the highly available Redis caching service

output "redis_endpoint" {
  description = "The endpoint of the Redis cluster for application connectivity"
  value       = aws_elasticache_cluster.redis.primary_endpoint_address
}

output "redis_port" {
  description = "The port on which the Redis cluster is accessible"
  value       = aws_elasticache_cluster.redis.port
}