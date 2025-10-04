package handlers

import (
	"backend/helpers"
	"backend/models"
	"backend/utils"
	"context"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

type GetRecipesDependencies struct {
	CloudFrontDomainName string
	TableName            string
	DbClient             *dynamodb.Client
}

func NewGetRecipeHandler(dependencies *utils.DynamoAndCloudfront) *GetRecipesDependencies {
	return &GetRecipesDependencies{
		CloudFrontDomainName: dependencies.CloudfrontDomainName,
		TableName:            dependencies.TableName,
		DbClient:             dependencies.DbClient,
	}
}

func (deps *GetRecipesDependencies) HandleGetRecipes(ctx context.Context, req *events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	dbHelper := helpers.NewDynamoHelper(
		deps.TableName,
		deps.CloudFrontDomainName,
		deps.DbClient,
		ctx,
	)

	recipes, err := dbHelper.GetAllRecipes()
	if err != nil {
		return models.ServerSideErrorResponse("", err), nil
	}

	return models.SuccessfulGetRequestResponse(recipes), nil
}
