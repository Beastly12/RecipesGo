package handlers

import (
	"backend/helpers"
	"backend/models"
	"backend/utils"
	"context"

	"github.com/aws/aws-lambda-go/events"
)

func handleGetRecipeDetails(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	utils.BasicLog("Executing get recipes details...", nil)
	recipeId := req.PathParameters["id"]
	if recipeId == "" {
		utils.BasicLog("No recipe id found", req)
		return models.InvalidRequestErrorResponse("No recipe id provided!"), nil
	}

	recipeHelper := helpers.NewRecipeHelper(ctx)

	response, err := recipeHelper.Get(recipeId)
	if err != nil {
		utils.BasicLog("Failed to get recipe details!", err)
		return models.ServerSideErrorResponse("Failed to get recipe details, try again.", err), nil
	}

	err = recipeHelper.IncreaseViewCount(*response)
	if err != nil {
		return models.ServerSideErrorResponse("Failed to increase view count!", err), nil
	}

	utils.BasicLog("Recipe details gotten successfully! Ending function execution", response)
	return models.SuccessfulGetRequestResponse(response, nil), nil
}
