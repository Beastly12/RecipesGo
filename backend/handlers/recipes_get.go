package handlers

import (
	"backend/helpers"
	"backend/models"
	"backend/utils"
	"context"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func handleGetRecipesByUser(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	userId := req.QueryStringParameters["by"]
	currentUserId := utils.ForceGetAuthUserId(req)

	if userId == "" {
		return handleGetRecipes(ctx, req)
	}

	lastKey, err := models.DecodeLastEvalKeys(req.QueryStringParameters["last"])
	if err != nil {
		return models.InvalidRequestErrorResponse("Failed to decode last item key!"), nil
	}

	response, err := helpers.NewRecipeHelper(ctx).GetRecipesByUser(lastKey[0], userId, currentUserId == userId)
	if err != nil {
		return models.ServerSideErrorResponse(fmt.Sprintf("Failed to get recipes by user %v", userId), err), nil
	}

	if response == nil {
		return models.SuccessfulGetRequestResponse(nil, nil), nil
	}
	return models.SuccessfulGetRequestResponse(response.Recipes, response.NextKey), nil
}

func handleGetRecipes(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	userId := utils.ForceGetAuthUserId(req)
	category := req.QueryStringParameters["category"]
	lastKey, err := models.DecodeLastEvalKeys(req.QueryStringParameters["last"])
	if err != nil {
		println("failed to decode last key")
		return models.ServerSideErrorResponse("Failed to decode last key!", err), nil
	}

	var privateLastKey map[string]types.AttributeValue
	if len(lastKey) > 1 {
		privateLastKey = lastKey[1]
	}

	var publicLastKey map[string]types.AttributeValue
	if len(lastKey) > 0 {
		publicLastKey = lastKey[0]
	}

	recipeHelper := helpers.NewRecipeHelper(ctx)
	publicRecipeResults, err := recipeHelper.GetRecipes(publicLastKey, category)
	if err != nil {
		return models.ServerSideErrorResponse("Failed to get recipes.", err), nil
	}

	privateRecipeResults, err := recipeHelper.GetPrivateRecipes(privateLastKey, category, userId)
	if err != nil {
		return models.ServerSideErrorResponse("Failed to get recipes", err), nil
	}

	if publicRecipeResults == nil && privateRecipeResults == nil {
		return models.SuccessfulGetRequestResponse(nil, nil), nil
	}

	if publicRecipeResults == nil {
		return models.SuccessfulGetRequestResponse(privateRecipeResults.Recipes, privateRecipeResults.NextKey), nil
	} else if privateRecipeResults == nil {
		return models.SuccessfulGetRequestResponse(publicRecipeResults.Recipes, publicRecipeResults.NextKey), nil
	}

	publicRecipeResults.Recipes = append(publicRecipeResults.Recipes, privateRecipeResults.Recipes...)

	return models.SuccessfulGetRequestResponse(publicRecipeResults.Recipes, publicRecipeResults.NextKey, privateRecipeResults.NextKey), nil
}
