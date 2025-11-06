package handlers

import (
	"backend/models"
	"context"

	"github.com/aws/aws-lambda-go/events"
)

func handleGetSearchResults(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	return models.InvalidRequestErrorResponse("This endpoint is not yet implemented."), nil
}
