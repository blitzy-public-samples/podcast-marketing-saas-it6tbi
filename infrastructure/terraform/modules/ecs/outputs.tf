# Requirement addressed: 7.5 Deployment Architecture/Cloud Infrastructure - ECS Infrastructure Outputs
# Exposes ECS cluster name, service ARNs, and task definition ARNs for integration with other modules and environments.

output "ecs_cluster_name" {
  description = "The name of the ECS cluster for use in other modules or environments"
  value       = aws_ecs_cluster.main.name
}

output "ecs_service_arns" {
  description = "The ARNs of the ECS services for use in other modules or environments"
  value       = [aws_ecs_service.app.id]
}

output "ecs_task_definition_arns" {
  description = "The ARNs of the ECS task definitions for use in other modules or environments"
  value       = [aws_ecs_task_definition.app.arn]
}