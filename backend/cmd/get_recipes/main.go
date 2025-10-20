package main

import (
	"backend/handlers"
	"backend/utils"

	"github.com/aws/aws-lambda-go/lambda"
)

var (
	starter handlers.GetRecipesDependencies
)

func init() {
	starter = handlers.GetRecipesDependencies{
		Dependencies: utils.GetDynamodbAndCloudfrontInit(),
	}
}

func main() {
	lambda.Start(starter.HandleGetRecipes)
}
