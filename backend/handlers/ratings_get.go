package handlers

import (
	"backend/helpers"
	"backend/models"
	"context"

	"github.com/aws/aws-lambda-go/events"
)

func handleGetRatings(ctx context.Context, req *events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	recipeId := req.PathParameters["id"]
	lastRecipeId := req.QueryStringParameters["next_recipe"]
	lastUserId := req.QueryStringParameters["next_user"]

	ratings, err := helpers.NewRatingsHelper(ctx).GetRecipeRatings(recipeId, lastRecipeId, lastUserId)
	if err != nil {
		return models.ServerSideErrorResponse("Failed to get recipe ratings, try again.", err), nil
	}

	return models.SuccessfulGetRequestResponse(ratings), nil
}
