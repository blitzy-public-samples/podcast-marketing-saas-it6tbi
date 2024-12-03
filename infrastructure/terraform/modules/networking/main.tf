# Human Tasks:
# 1. Ensure AWS provider is configured with appropriate credentials and region
# 2. Review and adjust CIDR blocks based on network requirements
# 3. Verify availability zones are appropriate for the target region
# 4. Confirm VPC flow logs destination if needed
# 5. Review and adjust network ACL rules if required

# Requirement addressed: 7.5 Deployment Architecture/Cloud Infrastructure - Networking Infrastructure
# Defines the networking components such as VPCs, subnets, and routing tables required for the deployment of the SaaS platform.

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Local variables for network configuration
locals {
  vpc_cidr_block     = var.vpc_cidr_block
  availability_zones = var.availability_zones
  subnet_cidr_blocks = var.subnet_cidr_blocks
  
  common_tags = {
    Environment = terraform.workspace
    ManagedBy  = "terraform"
    Project    = "podcast-marketing-automation"
  }
}

# VPC resource creation
resource "aws_vpc" "main" {
  cidr_block           = local.vpc_cidr_block
  enable_dns_support   = true
  enable_dns_hostnames = true
  
  tags = merge(local.common_tags, {
    Name = "podcast-marketing-vpc-${terraform.workspace}"
  })
}

# Internet Gateway for public internet access
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  
  tags = merge(local.common_tags, {
    Name = "podcast-marketing-igw-${terraform.workspace}"
  })
}

# Public subnets for external-facing resources
resource "aws_subnet" "public" {
  count             = length(local.availability_zones)
  vpc_id            = aws_vpc.main.id
  cidr_block        = local.subnet_cidr_blocks[count.index]
  availability_zone = local.availability_zones[count.index]
  
  map_public_ip_on_launch = true
  
  tags = merge(local.common_tags, {
    Name = "podcast-marketing-public-subnet-${count.index + 1}-${terraform.workspace}"
    Tier = "public"
  })
}

# Route table for public subnets
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
  
  tags = merge(local.common_tags, {
    Name = "podcast-marketing-public-rt-${terraform.workspace}"
  })
}

# Associate public subnets with public route table
resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# VPC Flow Logs for network monitoring
resource "aws_flow_log" "main" {
  vpc_id                = aws_vpc.main.id
  traffic_type         = "ALL"
  iam_role_arn         = aws_iam_role.vpc_flow_log.arn
  log_destination_type = "cloud-watch-logs"
  log_destination      = aws_cloudwatch_log_group.vpc_flow_log.arn
  
  tags = merge(local.common_tags, {
    Name = "podcast-marketing-vpc-flow-logs-${terraform.workspace}"
  })
}

# CloudWatch Log Group for VPC Flow Logs
resource "aws_cloudwatch_log_group" "vpc_flow_log" {
  name              = "/aws/vpc/flow-logs-${terraform.workspace}"
  retention_in_days = 30
  
  tags = local.common_tags
}

# IAM role for VPC Flow Logs
resource "aws_iam_role" "vpc_flow_log" {
  name = "vpc-flow-log-role-${terraform.workspace}"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "vpc-flow-logs.amazonaws.com"
        }
      }
    ]
  })
  
  tags = local.common_tags
}

# IAM policy for VPC Flow Logs
resource "aws_iam_role_policy" "vpc_flow_log" {
  name = "vpc-flow-log-policy-${terraform.workspace}"
  role = aws_iam_role.vpc_flow_log.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams"
        ]
        Effect = "Allow"
        Resource = "*"
      }
    ]
  })
}

# Network ACL for additional security layer
resource "aws_network_acl" "main" {
  vpc_id     = aws_vpc.main.id
  subnet_ids = aws_subnet.public[*].id
  
  ingress {
    protocol   = -1
    rule_no    = 100
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 0
    to_port    = 0
  }
  
  egress {
    protocol   = -1
    rule_no    = 100
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 0
    to_port    = 0
  }
  
  tags = merge(local.common_tags, {
    Name = "podcast-marketing-nacl-${terraform.workspace}"
  })
}

# Outputs for use in other modules
output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.main.id
}

output "subnet_ids" {
  description = "The IDs of the public subnets"
  value       = aws_subnet.public[*].id
}