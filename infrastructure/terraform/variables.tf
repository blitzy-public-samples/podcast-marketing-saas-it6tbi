# Human Tasks:
# 1. Review and adjust default values based on environment requirements
# 2. Ensure AWS region selection aligns with compliance and latency requirements
# 3. Verify CIDR blocks don't conflict with existing network configurations
# 4. Review instance types for cost optimization and performance requirements

# Requirement addressed: 7.5 Deployment Architecture/Infrastructure Requirements
# Provides input variables to parameterize the Terraform configuration, enabling flexibility 
# and environment-specific customizations.

# Environment Configuration
variable "environment" {
  description = "Specifies the environment type (e.g., development, staging, production)"
  type        = string
  default     = "production"

  validation {
    condition     = contains(["development", "staging", "production"], var.environment)
    error_message = "Environment must be one of: development, staging, production"
  }
}

# Region Configuration
variable "region" {
  description = "Specifies the AWS region for resource provisioning"
  type        = string
  default     = "us-east-1"

  validation {
    condition     = can(regex("^[a-z]{2}-[a-z]+-[0-9]{1}$", var.region))
    error_message = "Region must be a valid AWS region format (e.g., us-east-1)"
  }
}

# Network Configuration
variable "vpc_cidr" {
  description = "Defines the CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"

  validation {
    condition     = can(cidrhost(var.vpc_cidr, 0))
    error_message = "VPC CIDR must be a valid IPv4 CIDR block"
  }
}

# Compute Configuration
variable "ecs_instance_type" {
  description = "Specifies the instance type for ECS tasks"
  type        = string
  default     = "t3.medium"

  validation {
    condition     = can(regex("^t3\\.|^m5\\.|^c5\\.", var.ecs_instance_type))
    error_message = "ECS instance type must be a valid AWS instance type (t3, m5, or c5 series recommended)"
  }
}

# Database Configuration
variable "rds_instance_class" {
  description = "Defines the instance class for RDS"
  type        = string
  default     = "db.t3.medium"

  validation {
    condition     = can(regex("^db\\.", var.rds_instance_class))
    error_message = "RDS instance class must be a valid AWS RDS instance type starting with 'db.'"
  }
}

# Cache Configuration
variable "redis_node_type" {
  description = "Specifies the node type for Redis"
  type        = string
  default     = "cache.t3.medium"

  validation {
    condition     = can(regex("^cache\\.", var.redis_node_type))
    error_message = "Redis node type must be a valid AWS ElastiCache instance type starting with 'cache.'"
  }
}

# Storage Configuration
variable "s3_bucket_name" {
  description = "Defines the name of the S3 bucket for storing assets"
  type        = string
  default     = "podcast-assets-bucket"

  validation {
    condition     = can(regex("^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$", var.s3_bucket_name))
    error_message = "S3 bucket name must be between 3 and 63 characters, contain only lowercase letters, numbers, and hyphens, and start/end with a letter or number"
  }
}

# Common Tags
variable "tags" {
  description = "Common tags to be applied to all resources"
  type        = map(string)
  default = {
    Project   = "podcast-marketing-automation"
    ManagedBy = "terraform"
  }
}