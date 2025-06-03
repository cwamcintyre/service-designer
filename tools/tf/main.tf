# Terraform deployment for multi-container ECS apps with ALB, custom domains, and DynamoDB access

# ---------------------------
# Providers & Variables
# ---------------------------
variable "region" {
  default = "eu-west-2"
}

variable "profile" {}
variable "vpc_id" {}
variable "acm_cert_arn" {}

provider "aws" {
  region = var.region
  profile = var.profile
}

terraform {
  backend "s3" {
    bucket         = "forms-poc-terraform"
    key            = "terraform/state.tfstate"
    region         = "eu-west-2"
    encrypt        = true
  }
}

# ---------------------------
# IAM Roles
# ---------------------------
resource "aws_iam_role" "ecs_task_execution" {
  name = "ecsTaskExecutionRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy" "ecs_dynamodb" {
  name = "ecs-dynamodb-access"
  role = aws_iam_role.ecs_task_execution.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:CreateTable",
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:Query"
        ],
        Resource = "*"
      }
    ]
  })
}

# Add policy to allow ecsTaskExecutionRole to pull images from ECR
resource "aws_iam_role_policy" "ecs_ecr_access" {
  name = "ecs-ecr-access"
  role = aws_iam_role.ecs_task_execution.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage"
        ],
        Resource = "*"
      }
    ]
  })
}

# Add policy to allow ecsTaskExecutionRole to create log streams and write log events
resource "aws_iam_role_policy" "ecs_cloudwatch_logs" {
  name = "ecs-cloudwatch-logs"
  role = aws_iam_role.ecs_task_execution.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Resource = "arn:aws:logs:eu-west-2:090172996104:log-group:/ecs/*"
      }
    ]
  })
}

# ---------------------------
# Internet Gateway Setup
# ---------------------------

# Reference the existing Internet Gateway instead of creating a new one
data "aws_internet_gateway" "main" {
  filter {
    name   = "attachment.vpc-id"
    values = [var.vpc_id]
  }
}

# ---------------------------
# Subnet Setup
# ---------------------------

# Public Subnet
resource "aws_subnet" "public" {
  vpc_id                  = var.vpc_id
  cidr_block              = "172.31.48.0/20" # Adjust CIDR block as needed
  map_public_ip_on_launch = true
  availability_zone       = "${var.region}a" # Adjust for your region

  tags = {
    Name = "Public Subnet"
  }
}

# Add a second public subnet in a different Availability Zone
resource "aws_subnet" "public_az2" {
  vpc_id                  = var.vpc_id
  cidr_block              = "172.31.80.0/20" # Adjust CIDR block as needed
  map_public_ip_on_launch = true
  availability_zone       = "${var.region}b" # Adjust for your region

  tags = {
    Name = "Public Subnet AZ2"
  }
}

# Private Subnet
resource "aws_subnet" "private" {
  vpc_id            = var.vpc_id
  cidr_block        = "172.31.64.0/20" # Adjust CIDR block as needed
  availability_zone = "${var.region}a" # Adjust for your region

  tags = {
    Name = "Private Subnet"
  }
}

# Update the route table to use the existing Internet Gateway
resource "aws_route_table" "public" {
  vpc_id = var.vpc_id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = data.aws_internet_gateway.main.id
  }

  tags = {
    Name = "Public Route Table"
  }
}

# Associate Public Subnet with Public Route Table
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# Route Table for Private Subnet
resource "aws_route_table" "private" {
  vpc_id = var.vpc_id

  tags = {
    Name = "Private Route Table"
  }
}

# Associate Private Subnet with Private Route Table
resource "aws_route_table_association" "private" {
  subnet_id      = aws_subnet.private.id
  route_table_id = aws_route_table.private.id
}

# ---------------------------
# NAT Gateway Setup
# ---------------------------

# Allocate an Elastic IP for the NAT Gateway
resource "aws_eip" "nat" {
  domain = "vpc" # Replaces the deprecated `vpc = true`

  tags = {
    Name = "NAT Gateway EIP"
  }
}

# Create a NAT Gateway in a public subnet
resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public.id # Use the public subnet

  tags = {
    Name = "NAT Gateway"
  }
}

# Update the route table for private subnets to use the NAT Gateway
resource "aws_route" "private_to_nat_gateway" {
  route_table_id         = aws_route_table.private.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.nat.id
}

# ---------------------------
# ECS Cluster
# ---------------------------
resource "aws_ecs_cluster" "this" {
  name = "forms-poc-tf-cluster"
}

# ---------------------------
# ALB
# ---------------------------
resource "aws_lb" "web_alb" {
  name               = "form-web-alb"
  internal           = false
  load_balancer_type = "application"
  subnets            = [aws_subnet.public.id, aws_subnet.public_az2.id] # Use both public subnets
  security_groups    = [aws_security_group.alb_sg.id]
}

resource "aws_security_group" "alb_sg" {
  name   = "alb-sg"
  vpc_id = var.vpc_id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ---------------------------
# ALB Listeners
# ---------------------------
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.web_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "forward"
    target_group_arn = aws_lb_target_group.runner_web.arn
  }
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.web_alb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.acm_cert_arn

  default_action {
    type             = "fixed-response"
    fixed_response {
      content_type = "text/plain"
      message_body = "Not found"
      status_code  = "404"
    }
  }
}

# ---------------------------
# Target Groups & Listener Rules
# ---------------------------
resource "aws_lb_target_group" "runner_web" {
  name        = "runner-web-tg"
  port        = 3000
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id

  health_check {
    path = "/api/health"
  }
}

resource "aws_lb_listener_rule" "runner_web" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.runner_web.arn
  }

  condition {
    host_header {
      values = ["forms.provingtheconcept.org"]
    }
  }
}

resource "aws_lb_target_group" "designer_web" {
  name        = "designer-web-tg"
  port        = 443
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id

  health_check {
    path = "/health"
  }
}

resource "aws_lb_listener_rule" "designer_web" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 110

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.designer_web.arn
  }

  condition {
    host_header {
      values = ["form-builder.provingtheconcept.org"]
    }
  }
}

# Add a target group for form-api-designer
resource "aws_lb_target_group" "form_api_designer" {
  name        = "form-api-designer-tg"
  port        = 9001
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id

  health_check {
    path                = "/api/form/health"
  }
}

# Add a listener rule for form-api-designer
resource "aws_lb_listener_rule" "form_api_designer" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 200

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.form_api_designer.arn
  }

  condition {
    host_header {
      values = ["form-builder-api.provingtheconcept.org"]
    }
  }
}

# ---------------------------
# ECS Task Definitions (simplified inline JSON)
# ---------------------------

# Create CloudWatch log group for runner
resource "aws_cloudwatch_log_group" "runner" {
  name              = "/ecs/runner"
  retention_in_days = 7
}

# Create CloudWatch log group for form-web-designer
resource "aws_cloudwatch_log_group" "form-web-designer" {
  name              = "/ecs/form-web-designer"
  retention_in_days = 7
}

# Create CloudWatch log group for form-web-designer
resource "aws_cloudwatch_log_group" "form-api-designer" {
  name              = "/ecs/form-api-designer"
  retention_in_days = 7
}

resource "aws_ecs_task_definition" "runner" {
  family                   = "runner-task"
  cpu                      = "1024"
  memory                   = "2048"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn            = aws_iam_role.ecs_task_execution.arn

  container_definitions = jsonencode([
    {
      name      = "form-api-runner",
      image     = "090172996104.dkr.ecr.eu-west-2.amazonaws.com/form-api-runner:latest",
      portMappings = [{ containerPort = 9002, hostPort = 9002 }],
      essential = true,
      environment = [
        { name = "EXPRESS_PORT", value = "9002" },
        { name = "EXPRESS_HOST", value = "0.0.0.0" },
        { name = "EXPRESS_ALLOW_ORIGIN", value = "['https://forms.provingtheconcept.org', 'http://localhost:3000']" },
        { name = "DYNAMODB_FORM_TABLE_NAME", value = "FormsTable" },
        { name = "DYNAMODB_APPLICATION_TABLE_NAME", value = "ApplicationsTable" },
        { name = "AWS_REGION", value = "eu-west-2" },
      ],
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/runner"
          awslogs-region        = var.region
          awslogs-stream-prefix = "ecs"
        }
      }
    },
    {
      name      = "form-web-runner",
      image     = "090172996104.dkr.ecr.eu-west-2.amazonaws.com/form-web-runner:latest",
      portMappings = [{ containerPort = 3000, hostPort = 3000 }],
      essential = true,
      environment = [
        { name = "FORM_API", value = "http://localhost:9002/api" },
        { name = "BASE_URL", value = "https://forms.provingtheconcept.org" }
      ],
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/runner"
          awslogs-region        = var.region
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "runner" {
  name            = "runner-service"
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.runner.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  load_balancer {
    target_group_arn = aws_lb_target_group.runner_web.arn
    container_name   = "form-web-runner"
    container_port   = 3000
  }

  network_configuration {
    subnets         = [aws_subnet.private.id]
    security_groups = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }
}

# ---------------------------
# ECS Task + Service for Designer App (same pattern)
# ---------------------------

# ECS Task Definition for form-api-designer
resource "aws_ecs_task_definition" "form_api_designer" {
  family                   = "form-api-designer-task"
  cpu                      = "1024"
  memory                   = "2048"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn            = aws_iam_role.ecs_task_execution.arn

  container_definitions = jsonencode([
    {
      name      = "form-api-designer",
      image     = "090172996104.dkr.ecr.eu-west-2.amazonaws.com/form-api-designer:latest",
      portMappings = [{ containerPort = 9001 }],
      essential = true,
      environment = [
        { name = "EXPRESS_PORT", value = "9001" },
        { name = "EXPRESS_HOST", value = "0.0.0.0" },
        { name = "EXPRESS_ALLOW_ORIGIN", value = "['https://form-builder.provingtheconcept.org']" },
        { name = "DYNAMODB_TABLE_NAME", value = "FormsTable" },
        { name = "AWS_REGION", value = "eu-west-2" }
      ],
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/form-api-designer"
          awslogs-region        = var.region
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
}

# ECS Service for form-api-designer
resource "aws_ecs_service" "form_api_designer" {
  name            = "form-api-designer-service"
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.form_api_designer.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  load_balancer {
    target_group_arn = aws_lb_target_group.form_api_designer.arn
    container_name   = "form-api-designer"
    container_port   = 9001
  }

  network_configuration {
    subnets         = [aws_subnet.private.id]
    security_groups = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }
}

# ECS Task Definition for form-web-designer
resource "aws_ecs_task_definition" "form_web_designer" {
  family                   = "form-web-designer-task"
  cpu                      = "1024"
  memory                   = "2048"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn            = aws_iam_role.ecs_task_execution.arn

  container_definitions = jsonencode([
    {
      name      = "form-web-designer",
      image     = "090172996104.dkr.ecr.eu-west-2.amazonaws.com/form-web-designer:latest",
      portMappings = [{ containerPort = 443 }],
      essential = true,
      environment = [
        { name = "VITE_APP_API_URL", value = "https://form-builder-api.provingtheconcept.org/api" },
        { name = "VITE_APP_RUNNER_URL", value = "https://forms.provingtheconcept.org" },
        { name = "VITE_APP_CHAT_URL", value = "http://localhost:8000" },
        { name = "VITE_OIDC_CLIENT_ID", value = "67j4acvc8d1r5pnuur1197bve0" },
        { name = "VITE_OIDC_CLIENT_AUTHORITY", value = "https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_Ay1h9vXBc" },
        { name = "VITE_OIDC_CALLBACK", value = "https://form-builder.provingtheconcept.org/oidcCallback" }
      ],
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/form-web-designer"
          awslogs-region        = var.region
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
}

# ECS Service for form-web-designer
resource "aws_ecs_service" "form_web_designer" {
  name            = "form-web-designer-service"
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.form_web_designer.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  load_balancer {
    target_group_arn = aws_lb_target_group.designer_web.arn
    container_name   = "form-web-designer"
    container_port   = 443
  }

  network_configuration {
    subnets         = [aws_subnet.private.id]
    security_groups = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }
}

# ---------------------------
# ECS Task Security Group
# ---------------------------
resource "aws_security_group" "ecs_tasks" {
  name   = "ecs-tasks-sg"
  vpc_id = var.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow inbound traffic on port 443
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Replace with specific IPs for better security
  }

  # Allow inbound traffic on port 3000
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Replace with specific IPs for better security
  }

  # Allow inbound traffic on port 3000
  ingress {
    from_port   = 9001
    to_port     = 9001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Replace with specific IPs for better security
  }
}