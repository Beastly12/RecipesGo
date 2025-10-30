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

	userid := event.Request.UserAttributes["sub"]
	fullname := event.Request.UserAttributes["fullname"]

	// create new user
	newUser := models.NewUser(
		userid,
		fullname,
	)

	err := helpers.NewUserHelper(ctx).Add(newUser)

	if err != nil {
		return nil, err
	}

	return event, nil
}
