package handlers

import (
	"backend/models"
	"backend/utils"
	"context"
	"encoding/json"
	"log"

	"github.com/aws/aws-lambda-go/events"
)

type ratingBody struct {
	RecipeId string `json:"recipeId"`
	Stars    int    `json:"stars"`
	Comment  string `json:"comment"`
}

func HandleAddRatings(ctx context.Context, req *events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var reqBody ratingBody
	if err := json.Unmarshal([]byte(req.Body), &reqBody); err != nil {
		log.Println("failed to unmarshal rating request body")
		return models.InvalidRequestErrorResponse(""), nil
	}

	userid := utils.GetAuthUserId(req)
	if userid == "" {
		return models.UnauthorizedErrorResponse("You need to be logged in to use this feature!"), nil
	}

	return models.NotFoundResponse("Resource not implemented"), nil
}
