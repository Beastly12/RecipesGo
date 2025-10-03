package main

import (
	"backend/handlers"
	"context"
	"log"
	"os"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

var (
	dbClient  *dynamodb.Client
	tableName string
	starter   handlers.GetRecipesDependencies
)

func init() {
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		log.Fatalf("unable to load SDK config: %v", err)
	}

	// load dynamodb stuff
	dbClient = dynamodb.NewFromConfig(cfg)
	tableName = os.Getenv("MAIN_TABLE")
	if tableName == "" {
		panic("MAIN_TABLE environment variable not set")
	}

	starter = handlers.GetRecipesDependencies{
		TableName: tableName,
		DbClient:  dbClient,
	}
}

func main() {
	lambda.Start(starter.HandleGetRecipes)
}
