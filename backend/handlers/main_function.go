package handlers

import (
	"backend/models"
	"context"
	"strings"

	"github.com/aws/aws-lambda-go/events"
)

func getReqPath(request events.APIGatewayV2HTTPRequest, index int) string {
	path := request.RequestContext.HTTP.Path

	path = strings.TrimPrefix(path, "/")

	parts := strings.Split(path, "/")
	if len(parts) > index {
		return parts[index]
	}

	return ""
}

func getResource(request events.APIGatewayV2HTTPRequest) string {
	return getReqPath(request, 1)
}

func getPathParam(request events.APIGatewayV2HTTPRequest) string {
	return getReqPath(request, 2)
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

	case "search":
		return handleSearchRecipe(ctx, req)

	default:
		return models.InvalidRequestErrorResponse("Invalid resource url!"), nil
	}
}
