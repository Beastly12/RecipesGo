package handlers

import (
	"backend/helpers"
	"backend/models"
	"backend/utils"
	"context"
	"encoding/json"

	"github.com/aws/aws-lambda-go/events"
)

func handleEditUser(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	userId := utils.GetAuthUserId(req)
	var user models.User
	if err := json.Unmarshal([]byte(req.Body), &user); err != nil {
		return models.InvalidRequestErrorResponse("Invalid request body!"), nil
	}

	err := helpers.NewUserHelper(ctx).UpdateUser(userId, &user)
	if err != nil {
		return models.ServerSideErrorResponse("Failed to update user details", err), nil
	}

	return models.SuccessfulRequestResponse("User updated successfully!", false), nil
}
