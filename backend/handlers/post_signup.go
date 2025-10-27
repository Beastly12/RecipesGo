package handlers

import (
	"backend/helpers"
	"backend/models"
	"context"

	"github.com/aws/aws-lambda-go/events"
)

// ADDS NEW USER TO DB AFTER REGISTRATION

func HandlePostSignup(ctx context.Context, event *events.CognitoEventUserPoolsPostConfirmation) (interface{}, error) {

	// only continue if triggered by sign up complete
	if event.TriggerSource != "PostConfirmation_ConfirmSignUp" {
		return event, nil
	}

	// get user id and nickname
	userid := event.Request.UserAttributes["sub"]
	nickname := event.Request.UserAttributes["nickname"]

	// create new user
	newUser := models.NewUser(
		userid,
		nickname,
	)

	// add new user to db
	dynamoHelper := helpers.NewDynamoHelper(
		ctx,
	)

	err := dynamoHelper.AddNewUser(newUser)

	if err != nil {
		return nil, err
	}

	return event, nil
}
