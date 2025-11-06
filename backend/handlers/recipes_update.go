package handlers

import (
	"backend/helpers"
	"backend/models"
	"backend/utils"
	"context"
	"encoding/json"

	"github.com/aws/aws-lambda-go/events"
)

func handleUpdateRecipe(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	recipeId := req.PathParameters["id"]
	if recipeId == "" {
		return models.InvalidRequestErrorResponse("No recipe id provided!"), nil
	}

	recipeHelper := helpers.NewRecipeHelper(ctx)

	recipe, err := recipeHelper.Get(recipeId)
	if err != nil {
		return models.ServerSideErrorResponse("Failed to get recipe details, try again.", err), nil
	}

	if recipe == nil {
		return models.NotFoundResponse("No such recipe exists!"), nil
	}

	if recipe.AuthorId != utils.GetAuthUserId(req) {
		// naughty naughty!!!
		return models.UnauthorizedErrorResponse("Only the author of a recipe can edit it!"), nil
	}

	var newRecipe models.Recipe
	if err := json.Unmarshal([]byte(req.Body), &newRecipe); err != nil {
		return models.InvalidRequestErrorResponse("Invalid recipe details in body!"), nil
	}

	err = recipeHelper.UpdateRecipe(recipeId, newRecipe)
	if err != nil {
		return models.ServerSideErrorResponse("Failed to update recipe, try again.", err), nil
	}

	return models.SuccessfulRequestResponse("Recipe updated successfully!", false), nil
}
