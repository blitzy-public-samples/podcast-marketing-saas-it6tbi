# Human Tasks:
# 1. Review and adjust Redis instance type based on workload requirements
# 2. Validate Redis engine version compatibility with application requirements
# 3. Ensure authentication token meets security requirements
# 4. Review cluster size based on high availability needs
# 5. Verify subnet configuration aligns with network architecture

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Requirement addressed: 7.2 Component Details/Data Storage Components
# Redis is configured as the caching layer for session management, task queues, and real-time updates

# Requirement addressed: 7.5 Deployment Architecture/Infrastructure Requirements
# The Redis module ensures high availability and scalability for caching services

# Security group for Redis cluster
resource "aws_security_group" "redis" {
  name_prefix = "redis-cluster-"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = var.port
    to_port         = var.port
    protocol        = "tcp"
    security_groups = []  # To be populated with application security groups
  }

  tags = merge(var.tags, {
    Name = "redis-cluster-sg"
  })
}

# Parameter group for Redis configuration
resource "aws_elasticache_parameter_group" "redis" {
  family = var.parameter_group_family
  name   = "redis-params-${terraform.workspace}"

  parameter {
    name  = "maxmemory-policy"
    value = "volatile-lru"
  }

  tags = var.tags
}

# Subnet group for Redis cluster
resource "aws_elasticache_subnet_group" "redis" {
  name       = "redis-subnet-group-${terraform.workspace}"
  subnet_ids = var.subnet_ids

  tags = var.tags
}

# Redis cluster
resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "redis-cluster-${terraform.workspace}"
  engine              = "redis"
  engine_version      = var.redis_engine_version
  node_type           = var.redis_instance_type
  num_cache_nodes     = var.redis_cluster_size
  parameter_group_name = aws_elasticache_parameter_group.redis.name
  port                = var.port
  security_group_ids  = [aws_security_group.redis.id]
  subnet_group_name   = aws_elasticache_subnet_group.redis.name

  # Authentication
  auth_token = var.redis_auth_token
  transit_encryption_enabled = true

  # Maintenance and backup settings
  maintenance_window       = var.maintenance_window
  snapshot_retention_limit = var.snapshot_retention_limit
  apply_immediately       = var.apply_immediately

  # Advanced settings
  auto_minor_version_upgrade = true
  notification_topic_arn    = null  # Optional: SNS topic for notifications

  tags = merge(var.tags, {
    Name = "redis-cluster-${terraform.workspace}"
  })
}

# Outputs for other modules to consume
output "redis_endpoint" {
  description = "The endpoint of the Redis cluster for application connectivity"
  value       = aws_elasticache_cluster.redis.cache_nodes[0].address
}

output "redis_port" {
  description = "The port on which the Redis cluster is accessible"
  value       = aws_elasticache_cluster.redis.cache_nodes[0].port
}

output "redis_security_group_id" {
  description = "The ID of the Redis security group"
  value       = aws_security_group.redis.id
}