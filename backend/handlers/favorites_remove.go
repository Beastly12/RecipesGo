package handlers

import (
	"backend/helpers"
	"backend/models"
	"backend/utils"
	"context"

	"github.com/aws/aws-lambda-go/events"
)

func handleRemoveFavorite(ctx context.Context, req *events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	doomedRecipeId := req.PathParameters["id"]
	if doomedRecipeId == "" {
		return models.InvalidRequestErrorResponse("No recipeId provided in request body"), nil
	}

	// get current logged in user id
	userid := utils.GetAuthUserId(req)
	if userid == "" {
		return models.UnauthorizedErrorResponse("You have to be logged in to do this"), nil
	}

	// remove favorite from db
	err := helpers.NewFavoritesHelper(ctx).Remove(userid, doomedRecipeId)
	if err != nil {
		return models.ServerSideErrorResponse("", err), nil
	}

	return models.SuccessfulRequestResponse("Recipe removed from favorites!", false), nil
}
