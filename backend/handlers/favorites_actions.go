package handlers

import (
	"backend/models"
	"context"

	"github.com/aws/aws-lambda-go/events"
)

func HandleFavoritesAction(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	switch req.RequestContext.HTTP.Method {
	case "POST":
		return handleAddToFavorite(ctx, req)

	case "GET":
		return handleGetFavorite(ctx, req)

	case "DELETE":
		return handleRemoveFavorite(ctx, req)

	default:
		return models.InvalidRequestErrorResponse("Invalid http method!"), nil
	}
}
