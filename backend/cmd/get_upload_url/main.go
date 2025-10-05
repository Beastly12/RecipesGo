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
	starter = handlers.GetUploadUrlDependencies{
		Dependencies: utils.GetObjectStorageInit(),
	}
}

func main() {
	lambda.Start(starter.HandleGetUploadUrl)
}
