# Human Tasks:
# 1. Review and adjust Redis instance type based on workload requirements
# 2. Validate Redis engine version compatibility with application requirements
# 3. Ensure authentication token meets security requirements
# 4. Review cluster size based on high availability needs

# Requirement addressed: 7.2 Component Details/Data Storage Components
# Redis is configured as the caching layer for session management, task queues, and real-time updates

# Requirement addressed: 7.5 Deployment Architecture/Infrastructure Requirements
# Variables defined here support high availability and scalability for caching services

# Network configuration variables
variable "vpc_id" {
  description = "The ID of the VPC where Redis cluster will be deployed"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs where Redis nodes will be deployed"
  type        = list(string)
}

# Redis cluster configuration variables
variable "redis_instance_type" {
  description = "The compute and memory capacity of the Redis nodes"
  type        = string
  default     = "cache.t3.medium"

  validation {
    condition     = can(regex("^cache\\.", var.redis_instance_type))
    error_message = "The redis_instance_type must be a valid ElastiCache instance type starting with 'cache.'"
  }
}

variable "redis_cluster_size" {
  description = "The number of nodes in the Redis cluster for high availability"
  type        = number
  default     = 3

  validation {
    condition     = var.redis_cluster_size >= 1 && var.redis_cluster_size <= 6
    error_message = "Redis cluster size must be between 1 and 6 nodes."
  }
}

variable "redis_engine_version" {
  description = "The version number of the Redis engine"
  type        = string
  default     = "6.x"

  validation {
    condition     = can(regex("^[0-9]+\\.x$", var.redis_engine_version))
    error_message = "The redis_engine_version must be in the format 'X.x' where X is the major version number."
  }
}

variable "redis_auth_token" {
  description = "Authentication token for Redis cluster access (must be at least 16 characters)"
  type        = string
  default     = ""
  sensitive   = true

  validation {
    condition     = var.redis_auth_token == "" || length(var.redis_auth_token) >= 16
    error_message = "The redis_auth_token, if provided, must be at least 16 characters long."
  }
}

variable "tags" {
  description = "A map of tags to add to all resources"
  type        = map(string)
  default     = {}
}

variable "parameter_group_family" {
  description = "The family of the Redis parameter group"
  type        = string
  default     = "redis6.x"

  validation {
    condition     = can(regex("^redis[0-9]+\\.x$", var.parameter_group_family))
    error_message = "The parameter_group_family must be in the format 'redisX.x' where X is the major version number."
  }
}

variable "maintenance_window" {
  description = "The weekly time range for maintenance operations (format: ddd:hh24:mi-ddd:hh24:mi)"
  type        = string
  default     = "sun:05:00-sun:06:00"

  validation {
    condition     = can(regex("^[a-z]{3}:[0-9]{2}:[0-9]{2}-[a-z]{3}:[0-9]{2}:[0-9]{2}$", var.maintenance_window))
    error_message = "The maintenance_window must be in the format 'ddd:hh24:mi-ddd:hh24:mi'."
  }
}

variable "port" {
  description = "The port number on which Redis accepts connections"
  type        = number
  default     = 6379

  validation {
    condition     = var.port > 0 && var.port < 65536
    error_message = "The port number must be between 1 and 65535."
  }
}

variable "snapshot_retention_limit" {
  description = "The number of days for which ElastiCache will retain automatic snapshots"
  type        = number
  default     = 7

  validation {
    condition     = var.snapshot_retention_limit >= 0 && var.snapshot_retention_limit <= 35
    error_message = "The snapshot retention limit must be between 0 and 35 days."
  }
}

variable "apply_immediately" {
  description = "Specifies whether modifications are applied immediately or during the maintenance window"
  type        = bool
  default     = false
}