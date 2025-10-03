package handlers

import (
	"backend/helpers"
	"backend/models"
	"context"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

type GetRecipesDependencies struct {
	TableName string
	DbClient  *dynamodb.Client
}

func (deps *GetRecipesDependencies) HandleGetRecipes(ctx context.Context, req *events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	dbHelper := helpers.DynamoHelper{
		TableName: deps.TableName,
		DbClient:  deps.DbClient,
		Ctx:       ctx,
	}

	recipes, err := dbHelper.GetAllRecipes()
	if err != nil {
		return models.ServerSideErrorResponse("", err), nil
	}

	return models.SuccessfulGetRequestResponse(recipes), nil
}
