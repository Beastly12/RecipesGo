package handlers

import (
	"backend/models"
	"context"

	"github.com/aws/aws-lambda-go/events"
)

func HandleRecipesActions(ctx context.Context, req *events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	switch req.HTTPMethod {
	case "POST":
		return handleAddRecipe(ctx, req)

	case "GET":
		return handleGetRecipes(ctx, req)

	case "DELETE":
		return handleDeleteRecipe(ctx, req)

	default:
		return models.InvalidRequestErrorResponse("Invalid http method"), nil
	}
}
