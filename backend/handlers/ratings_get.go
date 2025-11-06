package handlers

import (
	"backend/helpers"
	"backend/models"
	"context"

	"github.com/aws/aws-lambda-go/events"
)

func handleGetRatings(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	recipeId := req.PathParameters["id"]
	if recipeId == "" {
		return models.InvalidRequestErrorResponse("No recipe id provided!"), nil
	}

	lastKey, err := models.DecodeLastEvalKey(req.QueryStringParameters["last"])
	if err != nil {
		return models.InvalidRequestErrorResponse("Failed to decode last evaluated key!"), nil
	}

	response, err := helpers.NewRatingsHelper(ctx).GetRecipeRatings(recipeId, lastKey)
	if err != nil {
		return models.ServerSideErrorResponse("Failed to get ratings for this recipe, try again.", err), nil
	}

	if response == nil {
		return models.SuccessfulGetRequestResponse(nil, nil), nil
	}

	return models.SuccessfulGetRequestResponse(response.Ratings, response.LastKey), nil
}
