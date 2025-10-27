package handlers

import (
	"backend/helpers"
	"backend/models"
	"context"

	"github.com/aws/aws-lambda-go/events"
)

func HandleGetRecipes(ctx context.Context, req *events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	dbHelper := helpers.NewDynamoHelper(ctx)

	recipes, err := dbHelper.GetAllRecipes()
	if err != nil {
		return models.ServerSideErrorResponse("", err), nil
	}

	return models.SuccessfulGetRequestResponse(recipes), nil
}
