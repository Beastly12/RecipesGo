package handlers

import (
	"backend/helpers"
	"backend/models"
	"backend/utils"
	"context"

	"github.com/aws/aws-lambda-go/events"
)

func handleGetFavorite(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	userid := utils.GetAuthUserId(req)
	lastRecipeId := req.QueryStringParameters["next"]

	if userid != "" {
		return models.UnauthorizedErrorResponse("You need to be logged in to view your favorites"), nil
	}

	favs, err := helpers.NewFavoritesHelper(ctx).GetAll(userid, lastRecipeId)
	if err != nil {
		return models.ServerSideErrorResponse("", err), nil
	}

	return models.SuccessfulGetRequestResponse(favs), nil
}
