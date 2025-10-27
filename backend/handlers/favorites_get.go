package handlers

import (
	"backend/helpers"
	"backend/models"
	"backend/utils"
	"context"

	"github.com/aws/aws-lambda-go/events"
)

func HandleGetFavorite(ctx context.Context, req *events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
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
