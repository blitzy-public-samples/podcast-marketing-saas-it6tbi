# Human Tasks:
# 1. Review and adjust default values based on staging environment requirements
# 2. Ensure VPC and subnet IDs are correctly specified for staging environment
# 3. Verify instance types are appropriate for staging workload
# 4. Confirm S3 bucket name is globally unique
# 5. Review availability zones match the target region

# Requirement addressed: 7.5 Deployment Architecture/Infrastructure Requirements
# Defines the infrastructure for the staging environment, including networking, compute,
# database, caching, and storage resources.

# Environment configuration
variable "environment_name" {
  description = "The name of the environment, localized from terraform.tfvars."
  type        = string
  default     = "staging"

  validation {
    condition     = contains(["staging"], var.environment_name)
    error_message = "Environment name must be 'staging' for this configuration."
  }
}

variable "region" {
  description = "The AWS region for the environment, localized from terraform.tfvars."
  type        = string
  default     = "us-east-1"

  validation {
    condition     = can(regex("^[a-z]{2}-[a-z]+-[0-9]{1}$", var.region))
    error_message = "Region must be a valid AWS region identifier, e.g., us-east-1"
  }
}

variable "availability_zones" {
  description = "The availability zones for the environment, localized from terraform.tfvars."
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b", "us-east-1c"]

  validation {
    condition     = length(var.availability_zones) >= 2
    error_message = "At least two availability zones must be specified for high availability."
  }
}

# Networking configuration
variable "vpc_id" {
  description = "The ID of the VPC for the staging environment."
  type        = string

  validation {
    condition     = can(regex("^vpc-[a-f0-9]{8,17}$", var.vpc_id))
    error_message = "VPC ID must be a valid vpc-* identifier."
  }
}

variable "subnet_ids" {
  description = "The IDs of the subnets for the staging environment."
  type        = list(string)

  validation {
    condition     = length(var.subnet_ids) >= 2
    error_message = "At least two subnet IDs must be specified for high availability."
  }
}

# ECS configuration
variable "ecs_cluster_name" {
  description = "The name of the ECS cluster for the staging environment."
  type        = string
  default     = "staging-cluster"

  validation {
    condition     = length(var.ecs_cluster_name) >= 3 && length(var.ecs_cluster_name) <= 255
    error_message = "ECS cluster name must be between 3 and 255 characters."
  }
}

# RDS configuration
variable "rds_instance_type" {
  description = "The instance type for the RDS database in the staging environment."
  type        = string
  default     = "db.t3.medium"

  validation {
    condition     = can(regex("^db\\.", var.rds_instance_type))
    error_message = "RDS instance type must start with 'db.' prefix."
  }
}

# Redis configuration
variable "redis_instance_type" {
  description = "The instance type for the Redis cluster in the staging environment."
  type        = string
  default     = "cache.t3.micro"

  validation {
    condition     = can(regex("^cache\\.", var.redis_instance_type))
    error_message = "Redis instance type must start with 'cache.' prefix."
  }
}

# S3 configuration
variable "s3_bucket_name" {
  description = "The name of the S3 bucket for the staging environment."
  type        = string
  default     = "staging-bucket"

  validation {
    condition     = can(regex("^[a-z0-9][a-z0-9.-]*[a-z0-9]$", var.s3_bucket_name))
    error_message = "S3 bucket name must be a valid bucket name and follow AWS naming conventions."
  }
}