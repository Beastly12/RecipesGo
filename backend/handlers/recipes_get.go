package handlers

import (
	"backend/helpers"
	"backend/models"
	"context"

	"github.com/aws/aws-lambda-go/events"
)

func handleGetRecipes(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	lastEvalKey, hasLastId := req.QueryStringParameters["next"]
	if !hasLastId {
		lastEvalKey = ""
	}
	recipes, err := helpers.NewRecipeHelper(ctx).GetAll(lastEvalKey)
	if err != nil {
		return models.ServerSideErrorResponse("", err), nil
	}

	return models.SuccessfulGetRequestResponse(recipes), nil
}
