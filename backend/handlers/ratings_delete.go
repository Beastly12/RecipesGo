package handlers

import (
	"backend/helpers"
	"backend/models"
	"backend/utils"
	"context"

	"github.com/aws/aws-lambda-go/events"
)

func handleDeleteRating(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	doomedRatingRecipeId := req.PathParameters["id"]

	if doomedRatingRecipeId == "" {
		return models.InvalidRequestErrorResponse("Invalid recipe id provided!"), nil
	}

	userId := utils.GetAuthUserId(req)
	if userId == "" {
		return models.UnauthorizedErrorResponse("You need to be logged in to do this!"), nil
	}

	err := helpers.NewRatingsHelper(ctx).RemoveRating(doomedRatingRecipeId, userId)
	if err != nil {
		return models.ServerSideErrorResponse("Failed to remove rating, try again.", err), nil
	}

	return models.SuccessfulRequestResponse("Remove rating successfully!", false), nil
}
