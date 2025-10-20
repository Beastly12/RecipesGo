package main

import (
	"backend/handlers"
	"backend/utils"

	"github.com/aws/aws-lambda-go/lambda"
)

var (
	starter handlers.AddRecipeDependencies
)

func init() {
	starter = handlers.AddRecipeDependencies{
		Dependencies: utils.GetDynamodbAndCloudfrontInit(),
	}
}

func main() {
	lambda.Start(starter.HandleAddRecipe)
}
