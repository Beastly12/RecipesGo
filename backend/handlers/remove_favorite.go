package handlers

import (
	"backend/helpers"
	"backend/models"
	"backend/utils"
	"context"
	"encoding/json"
	"log"

	"github.com/aws/aws-lambda-go/events"
)

type RemoveFavoriteDependencies struct {
	Dependencies utils.DynamoAndCloudfront
}

func (this *RemoveFavoriteDependencies) HandleRemoveFavorite(ctx context.Context, req *events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

	// extract recipe id from request body
	var reqBody favReqBody
	if err := json.Unmarshal([]byte(req.Body), &reqBody); err != nil {
		log.Println("failed to unmarshal remove favorite request")
		return models.InvalidRequestErrorResponse(""), nil
	}
	if reqBody.RecipeId == "" {
		return models.InvalidRequestErrorResponse("No recipeId provided in request body"), nil
	}

	// get current logged in user id
	userid := utils.GetAuthUserId(req)
	if userid == "" {
		return models.UnauthorizedErrorResponse("You have to be logged in to do this"), nil
	}

	dbHelper := helpers.NewDynamoHelper(
		&this.Dependencies,
		ctx,
	)

	// remove favorite from db
	err := dbHelper.RemoveFromFavorite(userid, reqBody.RecipeId)
	if err != nil {
		return models.ServerSideErrorResponse("", err), nil
	}

	return models.SuccessfulRequestResponse("Recipe removed from favorites!", false), nil
}
