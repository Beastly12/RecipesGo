package handlers

import (
	"backend/helpers"
	"backend/models"
	"backend/utils"
	"context"

	"github.com/aws/aws-lambda-go/events"
)

func handleGetUsers(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	requestedUserId := req.QueryStringParameters["id"]
	currentUserId := utils.GetAuthUserId(req)

	if currentUserId == "" && requestedUserId == "" {
		return models.UnauthorizedErrorResponse("You need to be signed in to view your profile!"), nil
	}

	userHelper := helpers.NewUserHelper(ctx)

	if currentUserId == requestedUserId || requestedUserId == "" {
		user, err := userHelper.Get(currentUserId)
		if err != nil {
			return models.ServerSideErrorResponse("Failed to get uer details!", err), nil
		}

		return models.SuccessfulGetRequestResponse(user, nil), nil
	}

	user, err := userHelper.Get(requestedUserId)
	if err != nil {
		return models.ServerSideErrorResponse("Failed to get user details!", err), nil
	}

	return models.SuccessfulGetRequestResponse(user, nil), nil
}
