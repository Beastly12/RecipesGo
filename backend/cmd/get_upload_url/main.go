package main

import (
	"backend/handlers"
	"backend/utils"

	"github.com/aws/aws-lambda-go/lambda"
)

var (
	starter handlers.GetUploadUrlDependencies
)

func init() {
	deps := utils.GetObjectStorageInit()
	starter = *handlers.NewGetUploadUrlHandler(&deps)
}

func main() {
	lambda.Start(starter.HandleGetUploadUrl)
}
