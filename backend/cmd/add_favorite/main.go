package main

import (
	"backend/handlers"
	"backend/utils"

	"github.com/aws/aws-lambda-go/lambda"
)

var starter handlers.AddFavoriteDependencies

func init() {
	starter = handlers.AddFavoriteDependencies{
		Dependencies: utils.GetDynamodbAndCloudfrontInit(),
	}
}

func main() {
	lambda.Start(starter.HandleAddToFavorite)
}
