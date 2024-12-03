# Human Tasks:
# 1. Review and adjust CIDR blocks and availability zones based on production requirements
# 2. Verify RDS credentials are securely stored and managed
# 3. Confirm Redis authentication token is properly secured
# 4. Validate S3 bucket name is globally unique
# 5. Review auto-scaling thresholds for production workloads

# Requirement addressed: 7.5 Deployment Architecture/Cloud Infrastructure
# Implements the production environment infrastructure by integrating networking, ECS, RDS, Redis, and S3 modules

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "podcast-marketing-terraform-state"
    key    = "production/terraform.tfstate"
    region = "us-west-2"
  }
}

provider "aws" {
  region = "us-west-2"
}

locals {
  environment = "production"
  
  # Production-specific configurations
  vpc_cidr_block     = "10.0.0.0/16"
  availability_zones = ["us-west-2a", "us-west-2b", "us-west-2c"]
  subnet_cidr_blocks = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  
  common_tags = {
    Environment = local.environment
    ManagedBy   = "terraform"
    Project     = "podcast-marketing-automation"
  }
}

# Networking Module
module "networking" {
  source = "../../modules/networking"

  vpc_cidr_block     = local.vpc_cidr_block
  availability_zones = local.availability_zones
  subnet_cidr_blocks = local.subnet_cidr_blocks

  tags = local.common_tags
}

# ECS Module
module "ecs" {
  source = "../../modules/ecs"

  ecs_cluster_name = "podcast-marketing-production"
  subnet_ids       = module.networking.subnet_ids
  vpc_id          = module.networking.vpc_id
  
  # Production-specific ECS configurations
  ecs_instance_type = "t3.large"
  desired_capacity  = 3
  max_capacity      = 10
  min_capacity      = 2

  environment = local.environment
  tags        = local.common_tags
}

# RDS Module
module "rds" {
  source = "../../modules/rds"

  # Production-specific RDS configurations
  rds_instance_type    = "db.t3.large"
  rds_engine          = "postgres"
  rds_engine_version  = "13.4"
  rds_storage_size    = 100
  rds_username        = "admin"
  rds_password        = var.rds_password
  rds_multi_az        = true
  rds_backup_retention = 30
  
  rds_subnet_ids = module.networking.subnet_ids

  tags = local.common_tags
}

# Redis Module
module "redis" {
  source = "../../modules/redis"

  vpc_id     = module.networking.vpc_id
  subnet_ids = module.networking.subnet_ids

  # Production-specific Redis configurations
  redis_instance_type   = "cache.t3.medium"
  redis_cluster_size    = 3
  redis_engine_version  = "6.x"
  redis_auth_token     = var.redis_auth_token
  
  maintenance_window       = "sun:05:00-sun:06:00"
  snapshot_retention_limit = 7
  
  tags = local.common_tags
}

# S3 Module
module "s3" {
  source = "../../modules/s3"

  # Production-specific S3 configurations
  bucket_name        = "podcast-marketing-assets-production"
  bucket_acl         = "private"
  versioning_enabled = true

  tags = local.common_tags
}

# Outputs
output "vpc_id" {
  description = "The ID of the VPC"
  value       = module.networking.vpc_id
}

output "ecs_cluster_name" {
  description = "The name of the ECS cluster"
  value       = module.ecs.ecs_cluster_name
}

output "rds_endpoint" {
  description = "The endpoint of the RDS instance"
  value       = module.rds.rds_endpoint
  sensitive   = true
}

output "redis_endpoint" {
  description = "The endpoint of the Redis cluster"
  value       = module.redis.redis_endpoint
}

output "bucket_arn" {
  description = "The ARN of the S3 bucket"
  value       = module.s3.bucket_arn
}

# Variables
variable "rds_password" {
  description = "The master password for the RDS instance"
  type        = string
  sensitive   = true
}

variable "redis_auth_token" {
  description = "The authentication token for the Redis cluster"
  type        = string
  sensitive   = true
}