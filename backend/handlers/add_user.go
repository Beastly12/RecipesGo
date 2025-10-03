package handlers

import (
	"backend/helpers"
	"backend/models"
	"context"
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

// ADDS NEW USER TO DB AFTER REGISTRATION

type AddUserDependencies struct {
	TableName string
	DbClient  *dynamodb.Client
}

func (deps *AddUserDependencies) HandleAddUser(ctx context.Context, event *events.CognitoEventUserPoolsPostConfirmation) (interface{}, error) {
	// this function should only run if it is trigger by signup confirm
	if event.TriggerSource != "PostConfirmation_ConfirmSignUp" {
		return event, nil
	}

	userid := event.Request.UserAttributes["sub"]
	nickname := event.Request.UserAttributes["nickname"]

	log.Println("found user id " + userid + " found nickname " + nickname)

	newUser := models.NewUser(
		userid,
		nickname,
	).ToDatabaseFormat()

	dynamoHelper := helpers.UserDynamoHelper{
		TableName: deps.TableName,
		DbClient:  deps.DbClient,
		Ctx:       ctx,
	}

	err := dynamoHelper.AddNewUser(newUser)

	if err != nil {
		return nil, err
	}

	return event, nil
}
