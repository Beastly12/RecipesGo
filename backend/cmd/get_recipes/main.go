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
	deps := utils.GetDynamodbAndObjStorageInit()
	starter = *handlers.NewGetRecipeHandler(&deps)
}

func main() {
	lambda.Start(starter.HandleGetRecipes)
}
