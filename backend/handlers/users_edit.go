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

	userHelper := helpers.NewUserHelper(ctx)

	dbUser, err := userHelper.GetDisplayDetails(userId)
	if err != nil {
		return models.ServerSideErrorResponse("Failed to get user details from db!", err), nil
	}
	if dbUser == nil {
		return models.NotFoundResponse("No such user exists!"), nil
	}

	err = userHelper.UpdateUser(userId, &user)
	if err != nil {
		return models.ServerSideErrorResponse("Failed to update user details", err), nil
	}

	return models.SuccessfulRequestResponse("User updated successfully!", false), nil
}
