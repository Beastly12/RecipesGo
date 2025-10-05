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

type AddFavorite struct {
	Dependencies utils.DynamoAndCloudfront
}

func NewAddFavorite(dependencies *utils.DynamoAndCloudfront) *AddFavorite {
	return &AddFavorite{
		Dependencies: *dependencies,
	}
}

type favReqBody struct {
	RecipeId string `json:"recipeId"`
}

func (this *AddFavorite) HandleAddToFavorite(ctx context.Context, req *events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// extract recipe id from body
	var payload favReqBody
	if err := json.Unmarshal([]byte(req.Body), &payload); err != nil {
		log.Println("failed to unmarshal add to favorite request body")
		return models.InvalidRequestErrorResponse(""), nil
	}

	if payload.RecipeId == "" {
		return models.InvalidRequestErrorResponse("You need to provide the recipeId of the recipe to add to favorites!"), nil
	}

	// get logged in user id
	userid := utils.GetAuthUserId(req)
	if userid == "" {
		return models.UnauthorizedErrorResponse("You need to be logged in to do this"), nil
	}

	dbHelper := helpers.NewDynamoHelper(this.Dependencies.TableName, this.Dependencies.CloudfrontDomainName, this.Dependencies.DbClient, ctx)

	// get full details of recipe parsed
	recipe, err := dbHelper.GetRecipe(payload.RecipeId)
	if err != nil {
		return models.ServerSideErrorResponse("", err), nil
	}

	// create a new favorite db item and add to db
	fav := models.NewFavorite(userid, recipe)
	dbHelper.AddToFavorite(fav)

	return models.SuccessfulRequestResponse("Added to favorites", false), nil
}
