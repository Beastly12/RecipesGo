package handlers

import (
	"backend/helpers"
	"backend/models"
	"context"

	"github.com/aws/aws-lambda-go/events"
)

func handleSearchRecipe(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	searchStr := req.QueryStringParameters["recipe"]
	if len(searchStr) < 1 {
		return models.SuccessfulGetRequestResponse([]models.Recipe{}, nil), nil
	}

	searchResult, err := helpers.NewRecipeHelper(ctx).SearchRecipe(searchStr)
	if err != nil {
		return models.ServerSideErrorResponse("Failed to search recipes!", err), nil
	}

	return models.SuccessfulGetRequestResponse(searchResult, nil), nil
}
