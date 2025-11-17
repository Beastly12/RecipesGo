package handlers

import (
	"backend/models"
	"context"
	"strings"

	"github.com/aws/aws-lambda-go/events"
)

func HandleUserActions(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	reqMethod := strings.ToLower(req.RequestContext.HTTP.Method)

	switch reqMethod {
	case "get":
		return handleGetUsers(ctx, req)

	default:
		return models.InvalidRequestErrorResponse("Invalid HTTP method!"), nil
	}
}
