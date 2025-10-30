package handlers

import (
	"context"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
)

// VALIDATES USER SIGN UP DETAILS THEN AUTO VERIFIES USER

func HandleAddUser(ctx context.Context, event *events.CognitoEventUserPoolsPreSignup) (interface{}, error) {
	fullname, ok := event.Request.UserAttributes["fullname"]

	if !ok || fullname == "" {
		return nil, fmt.Errorf("No value for fullname provided")
	}

	// auto verify user
	event.Response.AutoConfirmUser = true
	event.Response.AutoVerifyEmail = true

	return event, nil
}
