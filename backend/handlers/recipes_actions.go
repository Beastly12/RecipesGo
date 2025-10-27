package handlers

import (
	"backend/models"
	"context"

	"github.com/aws/aws-lambda-go/events"
)

func HandleRecipesActions(ctx context.Context, req *events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	switch req.HTTPMethod {
	case "POST":
		return HandleAddRecipe(ctx, req)
	case "GET":
		return HandleGetRecipes(ctx, req)
	default:
		return models.InvalidRequestErrorResponse("Invalid http method"), nil
	}
}
