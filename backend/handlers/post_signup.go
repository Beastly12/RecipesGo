package handlers

import (
	"backend/helpers"
	"backend/models"
	"backend/utils"
	"context"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

// ADDS NEW USER TO DB AFTER REGISTRATION

type PostSignupDependencies struct {
	CloudFrontDomainName string
	BucketName           string
	TableName            string
	DbClient             *dynamodb.Client
}

func NewPostSignupHandler(dependencies *utils.DynamodbAndObjStorage) *PostSignupDependencies {
	return &PostSignupDependencies{
		CloudFrontDomainName: dependencies.CloudfrontDomainName,
		BucketName:           dependencies.BucketName,
		TableName:            dependencies.TableName,
		DbClient:             dependencies.DbClient,
	}
}

func (deps *PostSignupDependencies) HandlePostSignup(ctx context.Context, event *events.CognitoEventUserPoolsPostConfirmation) (interface{}, error) {

	if event.TriggerSource != "PostConfirmation_ConfirmSignUp" {
		return event, nil
	}

	userid := event.Request.UserAttributes["sub"]
	nickname := event.Request.UserAttributes["nickname"]

	newUser := models.NewUser(
		userid,
		nickname,
	)

	dynamoHelper := helpers.NewDynamoHelper(
		deps.TableName,
		deps.CloudFrontDomainName,
		deps.BucketName,
		deps.DbClient,
		ctx,
	)

	err := dynamoHelper.AddNewUser(newUser)

	if err != nil {
		return nil, err
	}

	return event, nil
}
