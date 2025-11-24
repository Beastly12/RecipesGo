package handlers

import (
	"backend/helpers"
	"backend/models"
	"backend/utils"
	"context"

	"github.com/aws/aws-lambda-go/events"
)

func handleRemoveDisplayPicture(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	userId := utils.GetAuthUserId(req)
	if userId == "" {
		return models.UnauthorizedErrorResponse("You need to be logged in to do this!"), nil
	}

	err := helpers.NewUserHelper(ctx).RemoveUserPicture(userId)
	if err != nil {
		return models.ServerSideErrorResponse("Failed to remove display picture!", err), nil
	}

	return models.SuccessfulRequestResponse("Display picture removed!", false), nil
}
