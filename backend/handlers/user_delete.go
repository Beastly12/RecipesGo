package handlers

import (
	"backend/helpers"
	"backend/models"
	"backend/utils"
	"context"

	"github.com/aws/aws-lambda-go/events"
)

func handleDeleteUser(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	userId := utils.GetAuthUserId(req)
	if userId == "" {
		return models.UnauthorizedErrorResponse("You need to be logged in to do this!"), nil
	}

	err := helpers.NewUserHelper(ctx).DeleteUser(userId)
	if err != nil {
		return models.ServerSideErrorResponse("Failed to delete user!", err), nil
	}

	return models.SuccessfulRequestResponse("Bye bye", false), nil
}
