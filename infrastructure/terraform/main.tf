# Human Tasks:
# 1. Review and adjust variable values based on environment requirements
# 2. Ensure AWS credentials are properly configured
# 3. Verify network CIDR ranges don't conflict with existing infrastructure
# 4. Review resource sizing and scaling configurations
# 5. Confirm backup and retention policies meet compliance requirements

# Requirement addressed: 7.5 Deployment Architecture/Infrastructure Requirements
# This main configuration file serves as the central orchestrator for all infrastructure
# components of the Podcast Marketing Automation SaaS platform.

# Configure required providers
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws" # version 5.0.0
      version = "5.0.0"
    }
  }
}

# Local variables for resource naming and tagging
locals {
  environment = var.environment
  name_prefix = "podcast-marketing"
  
  common_tags = {
    Project     = "podcast-marketing-automation"
    Environment = local.environment
    ManagedBy   = "terraform"
  }
}

# Networking Module
module "networking" {
  source = "./modules/networking"
  
  vpc_cidr_block     = var.vpc_cidr
  availability_zones = ["${var.region}a", "${var.region}b", "${var.region}c"]
  subnet_cidr_blocks = [
    "10.0.1.0/24",
    "10.0.2.0/24",
    "10.0.3.0/24"
  ]
  
  tags = local.common_tags
}

# ECS Module
module "ecs" {
  source = "./modules/ecs"
  
  vpc_id           = module.networking.vpc_id
  subnet_ids       = module.networking.subnet_ids
  environment      = local.environment
  ecs_cluster_name = "${local.name_prefix}-cluster"
  ecs_instance_type = var.ecs_instance_type
  
  tags = local.common_tags
}

# RDS Module
module "rds" {
  source = "./modules/rds"
  
  rds_instance_type    = var.rds_instance_class
  rds_storage_size     = 100
  rds_engine          = "postgres"
  rds_engine_version  = "13.4"
  rds_username        = "admin"
  rds_password        = var.rds_password
  rds_multi_az        = true
  rds_backup_retention = 7
  rds_subnet_ids      = module.networking.subnet_ids
  
  tags = local.common_tags
}

# Redis Module
module "redis" {
  source = "./modules/redis"
  
  vpc_id              = module.networking.vpc_id
  subnet_ids          = module.networking.subnet_ids
  redis_instance_type = var.redis_node_type
  redis_cluster_size  = 3
  redis_engine_version = "6.x"
  parameter_group_family = "redis6.x"
  
  tags = local.common_tags
}

# S3 Module
module "s3" {
  source = "./modules/s3"
  
  bucket_name        = var.s3_bucket_name
  versioning_enabled = true
  bucket_acl         = "private"
  
  tags = local.common_tags
}

# Outputs for other modules or external consumption
output "vpc_id" {
  description = "The ID of the VPC"
  value       = module.networking.vpc_id
}

output "ecs_cluster_id" {
  description = "The ID of the ECS cluster"
  value       = module.ecs.ecs_cluster_name
}

output "rds_config" {
  description = "The RDS instance configuration"
  value = {
    endpoint = module.rds.rds_endpoint
    database = module.rds.rds_database_name
  }
  sensitive = false
}

output "redis_endpoint" {
  description = "The Redis cluster endpoint"
  value       = module.redis.redis_endpoint
}

output "redis_port" {
  description = "The Redis cluster port"
  value       = module.redis.redis_port
}

output "bucket_name" {
  description = "The name of the S3 bucket"
  value       = module.s3.bucket_name
}

output "bucket_arn" {
  description = "The ARN of the S3 bucket"
  value       = module.s3.bucket_arn
}