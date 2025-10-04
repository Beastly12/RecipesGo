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
	deps := utils.GetDynamodbAndCloudfrontInit()
	starter = *handlers.NewPostSignupHandler(&deps)
}

func main() {
	lambda.Start(starter.HandlePostSignup)
}
