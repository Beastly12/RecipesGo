package handlers

import (
	"backend/helpers"
	"backend/models"
	"context"
	"encoding/json"

	"github.com/aws/aws-lambda-go/events"
)

func handleUpdateRecipe(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	recipeId := req.PathParameters["id"]
	if recipeId == "" {
		return models.InvalidRequestErrorResponse("No recipe id provided!"), nil
	}

	var newRecipe models.Recipe
	if err := json.Unmarshal([]byte(req.Body), &newRecipe); err != nil {
		return models.InvalidRequestErrorResponse("Invalid recipe details in body!"), nil
	}

	err := helpers.NewRecipeHelper(ctx).UpdateRecipe(recipeId, newRecipe)
	if err != nil {
		return models.ServerSideErrorResponse("Failed to update recipe, try again.", err), nil
	}

	return models.SuccessfulRequestResponse("Recipe updated successfully!", false), nil
}
