package handlers

import (
	"backend/helpers"
	"backend/models"
	"backend/utils"
	"context"

	"github.com/aws/aws-lambda-go/events"
)

type GetRecipesDependencies struct {
	Dependencies utils.DynamoAndCloudfront
}

func (this *GetRecipesDependencies) HandleGetRecipes(ctx context.Context, req *events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	dbHelper := helpers.NewDynamoHelper(&this.Dependencies, ctx)

	recipes, err := dbHelper.GetAllRecipes()
	if err != nil {
		return models.ServerSideErrorResponse("", err), nil
	}

	return models.SuccessfulGetRequestResponse(recipes), nil
}
