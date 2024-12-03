# Requirement addressed: 7.5 Deployment Architecture/Infrastructure Requirements
# Specifies the provider configurations required for Terraform to manage cloud resources such as AWS services.

# Configure Terraform settings
terraform {
  # Terraform version constraint
  required_version = ">= 1.5.0"

  # Required providers with version constraints
  required_providers {
    # AWS Provider - version 5.0.0
    aws = {
      source  = "hashicorp/aws"
      version = "5.0.0"
    }
  }

  # Backend configuration should be provided separately to support different environments
  backend "s3" {}
}

# Local variables for provider configuration
locals {
  provider_config = {
    region  = "us-east-1"
    profile = "default"
  }
}

# AWS Provider configuration
provider "aws" {
  region  = local.provider_config.region
  profile = local.provider_config.profile

  # Default tags applied to all resources
  default_tags {
    tags = {
      Project     = "podcast-marketing-automation"
      Environment = terraform.workspace
      ManagedBy   = "terraform"
    }
  }
}

# Provider configuration for secondary regions if needed
# Uncomment and modify as required for multi-region deployments
# provider "aws" {
#   alias   = "secondary"
#   region  = "us-west-2"
#   profile = local.provider_config.profile
# }