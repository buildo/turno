# Turno

## Deploy

### Prerequisites

1. Create an Terraform account, if you don't have one https://app.terraform.io/account/new
2. Ask Gabriele to be added to the buildo organization
3. Login here: https://app.terraform.io/app
4. User settings > tokens
5. Create a new token
6. Create a `.terraformrc` file in your home directory, with the following format:

```
credentials "app.terraform.io" {
  token = "YOUR_TOKEN"
}
```

Read more here: https://www.terraform.io/docs/commands/cli-config.html

### How to deploy

```bash
cd terraform

# The following two commands require AWS credentials, you can use e.g., aws-vault exec
terraform init # This will work only if you correctly setup your app.terraform.io token
terraform apply
```
