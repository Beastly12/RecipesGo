package handlers

import (
	"backend/models"
	"context"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

type AddRecipeDependencies struct {
	TableName string
	DbClient  *dynamodb.Client
}

type jsonBody struct {
	Name        string   `json:"name"`
	ImageUrl    string   `json:"imageUrl"`
	Description string   `json:"description"`
	Ingredients []string `json:"ingredients"`
}

// adds new recipe to db
func (deps *AddRecipeDependencies) HandleAddRecipe(ctx context.Context, req *events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// TODO
	return models.UnauthorizedErrorResponse(""), nil
}
