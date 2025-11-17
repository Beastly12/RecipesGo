package handlers

import (
	"backend/helpers"
	"backend/models"
	"backend/utils"
	"context"

	"github.com/aws/aws-lambda-go/events"
)

func handleGetUsers(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	requestedUserId := req.PathParameters["id"]
	currentUserId := utils.GetAuthUserId(req)

	if currentUserId == "" && requestedUserId == "" {
		return models.UnauthorizedErrorResponse("You need to be signed in to view your profile!"), nil
	}

	if requestedUserId == "" {
		requestedUserId = currentUserId
	}

	user, err := helpers.NewUserHelper(ctx).Get(requestedUserId)
	if err != nil {
		return models.ServerSideErrorResponse("Failed to get uer details!", err), nil
	}

	if currentUserId != "" {
		return models.SuccessfulGetRequestResponse(user, nil), nil
	}

	user.UserStats = models.UserStats{} // to hide stats of other users
	return models.SuccessfulGetRequestResponse(user, nil), nil
}
