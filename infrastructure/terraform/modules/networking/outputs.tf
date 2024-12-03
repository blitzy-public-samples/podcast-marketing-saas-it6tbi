# Requirement addressed: 7.5 Deployment Architecture/Cloud Infrastructure - Networking Infrastructure
# Defines the networking outputs that expose VPC and subnet IDs for use by other modules in the SaaS platform

output "vpc_id" {
  description = "The ID of the created VPC for use in other modules"
  value       = aws_vpc.main.id
}

output "subnet_ids" {
  description = "The IDs of the created public subnets for use in other modules"
  value       = aws_subnet.public[*].id
}