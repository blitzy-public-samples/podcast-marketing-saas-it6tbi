# Human Tasks:
# 1. Ensure the S3 bucket 'podcast-assets-bucket' exists and has versioning enabled
# 2. Verify DynamoDB table 'terraform-locks' exists with 'LockID' as primary key
# 3. Confirm IAM permissions allow access to both S3 bucket and DynamoDB table
# 4. Review encryption settings for S3 bucket to ensure compliance with security requirements

# Requirement addressed: 7.5 Deployment Architecture/Infrastructure Requirements
# Provides a centralized backend configuration for Terraform state management,
# enabling collaboration and consistency across environments.

# Backend configuration for Terraform state management
terraform {
  backend "s3" {
    # S3 bucket for storing Terraform state files
    bucket = "podcast-assets-bucket"
    
    # Key path for the state file within the bucket
    key = "terraform/state"
    
    # AWS region where the S3 bucket is located
    region = "us-east-1"
    
    # DynamoDB table for state locking
    dynamodb_table = "terraform-locks"
    
    # Enable encryption for state files
    encrypt = true
    
    # Additional recommended settings for production use
    versioning = true
    
    # Error handling for state operations
    skip_credentials_validation = false
    skip_region_validation     = false
    skip_metadata_api_check    = false
  }
}