# Requirement addressed: 7.5 Deployment Architecture/Infrastructure Requirements
# Exposes critical attributes of the provisioned infrastructure such as VPC IDs, ECS cluster names,
# RDS endpoints, and S3 bucket names for integration with other modules and services.

# VPC and Networking outputs
output "vpc_id" {
  description = "The ID of the created VPC for use in other modules"
  value       = module.networking.vpc_id
}

output "subnet_ids" {
  description = "The IDs of the created subnets for use in other modules"
  value       = module.networking.subnet_ids
}

# ECS outputs
output "ecs_cluster_name" {
  description = "The name of the ECS cluster for use in other modules"
  value       = module.ecs.ecs_cluster_name
}

# RDS outputs
output "rds_endpoint" {
  description = "The endpoint of the RDS instance for application connectivity"
  value       = module.rds.rds_endpoint
  sensitive   = false
}

# Redis outputs
output "redis_endpoint" {
  description = "The endpoint of the Redis cluster for application connectivity"
  value       = module.redis.redis_endpoint
}