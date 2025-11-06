package handlers

import (
	"backend/helpers"
	"backend/models"
	"backend/utils"
	"context"

	"github.com/aws/aws-lambda-go/events"
)

func handleDeleteRecipe(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	curUserId := utils.GetAuthUserId(req)
	if curUserId == "" {
		return models.UnauthorizedErrorResponse("You need to be logged in to do this!"), nil
	}
	recipeId := req.PathParameters["id"]
	if recipeId == "" {
		return models.InvalidRequestErrorResponse("no recipe id provided!"), nil
	}

	recipeHelper := helpers.NewRecipeHelper(ctx)

	recipe, err := recipeHelper.Get(recipeId)
	if err != nil {
		return models.ServerSideErrorResponse("Failed to get recipe details!", err), nil
	}
	if recipe == nil {
		return models.NotFoundResponse("No such recipe exists, try again!"), nil
	}

	if recipe.AuthorId != curUserId {
		return models.UnauthorizedErrorResponse("Only the person that created a recipe can delete it!"), nil
	}

	err = recipeHelper.Delete(recipeId)
	if err != nil {
		return models.ServerSideErrorResponse("Failed to delete recipe, try again.", err), nil
	}

	return models.SuccessfulRequestResponse("Recipe deleted successfully", false), nil
}
