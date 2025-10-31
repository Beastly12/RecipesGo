package handlers

import (
	"backend/helpers"
	"backend/models"
	"context"

	"github.com/aws/aws-lambda-go/events"
)

func handleDeleteRecipe(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	// favorites/{id}
	recipeId := req.PathParameters["id"]
	if recipeId == "" {
		return models.InvalidRequestErrorResponse("no recipe id provided!"), nil
	}

	err := helpers.NewRecipeHelper(ctx).Delete(recipeId)
	if err != nil {
		return models.ServerSideErrorResponse("Failed to delete recipe, try again.", err), nil
	}

	return models.SuccessfulRequestResponse("Recipe deleted successfully", false), nil
}
