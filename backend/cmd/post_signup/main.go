package main

import (
	"backend/handlers"
	"backend/utils"

	"github.com/aws/aws-lambda-go/lambda"
)

var (
	starter handlers.PostSignupDependencies
)

func init() {
	starter = handlers.PostSignupDependencies{
		Dependencies: utils.GetDynamodbAndCloudfrontInit(),
	}
}

func main() {
	lambda.Start(starter.HandlePostSignup)
}
