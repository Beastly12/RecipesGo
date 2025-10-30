package handlers

import (
	"context"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
)

// VALIDATES USER SIGN UP DETAILS THEN AUTO VERIFIES USER

func HandleAddUser(ctx context.Context, event *events.CognitoEventUserPoolsPreSignup) (interface{}, error) {
	name, ok := event.Request.UserAttributes["name"]

	if !ok || name == "" {
		return nil, fmt.Errorf("No value for name provided")
	}

	// auto verify user
	event.Response.AutoConfirmUser = true
	event.Response.AutoVerifyEmail = true

	return event, nil
}
