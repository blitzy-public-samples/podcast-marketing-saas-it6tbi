# Human Tasks:
# 1. Ensure AWS credentials are properly configured
# 2. Review and adjust default values based on production requirements
# 3. Verify VPC and subnet configurations are available
# 4. Confirm IAM roles and policies are set up for ECS tasks

# Requirement addressed: ECS Infrastructure (Section 7.5 Deployment Architecture/Cloud Infrastructure)
# Defines input variables for configuring ECS clusters, services, and scaling policies

variable "ecs_cluster_name" {
  description = "The name of the ECS cluster"
  type        = string
  default     = "podcast-ecs-cluster"

  validation {
    condition     = length(var.ecs_cluster_name) > 3 && length(var.ecs_cluster_name) <= 255
    error_message = "ECS cluster name must be between 3 and 255 characters"
  }
}

variable "ecs_instance_type" {
  description = "The instance type for ECS cluster instances"
  type        = string
  default     = "t3.medium"

  validation {
    condition     = can(regex("^t3\\.|^m5\\.|^c5\\.", var.ecs_instance_type))
    error_message = "ECS instance type must be a valid AWS instance type (t3, m5, or c5 series recommended)"
  }
}

variable "desired_capacity" {
  description = "The desired number of ECS instances"
  type        = number
  default     = 2

  validation {
    condition     = var.desired_capacity >= 1 && var.desired_capacity <= 100
    error_message = "Desired capacity must be between 1 and 100"
  }
}

variable "max_capacity" {
  description = "The maximum number of ECS instances"
  type        = number
  default     = 5

  validation {
    condition     = var.max_capacity >= 1 && var.max_capacity <= 100
    error_message = "Maximum capacity must be between 1 and 100"
  }
}

variable "min_capacity" {
  description = "The minimum number of ECS instances"
  type        = number
  default     = 1

  validation {
    condition     = var.min_capacity >= 1 && var.min_capacity <= 100
    error_message = "Minimum capacity must be between 1 and 100"
  }
}

# Additional required variables for ECS cluster configuration
variable "vpc_id" {
  description = "The VPC ID where the ECS cluster will be deployed"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs where the ECS cluster will be deployed"
  type        = list(string)
}

variable "environment" {
  description = "The environment where the ECS cluster will be deployed"
  type        = string
  default     = "production"

  validation {
    condition     = contains(["development", "staging", "production"], var.environment)
    error_message = "Environment must be one of: development, staging, production"
  }
}

variable "tags" {
  description = "A map of tags to add to all resources"
  type        = map(string)
  default     = {
    Terraform   = "true"
    Application = "podcast-automation"
  }
}

variable "enable_container_insights" {
  description = "Enable CloudWatch Container Insights for the ECS cluster"
  type        = bool
  default     = true
}

variable "capacity_provider_strategy" {
  description = "The capacity provider strategy for the ECS cluster"
  type = list(object({
    capacity_provider = string
    weight           = number
    base             = number
  }))
  default = [
    {
      capacity_provider = "FARGATE"
      weight           = 1
      base             = 1
    },
    {
      capacity_provider = "FARGATE_SPOT"
      weight           = 4
      base             = 0
    }
  ]
}

variable "enable_execute_command" {
  description = "Enable AWS ECS Exec for the ECS cluster"
  type        = bool
  default     = false
}

# Health check configuration
variable "health_check_grace_period_seconds" {
  description = "The health check grace period in seconds"
  type        = number
  default     = 60

  validation {
    condition     = var.health_check_grace_period_seconds >= 0 && var.health_check_grace_period_seconds <= 1800
    error_message = "Health check grace period must be between 0 and 1800 seconds"
  }
}

# Auto-scaling configuration
variable "scale_up_cooldown" {
  description = "The amount of time, in seconds, after a scale up activity completes before another can start"
  type        = number
  default     = 300

  validation {
    condition     = var.scale_up_cooldown >= 0 && var.scale_up_cooldown <= 3600
    error_message = "Scale up cooldown must be between 0 and 3600 seconds"
  }
}

variable "scale_down_cooldown" {
  description = "The amount of time, in seconds, after a scale down activity completes before another can start"
  type        = number
  default     = 300

  validation {
    condition     = var.scale_down_cooldown >= 0 && var.scale_down_cooldown <= 3600
    error_message = "Scale down cooldown must be between 0 and 3600 seconds"
  }
}