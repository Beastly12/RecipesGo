package handlers

import (
	"backend/helpers"
	"backend/models"
	"backend/utils"
	"context"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
)

func handleGetRecipes(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	utils.BasicLog("executing get recipes function", nil)
	utils.BasicLog("getting last evaluated key, last parameter is...", req.QueryStringParameters["last"])
	lastKey, err := models.DecodeLastEvalKey(req.QueryStringParameters["last"])
	if err != nil {
		utils.BasicLog("failed to get last evaluated key", err)
		return models.InvalidRequestErrorResponse("Failed to decode last item key!"), nil
	}
	utils.BasicLog("gotten last evaluated key successfully", lastKey)
	category, _ := req.QueryStringParameters["category"]
	utils.BasicLog("recipes category provided", category)

	response, err := helpers.NewRecipeHelper(ctx).GetAllRecipes(lastKey, category)
	if err != nil {
		utils.BasicLog("failed to get all recipes", err)
		return models.ServerSideErrorResponse(fmt.Sprintf("Failed to get recipes in category %v", category), err), nil
	}

	if response.Recipes == nil {
		utils.BasicLog("no recipes found exiting function", nil)
		return models.SuccessfulGetRequestResponse(nil, nil), nil
	}

	utils.BasicLog("recipes gotten successfully", response)
	utils.BasicLog("end of function", nil)

	return models.SuccessfulGetRequestResponse(response.Recipes, response.NextKey), nil
}
