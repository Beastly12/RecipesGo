package handlers

import (
	"backend/models"
	"context"

	"github.com/aws/aws-lambda-go/events"
)

func HandleRecipesActions(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	switch req.RequestContext.HTTP.Method {
	case "POST":
		return handleAddRecipe(ctx, req)

	case "GET":
		_, exists := req.PathParameters["id"]
		if exists {
			return handleGetRecipeDetails(ctx, req)
		}
		return handleGetRecipes(ctx, req)

	case "DELETE":
		return handleDeleteRecipe(ctx, req)

	default:
		return models.InvalidRequestErrorResponse("Invalid http method"), nil
	}
}
