# Requirement addressed: 7.5 Deployment Architecture/Infrastructure Requirements
# Defines the infrastructure for the staging environment, including networking, compute,
# database, caching, and storage resources.

# Environment configuration
environment_name = "staging"
region = "us-east-1"
availability_zones = [
  "us-east-1a",
  "us-east-1b",
  "us-east-1c"
]

# Networking configuration
vpc_id = "vpc-123456"
subnet_ids = [
  "subnet-123456",
  "subnet-654321"
]

# ECS configuration
ecs_cluster_name = "staging-cluster"

# RDS configuration
rds_instance_type = "db.t3.medium"

# Redis configuration
redis_instance_type = "cache.t3.micro"

# S3 configuration
s3_bucket_name = "staging-bucket"