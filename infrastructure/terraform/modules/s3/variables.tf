# Required Terraform version
terraform {
  required_version = ">= 1.5.0" # Version constraint based on external dependency specification
}

# Human Tasks:
# 1. Review default values and adjust according to environment needs
# 2. Ensure bucket naming follows organization's naming conventions
# 3. Verify ACL requirements comply with security policies
# 4. Confirm versioning settings align with data retention policies

# Requirement 7.2: Implements cloud-based distributed storage for audio files, transcripts, 
# and generated assets using AWS S3

variable "bucket_name" {
  type        = string
  description = "Specifies the name of the S3 bucket."
  default     = "podcast-assets-bucket"

  validation {
    condition     = can(regex("^[a-z0-9][a-z0-9.-]*[a-z0-9]$", var.bucket_name))
    error_message = "Bucket name must be lowercase, can contain hyphens and periods, must start and end with a letter or number, and be between 3 and 63 characters long."
  }
}

variable "bucket_acl" {
  type        = string
  description = "Defines the access control list (ACL) for the S3 bucket."
  default     = "private"

  validation {
    condition     = contains(["private", "public-read", "public-read-write", "authenticated-read", "aws-exec-read", "log-delivery-write"], var.bucket_acl)
    error_message = "ACL must be one of: private, public-read, public-read-write, authenticated-read, aws-exec-read, log-delivery-write."
  }
}

variable "versioning_enabled" {
  type        = bool
  description = "Indicates whether versioning is enabled for the S3 bucket."
  default     = true

  validation {
    condition     = can(tobool(var.versioning_enabled))
    error_message = "The versioning_enabled variable must be a boolean value (true/false)."
  }
}