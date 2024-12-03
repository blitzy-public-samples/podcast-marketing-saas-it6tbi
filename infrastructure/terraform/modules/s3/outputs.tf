# Terraform outputs for the S3 module
# Requirement 7.2: Implements cloud-based distributed storage for audio files, transcripts, 
# and generated assets using AWS S3

# Output the ARN of the S3 bucket
output "bucket_arn" {
  description = "The Amazon Resource Name (ARN) of the S3 bucket used for storing podcast assets"
  value       = aws_s3_bucket.podcast_assets.arn
  sensitive   = false
}

# Output the name of the S3 bucket
output "bucket_name" {
  description = "The name of the S3 bucket used for storing podcast assets"
  value       = aws_s3_bucket.podcast_assets.id
  sensitive   = false
}

# Output the ACL configuration of the S3 bucket
output "bucket_acl" {
  description = "The Access Control List (ACL) configuration of the S3 bucket"
  value       = aws_s3_bucket_acl.podcast_assets_acl.acl
  sensitive   = false
}

# Output the versioning status of the S3 bucket
output "versioning_enabled" {
  description = "Boolean flag indicating whether versioning is enabled on the S3 bucket"
  value       = aws_s3_bucket_versioning.podcast_assets_versioning.versioning_configuration[0].status == "Enabled"
  sensitive   = false
}