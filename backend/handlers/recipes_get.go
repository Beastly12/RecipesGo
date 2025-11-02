package handlers

import (
	"backend/helpers"
	"backend/models"
	"context"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
)

func handleGetRecipes(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	lastKey, err := models.DecodeLastEvalKey(req.QueryStringParameters["last"])
	if err != nil {
		return models.InvalidRequestErrorResponse("Failed to decode last item key!"), nil
	}
	category, _ := req.QueryStringParameters["category"]

	response, err := helpers.NewRecipeHelper(ctx).GetAllRecipes(lastKey, category)
	if err != nil {
		return models.ServerSideErrorResponse(fmt.Sprintf("Failed to get recipes in category %v", category), err), nil
	}

	return models.SuccessfulGetRequestResponse(response.Recipes, response.NextKey), nil
}
