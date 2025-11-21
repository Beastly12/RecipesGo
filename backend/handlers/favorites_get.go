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
	last, err := models.DecodeLastEvalKeys(req.QueryStringParameters["last"])
	if err != nil {
		return models.InvalidRequestErrorResponse("Failed to decode last evaluated item key!"), nil
	}

	if userid == "" {
		return models.UnauthorizedErrorResponse("You need to be logged in to view your favorites"), nil
	}

	result, err := helpers.NewFavoritesHelper(ctx).GetAll(userid, last[0])
	if err != nil {
		return models.ServerSideErrorResponse("Failed to get favorites, try again.", err), nil
	}

	return models.SuccessfulGetRequestResponse(result.Favorites, result.NextKey), nil
}
