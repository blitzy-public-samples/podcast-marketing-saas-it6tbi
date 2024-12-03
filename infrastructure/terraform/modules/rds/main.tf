# Required provider version
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0.0"
    }
  }
}

# Addresses requirement 7.5 Deployment Architecture/Cloud Infrastructure
# Provisions the RDS database instance with specified configurations for the SaaS platform

resource "aws_db_instance" "main" {
  # Instance specifications
  identifier        = "saas-platform-db"
  instance_class    = var.rds_instance_type
  engine            = var.rds_engine
  engine_version    = var.rds_engine_version
  allocated_storage = var.rds_storage_size

  # Database credentials
  username = var.rds_username
  password = var.rds_password

  # Generate a unique database name based on environment
  db_name = "saas_platform_${terraform.workspace}"

  # High availability and backup configurations
  multi_az               = var.rds_multi_az
  backup_retention_period = var.rds_backup_retention
  backup_window          = "03:00-04:00"  # UTC time
  maintenance_window     = "Mon:04:00-Mon:05:00"  # UTC time

  # Performance and storage configurations
  storage_type          = "gp3"
  storage_encrypted     = true
  max_allocated_storage = var.rds_storage_size * 2  # Auto scaling up to 2x initial size

  # Network configurations
  db_subnet_group_name = aws_db_subnet_group.main.name
  publicly_accessible  = false
  skip_final_snapshot  = false
  
  # Enhanced monitoring
  monitoring_interval = 60
  monitoring_role_arn = aws_iam_role.rds_monitoring.arn

  # Performance insights
  performance_insights_enabled          = true
  performance_insights_retention_period = 7

  # Security configurations
  deletion_protection = true
  copy_tags_to_snapshot = true

  # Tags
  tags = {
    Name        = "saas-platform-db"
    Environment = terraform.workspace
    Managed_by  = "terraform"
  }
}

# Create DB subnet group
resource "aws_db_subnet_group" "main" {
  name        = "saas-platform-db-subnet-group"
  description = "Subnet group for SaaS platform RDS instance"
  subnet_ids  = var.rds_subnet_ids

  tags = {
    Name        = "saas-platform-db-subnet-group"
    Environment = terraform.workspace
    Managed_by  = "terraform"
  }
}

# Create IAM role for enhanced monitoring
resource "aws_iam_role" "rds_monitoring" {
  name = "rds-monitoring-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "monitoring.rds.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "rds-monitoring-role"
    Environment = terraform.workspace
    Managed_by  = "terraform"
  }
}

# Attach the enhanced monitoring policy to the IAM role
resource "aws_iam_role_policy_attachment" "rds_monitoring" {
  role       = aws_iam_role.rds_monitoring.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

# Parameter group for database engine configuration
resource "aws_db_parameter_group" "main" {
  family = "${var.rds_engine}${split(".", var.rds_engine_version)[0]}"
  name   = "saas-platform-${var.rds_engine}-params"

  parameter {
    name  = "log_connections"
    value = "1"
  }

  parameter {
    name  = "log_disconnections"
    value = "1"
  }

  tags = {
    Name        = "saas-platform-${var.rds_engine}-params"
    Environment = terraform.workspace
    Managed_by  = "terraform"
  }
}