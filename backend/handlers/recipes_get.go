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

func getRecipeByUser(lastKey map[string]types.AttributeValue, ctx context.Context, userId string, includePrivateRecipes bool) (events.APIGatewayV2HTTPResponse, error) {
	response, err := helpers.NewRecipeHelper(ctx).GetRecipesByUser(lastKey, userId, includePrivateRecipes)
	if err != nil {
		return models.ServerSideErrorResponse(fmt.Sprintf("Failed to get recipes by user %v", userId), err), nil
	}

	if response == nil {
		return models.SuccessfulGetRequestResponse(nil, nil), nil
	}
	return models.SuccessfulGetRequestResponse(response.Recipes, response.NextKey), nil
}

func handleGetRecipesByUser(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	userId := req.QueryStringParameters["by"]

	if userId == "" {
		return handleGetAllRecipes(ctx, req)
	}

	lastKey, err := models.DecodeLastEvalKey(req.QueryStringParameters["last"])
	if err != nil {
		return models.InvalidRequestErrorResponse("Failed to decode last item key!"), nil
	}
	return getRecipeByUser(lastKey, ctx, userId, false)
}

func handleGetAllRecipes(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	category := req.QueryStringParameters["category"]
	lastKey, err := models.DecodeLastEvalKey(req.QueryStringParameters["last"])
	if err != nil {
		println("Failed to decode last key")
		return models.ServerSideErrorResponse("Failed to decode last key!", err), nil
	}

	result, err := helpers.NewRecipeHelper(ctx).GetRecipes(lastKey, category)
	if err != nil {
		println("Failed to get recipes")
		return models.ServerSideErrorResponse("Failed to get recipes", err), nil
	}

	if result == nil {
		return models.SuccessfulGetRequestResponse(nil, nil), nil
	}

	return models.SuccessfulGetRequestResponse(result.Recipes, result.NextKey), nil
}

func handleGetCurrentUserRecipes(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	currentUserId := utils.GetAuthUserId(req)
	if currentUserId == "" {
		return models.UnauthorizedErrorResponse("You need to be logged in to view your recipes!"), nil
	}

	lastKey, err := models.DecodeLastEvalKey(req.QueryStringParameters["last"])
	if err != nil {
		return models.InvalidRequestErrorResponse("Failed to decode last item key!"), nil
	}
	return getRecipeByUser(lastKey, ctx, currentUserId, true)
}
