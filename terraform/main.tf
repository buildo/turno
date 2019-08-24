provider "aws" {
  region = "eu-west-1"
}

provider "archive" {}

locals {
  project_name    = "turno"
  lambda_zip_path = "${path.module}/lambda.zip"
}

resource "aws_iam_role" "iam_role" {
  name = "${local.project_name}_iam_role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF

}

resource "null_resource" "ts-build" {
  triggers = {
    timestamp = timestamp()
  }
  provisioner "local-exec" {
    working_dir = "../code"
    command     = "yarn install && yarn build && cp -r node_modules build/"
  }
}

data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = "${path.module}/../code/build"
  output_path = local.lambda_zip_path

  depends_on = [null_resource.ts-build]
}

data "aws_ssm_parameter" "slack_api_key" {
  name = "/${local.project_name}/slack_api_token"
}

data "aws_ssm_parameter" "metro_db_writer_password" {
  name = "/${local.project_name}/metro_db_writer_password"
}

resource "aws_lambda_function" "lambda" {
  filename         = local.lambda_zip_path
  function_name    = local.project_name
  role             = aws_iam_role.iam_role.arn
  handler          = "index.handler"
  source_code_hash = data.archive_file.lambda.output_base64sha256
  runtime          = "nodejs10.x"
  environment {
    variables = {
      SLACK_API_KEY = data.aws_ssm_parameter.slack_api_key.value
      PGHOST        = "metro.c4vk4pxr1ldu.eu-central-1.rds.amazonaws.com"
      PGUSER        = "writer"
      PGPASSWORD    = data.aws_ssm_parameter.metro_db_writer_password.value
      PGDATABASE    = "metro"
      PGPORT        = "5432"
    }
  }

  depends_on = ["aws_iam_role_policy_attachment.lambda_logs", "aws_cloudwatch_log_group.lambda"]
}

resource "aws_api_gateway_rest_api" "gateway" {
  name = local.project_name
}

resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.gateway.id
  parent_id   = aws_api_gateway_rest_api.gateway.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy" {
  rest_api_id   = aws_api_gateway_rest_api.gateway.id
  resource_id   = aws_api_gateway_resource.proxy.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda" {
  rest_api_id             = aws_api_gateway_rest_api.gateway.id
  resource_id             = aws_api_gateway_method.proxy.resource_id
  http_method             = aws_api_gateway_method.proxy.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.lambda.invoke_arn
}

resource "aws_api_gateway_method" "proxy_root" {
  rest_api_id   = aws_api_gateway_rest_api.gateway.id
  resource_id   = aws_api_gateway_rest_api.gateway.root_resource_id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda_root" {
  rest_api_id             = aws_api_gateway_rest_api.gateway.id
  resource_id             = aws_api_gateway_method.proxy_root.resource_id
  http_method             = aws_api_gateway_method.proxy_root.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.lambda.invoke_arn
}

resource "aws_api_gateway_deployment" "lambda" {
  rest_api_id = aws_api_gateway_rest_api.gateway.id
  stage_name  = local.project_name

  depends_on = [
    aws_api_gateway_integration.lambda,
    aws_api_gateway_integration.lambda_root,
  ]
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda.arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_deployment.lambda.execution_arn}/*/*"
}

resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/${local.project_name}"
  retention_in_days = 14
}

resource "aws_iam_policy" "lambda_logging" {
  name        = "lambda_logging"
  path        = "/"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = "${aws_iam_role.iam_role.name}"
  policy_arn = "${aws_iam_policy.lambda_logging.arn}"
}

resource "aws_cloudwatch_event_rule" "event_rule" {
  name                = "TurnoDailyChores"
  description         = "Publish turno daily chores"
  schedule_expression = "cron(10 08 ? * MON-FRI *)"
}

resource "aws_cloudwatch_event_target" "event_target" {
  rule  = "${aws_cloudwatch_event_rule.event_rule.name}"
  arn   = "${aws_lambda_function.lambda.arn}"
  input = "{\"body\": \"{\\\"type\\\": \\\"daily_chores\\\"}\"}"
}

resource "aws_lambda_permission" "event_rule_permission" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.lambda.function_name}"
  principal     = "events.amazonaws.com"
  source_arn    = "${aws_cloudwatch_event_rule.event_rule.arn}"
}
