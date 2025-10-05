package handlers

import (
	"context"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
)

// VALIDATES USER SIGN UP DETAILS THEN AUTO VERIFIES USER

type PreSignupDependencies struct {
}

func (deps *PreSignupDependencies) HandleAddUser(ctx context.Context, event *events.CognitoEventUserPoolsPreSignup) (interface{}, error) {

	nickname, ok := event.Request.UserAttributes["nickname"]

	if !ok || nickname == "" {
		return nil, fmt.Errorf("No value for nickname provided")
	}

	// auto verify user
	event.Response.AutoConfirmUser = true
	event.Response.AutoVerifyEmail = true

	return event, nil
}
