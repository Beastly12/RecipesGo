package handlers

import (
	"backend/models"
	"context"
	"encoding/json"
	"strings"

	"github.com/aws/aws-lambda-go/events"
)

type updateDpBody struct {
	RemoveDpUrl bool `json:"removeDpUrl"`
}

func HandleUserActions(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	reqMethod := strings.ToLower(req.RequestContext.HTTP.Method)

	switch reqMethod {
	case "get":
		return handleGetUsers(ctx, req)

	case "put":
		var updateBody updateDpBody
		if err := json.Unmarshal([]byte(req.Body), &updateBody); err == nil {
			if updateBody.RemoveDpUrl {
				return handleRemoveDisplayPicture(ctx, req)
			}
		}
		return handleEditUser(ctx, req)

	case "delete":
		return handleDeleteUser(ctx, req)

	default:
		return models.InvalidRequestErrorResponse("Invalid HTTP method!"), nil
	}
}
