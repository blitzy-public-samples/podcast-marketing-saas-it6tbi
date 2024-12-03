# Requirement addressed: 7.5 Deployment Architecture/Infrastructure Requirements
# Provides environment-specific variable values for the production infrastructure,
# including networking, compute, database, caching, and storage resources.

# Environment Configuration
environment = "production"
region      = "us-east-1"

# Network Configuration
vpc_cidr = "10.0.0.0/16"

# Compute Configuration - ECS
ecs_instance_type = "t3.medium"

# Database Configuration - RDS
rds_instance_class = "db.t3.medium"

# Cache Configuration - Redis
redis_node_type = "cache.t3.medium"

# Storage Configuration - S3
s3_bucket_name = "production-assets-bucket"

# Common Tags
tags = {
  Environment = "production"
  ManagedBy   = "terraform"
  Project     = "podcast-marketing-automation"
}

# Networking Configuration
availability_zones = ["us-east-1a", "us-east-1b", "us-east-1c"]
subnet_cidr_blocks = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]

# ECS Configuration
ecs_cluster_name  = "podcast-marketing-production"
desired_capacity  = 3
max_capacity      = 10
min_capacity      = 2

# RDS Configuration
rds_engine           = "postgres"
rds_engine_version   = "13.4"
rds_storage_size     = 100
rds_username         = "admin"
rds_multi_az         = true
rds_backup_retention = 30

# Redis Configuration
redis_cluster_size    = 3
redis_engine_version  = "6.x"
maintenance_window    = "sun:05:00-sun:06:00"
snapshot_retention_limit = 7

# S3 Configuration
bucket_acl         = "private"
versioning_enabled = true