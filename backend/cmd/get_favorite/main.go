package main

import (
	"backend/handlers"
	"backend/utils"

	"github.com/aws/aws-lambda-go/lambda"
)

var starter handlers.GetFavoriteDependencies

func init() {
	starter = handlers.GetFavoriteDependencies{
		Dependencies: utils.GetDynamodbAndCloudfrontInit(),
	}
}

func main() {
	lambda.Start(starter.HandleGetFavorite)
}
