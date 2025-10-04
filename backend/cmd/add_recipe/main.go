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
	dependencies := utils.GetDynamodbAndCloudfrontInit()
	starter = *handlers.NewAddRecipeHandler(&dependencies)
}

func main() {
	lambda.Start(starter.HandleAddRecipe)
}
