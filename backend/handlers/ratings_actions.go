package handlers

import (
	"backend/models"
	"context"
	"strings"

	"github.com/aws/aws-lambda-go/events"
)

func HandleRatingsActions(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	switch strings.ToLower(req.RequestContext.HTTP.Method) {
	case "post":
		return handleAddRatings(ctx, req)

	case "delete":
		return handleDeleteRating(ctx, req)

	case "get":
		return handleGetRatings(ctx, req)

	default:
		return models.InvalidRequestErrorResponse("Invalid http method!"), nil
	}
}
