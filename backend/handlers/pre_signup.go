package handlers

import (
	"context"

	"github.com/aws/aws-lambda-go/events"
)

// VALIDATES USER SIGN UP DETAILS THEN AUTO VERIFIES USER

type PreSignupDependencies struct {
}

func (deps *PreSignupDependencies) HandleAddUser(ctx context.Context, event *events.CognitoEventUserPoolsPreSignup) (interface{}, error) {

	// auto verify user
	event.Response.AutoConfirmUser = true
	event.Response.AutoVerifyEmail = true

	return event, nil
}
