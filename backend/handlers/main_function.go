package handlers

import (
	"backend/models"
	"context"
	"strings"

	"github.com/aws/aws-lambda-go/events"
)

func getResource(request events.APIGatewayV2HTTPRequest) string {
	path := request.RequestContext.HTTP.Path

	path = strings.TrimPrefix(path, "/")

	parts := strings.Split(path, "/")
	if len(parts) > 1 {
		return parts[1] // since [0] will be "/prod"
	}

	return ""
}

func HandleMainFunction(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	resource := strings.ToLower(getResource(req))

	switch resource {
	case "recipes":
		return HandleRecipesActions(ctx, req)

	case "favorites":
		return HandleFavoritesAction(ctx, req)

	case "ratings":
		return HandleRatingsActions(ctx, req)

	case "users":
		return HandleUserActions(ctx, req)

	default:
		return models.InvalidRequestErrorResponse("Invalid resource url!"), nil
	}
}
