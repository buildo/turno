terraform {
  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "buildo"
    workspaces {
      name = "turno"
    }
  }
}
