# RDS Module Variables
# Requirement: 7.5 Deployment Architecture/Infrastructure Requirements
# Provides input variables for configuring the RDS instance, including instance type, storage size, engine, and credentials.

variable "rds_instance_type" {
  description = "The instance type for the RDS database (e.g., db.t3.medium)."
  type        = string
  default     = "db.t3.medium"

  validation {
    condition     = can(regex("^db\\.", var.rds_instance_type))
    error_message = "The instance type must be a valid RDS instance type starting with 'db.'."
  }
}

variable "rds_engine" {
  description = "The database engine for the RDS instance (e.g., postgres, mysql)."
  type        = string
  default     = "postgres"

  validation {
    condition     = contains(["postgres", "mysql", "mariadb", "oracle-se2", "sqlserver-ex"], var.rds_engine)
    error_message = "The database engine must be one of: postgres, mysql, mariadb, oracle-se2, sqlserver-ex."
  }
}

variable "rds_engine_version" {
  description = "The version of the database engine (e.g., 13.4 for PostgreSQL)."
  type        = string
  default     = "13.4"

  validation {
    condition     = can(regex("^\\d+\\.\\d+(\\.\\d+)?$", var.rds_engine_version))
    error_message = "The engine version must be in the format 'major.minor' or 'major.minor.patch'."
  }
}

variable "rds_storage_size" {
  description = "The allocated storage size for the RDS instance in GB."
  type        = number
  default     = 20

  validation {
    condition     = var.rds_storage_size >= 20 && var.rds_storage_size <= 65536
    error_message = "Storage size must be between 20 GB and 65536 GB (64 TB)."
  }
}

variable "rds_username" {
  description = "The master username for the RDS database."
  type        = string
  default     = "admin"

  validation {
    condition     = can(regex("^[a-zA-Z][a-zA-Z0-9_]*$", var.rds_username))
    error_message = "Username must start with a letter and contain only alphanumeric characters and underscores."
  }
}

variable "rds_password" {
  description = "The master password for the RDS database."
  type        = string
  default     = "change_me"
  sensitive   = true

  validation {
    condition     = length(var.rds_password) >= 8
    error_message = "Password must be at least 8 characters long."
  }
}

variable "rds_multi_az" {
  description = "Whether to enable Multi-AZ deployment for the RDS instance."
  type        = bool
  default     = true
}

variable "rds_backup_retention" {
  description = "The number of days to retain backups for the RDS instance."
  type        = number
  default     = 7

  validation {
    condition     = var.rds_backup_retention >= 0 && var.rds_backup_retention <= 35
    error_message = "Backup retention period must be between 0 and 35 days."
  }
}

variable "rds_subnet_ids" {
  description = "The list of subnet IDs for the RDS instance."
  type        = list(string)
  default     = []

  validation {
    condition     = length(var.rds_subnet_ids) > 0
    error_message = "At least one subnet ID must be provided for the RDS instance."
  }
}