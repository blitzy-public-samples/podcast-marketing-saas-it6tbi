# Requirement addressed: 7.5 Deployment Architecture/Cloud Infrastructure - Networking Infrastructure
# This file defines the input variables for configuring the networking components such as VPCs, 
# subnets, and routing tables required for the deployment of the SaaS platform.

variable "vpc_cidr_block" {
  description = "The CIDR block for the VPC"
  type        = string
  
  # Default CIDR block provides a /16 network with 65,536 IP addresses
  default     = "10.0.0.0/16"
  
  validation {
    condition     = can(cidrhost(var.vpc_cidr_block, 0))
    error_message = "The vpc_cidr_block must be a valid IPv4 CIDR block."
  }
}

variable "availability_zones" {
  description = "List of availability zones for subnet distribution"
  type        = list(string)
  
  validation {
    condition     = length(var.availability_zones) > 0
    error_message = "At least one availability zone must be specified."
  }
  
  validation {
    condition     = alltrue([for az in var.availability_zones : can(regex("^[a-z]{2}-[a-z]+-[0-9][a-z]$", az))])
    error_message = "Availability zones must be in the format: region-az, e.g., us-east-1a."
  }
}

variable "subnet_cidr_blocks" {
  description = "List of CIDR blocks for the subnets, one per availability zone"
  type        = list(string)
  
  validation {
    condition     = length(var.subnet_cidr_blocks) > 0
    error_message = "At least one subnet CIDR block must be specified."
  }
  
  validation {
    condition     = alltrue([for cidr in var.subnet_cidr_blocks : can(cidrhost(cidr, 0))])
    error_message = "Each subnet CIDR block must be a valid IPv4 CIDR block."
  }
  
  validation {
    condition     = alltrue([for cidr in var.subnet_cidr_blocks : tonumber(split("/", cidr)[1]) >= 16 && tonumber(split("/", cidr)[1]) <= 28])
    error_message = "Subnet CIDR blocks must have a prefix length between /16 and /28."
  }
}