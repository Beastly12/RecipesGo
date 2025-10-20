package main

import (
	"backend/handlers"
	"backend/utils"

	"github.com/aws/aws-lambda-go/lambda"
)

var starter handlers.RemoveFavoriteDependencies

func init() {
	starter = handlers.RemoveFavoriteDependencies{
		Dependencies: utils.GetDynamodbAndCloudfrontInit(),
	}
}

func main() {
	lambda.Start(starter.HandleRemoveFavorite)
}
