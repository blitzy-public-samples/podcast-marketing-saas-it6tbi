# Human Tasks:
# 1. Ensure AWS credentials are properly configured for staging environment
# 2. Review and adjust resource sizing based on staging workload requirements
# 3. Verify network CIDR blocks don't conflict with other environments
# 4. Set up proper database credentials and auth tokens
# 5. Confirm S3 bucket names are globally unique

# Requirement addressed: 7.5 Deployment Architecture/Infrastructure Requirements
# Defines the infrastructure for the staging environment, including networking, compute,
# database, caching, and storage resources.

# Configure required providers
terraform {
  required_providers {
    # AWS Provider version 5.0.0
    aws = {
      source  = "hashicorp/aws"
      version = "5.0.0"
    }
  }
}

# Local variables for environment-specific configuration
locals {
  environment = "staging"
  region     = "us-east-1"
  
  # VPC and subnet configuration
  vpc_cidr = "10.1.0.0/16"  # Staging VPC CIDR block
  subnet_cidrs = [
    "10.1.1.0/24",
    "10.1.2.0/24",
    "10.1.3.0/24"
  ]
  
  # Common tags for all resources
  common_tags = {
    Environment = local.environment
    ManagedBy   = "terraform"
    Project     = "podcast-marketing-automation"
  }
}

# Networking module for VPC and subnet configuration
module "networking" {
  source = "../../modules/networking"

  vpc_cidr_block     = local.vpc_cidr
  availability_zones = ["us-east-1a", "us-east-1b", "us-east-1c"]
  subnet_cidr_blocks = local.subnet_cidrs
}

# ECS module for container orchestration
module "ecs" {
  source = "../../modules/ecs"

  ecs_cluster_name = "podcast-staging-cluster"
  ecs_instance_type = "t3.medium"
  desired_capacity = 2
  max_capacity     = 4
  min_capacity     = 1
  
  vpc_id      = module.networking.vpc_id
  subnet_ids  = module.networking.subnet_ids
  environment = local.environment
  tags        = local.common_tags
}

# RDS module for database
module "rds" {
  source = "../../modules/rds"

  rds_instance_type    = "db.t3.medium"
  rds_storage_size     = 50
  rds_engine           = "postgres"
  rds_engine_version   = "13.4"
  rds_username         = "staging_admin"
  rds_password         = "StrongPassword123!"  # Should be replaced with secure password management
  rds_multi_az         = true
  rds_backup_retention = 7
  rds_subnet_ids       = module.networking.subnet_ids
}

# Redis module for caching
module "redis" {
  source = "../../modules/redis"

  redis_instance_type   = "cache.t3.medium"
  redis_cluster_size    = 2
  redis_engine_version  = "6.x"
  redis_auth_token     = "ComplexAuthToken123!"  # Should be replaced with secure token management
  
  vpc_id               = module.networking.vpc_id
  subnet_ids           = module.networking.subnet_ids
  tags                 = local.common_tags
}

# S3 module for asset storage
module "s3" {
  source = "../../modules/s3"

  bucket_name         = "podcast-assets-staging-${data.aws_caller_identity.current.account_id}"
  bucket_acl          = "private"
  versioning_enabled  = true
}

# Get current AWS account ID for unique naming
data "aws_caller_identity" "current" {}

# Output the key infrastructure values
output "staging_vpc_id" {
  description = "The VPC ID for the staging environment"
  value       = module.networking.vpc_id
}

output "staging_subnet_ids" {
  description = "The subnet IDs for the staging environment"
  value       = module.networking.subnet_ids
}

output "staging_ecs_cluster_name" {
  description = "The ECS cluster name for the staging environment"
  value       = module.ecs.ecs_cluster_name
}

output "staging_rds_endpoint" {
  description = "The RDS endpoint for the staging environment"
  value       = module.rds.rds_endpoint
}

output "staging_redis_endpoint" {
  description = "The Redis endpoint for the staging environment"
  value       = module.redis.redis_endpoint
}

output "staging_s3_bucket_name" {
  description = "The S3 bucket name for the staging environment"
  value       = module.s3.bucket_name
}