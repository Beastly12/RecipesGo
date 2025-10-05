package main

import (
	"backend/handlers"
	"backend/utils"

	"github.com/aws/aws-lambda-go/lambda"
)

var starter handlers.AddFavorite

func init() {
	deps := utils.GetDynamodbAndCloudfrontInit()
	starter = *handlers.NewAddFavorite(&deps)
}

func main() {
	lambda.Start(starter.HandleAddToFavorite)
}
