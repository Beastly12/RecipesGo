package main

import (
	"backend/handlers"

	"github.com/aws/aws-lambda-go/lambda"
)

var (
	starter handlers.PreSignupDependencies
)

func init() {
	starter = handlers.PreSignupDependencies{}
}

func main() {
	lambda.Start(starter.HandleAddUser)
}
