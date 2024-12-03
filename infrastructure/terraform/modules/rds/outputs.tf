# Addresses requirement 7.5 Deployment Architecture/Cloud Infrastructure - RDS Outputs
# Exposes key RDS instance attributes for integration with other infrastructure components

output "rds_endpoint" {
  description = "The connection endpoint for the RDS instance"
  value       = aws_db_instance.main.endpoint
  sensitive   = false
}

output "rds_username" {
  description = "The master username for the RDS instance"
  value       = aws_db_instance.main.username
  sensitive   = true
}

output "rds_database_name" {
  description = "The name of the default database on the RDS instance"
  value       = aws_db_instance.main.db_name
  sensitive   = false
}