# Human Tasks:
# 1. Review and validate default values for production environment
# 2. Ensure RDS credentials are securely managed through a secrets management system
# 3. Verify Redis authentication token is properly secured
# 4. Confirm VPC and subnet configurations align with network architecture
# 5. Validate instance types meet production workload requirements

# Requirement addressed: 7.5 Deployment Architecture/Infrastructure Requirements
# Defines the infrastructure variables for the production environment, including networking,
# compute, database, caching, and storage resources.

# Environment Configuration
variable "environment_name" {
  description = "The name of the environment."
  type        = string
  default     = "production"

  validation {
    condition     = var.environment_name == "production"
    error_message = "This environment is specifically for production use."
  }
}

variable "region" {
  description = "The AWS region for the environment."
  type        = string
  default     = "us-east-1"

  validation {
    condition     = can(regex("^[a-z]{2}-[a-z]+-[0-9]$", var.region))
    error_message = "Region must be a valid AWS region format (e.g., us-east-1)."
  }
}

variable "availability_zones" {
  description = "The availability zones for the environment."
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b", "us-east-1c"]

  validation {
    condition     = length(var.availability_zones) >= 2
    error_message = "At least two availability zones must be specified for high availability."
  }
}

# VPC Configuration
variable "vpc_id" {
  description = "The ID of the VPC for the production environment."
  type        = string

  validation {
    condition     = can(regex("^vpc-[a-f0-9]{8,}$", var.vpc_id))
    error_message = "VPC ID must be a valid AWS VPC ID format."
  }
}

variable "subnet_ids" {
  description = "The IDs of the subnets for the production environment."
  type        = list(string)

  validation {
    condition     = length(var.subnet_ids) >= 2
    error_message = "At least two subnet IDs must be specified for high availability."
  }
}

# ECS Configuration
variable "ecs_cluster_name" {
  description = "The name of the ECS cluster for the production environment."
  type        = string
  default     = "production-cluster"

  validation {
    condition     = length(var.ecs_cluster_name) >= 3 && length(var.ecs_cluster_name) <= 255
    error_message = "ECS cluster name must be between 3 and 255 characters."
  }
}

# RDS Configuration
variable "rds_instance_type" {
  description = "The instance type for the RDS database in the production environment."
  type        = string
  default     = "db.t3.large"

  validation {
    condition     = can(regex("^db\\.", var.rds_instance_type))
    error_message = "RDS instance type must be a valid RDS instance type starting with 'db.'."
  }
}

# Redis Configuration
variable "redis_instance_type" {
  description = "The instance type for the Redis cluster in the production environment."
  type        = string
  default     = "cache.t3.medium"

  validation {
    condition     = can(regex("^cache\\.", var.redis_instance_type))
    error_message = "Redis instance type must be a valid ElastiCache instance type starting with 'cache.'."
  }
}

# S3 Configuration
variable "s3_bucket_name" {
  description = "The name of the S3 bucket for the production environment."
  type        = string
  default     = "production-bucket"

  validation {
    condition     = can(regex("^[a-z0-9][a-z0-9.-]*[a-z0-9]$", var.s3_bucket_name))
    error_message = "S3 bucket name must be a valid bucket name format and be globally unique."
  }
}

# Additional Production-specific Variables
variable "enable_enhanced_monitoring" {
  description = "Enable enhanced monitoring for production resources."
  type        = bool
  default     = true
}

variable "backup_retention_days" {
  description = "Number of days to retain backups for production databases."
  type        = number
  default     = 30

  validation {
    condition     = var.backup_retention_days >= 30
    error_message = "Production environment requires at least 30 days of backup retention."
  }
}

variable "multi_az_enabled" {
  description = "Enable Multi-AZ deployment for production resources."
  type        = bool
  default     = true

  validation {
    condition     = var.multi_az_enabled == true
    error_message = "Multi-AZ deployment must be enabled for production environment."
  }
}

variable "performance_insights_enabled" {
  description = "Enable Performance Insights for RDS instances."
  type        = bool
  default     = true
}

variable "encryption_enabled" {
  description = "Enable encryption for all applicable resources."
  type        = bool
  default     = true

  validation {
    condition     = var.encryption_enabled == true
    error_message = "Encryption must be enabled for production environment."
  }
}