# AWS Provider version 5.0.0
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.0.0"
    }
  }
}

# Human Tasks:
# 1. Ensure AWS credentials are properly configured
# 2. Verify the bucket name is globally unique
# 3. Review bucket policies and CORS settings if needed
# 4. Configure bucket lifecycle rules if required
# 5. Set up bucket monitoring and alerts

# Core S3 bucket resource for storing audio files, transcripts, and generated assets
# Requirement 7.2: Implements cloud-based distributed storage for audio files, transcripts, 
# and generated assets using AWS S3
resource "aws_s3_bucket" "podcast_assets" {
  bucket = var.bucket_name
  
  # Enable versioning for data protection and recovery
  versioning {
    enabled = var.versioning_enabled
  }
  
  # Configure server-side encryption by default
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
  
  # Block public access to the bucket
  block_public_access {
    block_public_acls       = true
    block_public_policy     = true
    ignore_public_acls      = true
    restrict_public_buckets = true
  }

  # Add tags for resource management
  tags = {
    Name        = var.bucket_name
    Environment = terraform.workspace
    Purpose     = "Podcast Marketing Assets Storage"
    ManagedBy   = "Terraform"
  }
}

# Configure bucket ACL
resource "aws_s3_bucket_acl" "podcast_assets_acl" {
  bucket = aws_s3_bucket.podcast_assets.id
  acl    = var.bucket_acl
}

# Enable versioning on the bucket
resource "aws_s3_bucket_versioning" "podcast_assets_versioning" {
  bucket = aws_s3_bucket.podcast_assets.id
  
  versioning_configuration {
    status = var.versioning_enabled ? "Enabled" : "Suspended"
  }
}

# Configure CORS for the bucket
resource "aws_s3_bucket_cors_configuration" "podcast_assets_cors" {
  bucket = aws_s3_bucket.podcast_assets.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE"]
    allowed_origins = ["*"] # Should be restricted in production
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# Configure lifecycle rules for the bucket
resource "aws_s3_bucket_lifecycle_configuration" "podcast_assets_lifecycle" {
  bucket = aws_s3_bucket.podcast_assets.id

  rule {
    id     = "archive_old_content"
    status = "Enabled"

    transition {
      days          = 90
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 180
      storage_class = "GLACIER"
    }

    expiration {
      days = 730 # 2 years
    }
  }
}

# Output the bucket ARN
output "bucket_arn" {
  description = "The ARN of the S3 bucket"
  value       = aws_s3_bucket.podcast_assets.arn
}

# Output the bucket name
output "bucket_name" {
  description = "The name of the S3 bucket"
  value       = aws_s3_bucket.podcast_assets.id
}

# Output the bucket ACL
output "bucket_acl" {
  description = "The ACL of the S3 bucket"
  value       = var.bucket_acl
}

# Output the versioning status
output "versioning_enabled" {
  description = "The versioning status of the S3 bucket"
  value       = var.versioning_enabled
}