package handlers

import (
	"backend/helpers"
	"backend/models"
	"backend/utils"
	"context"
	"encoding/json"

	"github.com/aws/aws-lambda-go/events"
)

type favReqBody struct {
	RecipeId string `json:"recipeId"`
}

func handleAddToFavorite(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {

	utils.BasicLog("STARTED ADD TO FAVORITE FUNCTION", nil)

	// extract recipe id from body
	var payload favReqBody
	if err := json.Unmarshal([]byte(req.Body), &payload); err != nil {
		utils.BasicLog("failed to unmarshal request body", req.Body)
		return models.InvalidRequestErrorResponse(""), nil
	}
	if payload.RecipeId == "" {
		utils.BasicLog("recipe id is empty", nil)
		return models.InvalidRequestErrorResponse("You need to provide the recipeId of the recipe to add to favorites!"), nil
	}

	// get logged in user id
	userid := utils.GetAuthUserId(req)
	if userid == "" {
		utils.BasicLog("no user id gotten from req", req)
		return models.UnauthorizedErrorResponse("You need to be logged in to do this"), nil
	}

	// get full details of recipe parsed
	recipe, err := helpers.NewRecipeHelper(ctx).Get(payload.RecipeId)
	if err != nil {
		utils.BasicLog("failed to get recipe details from db", err)
		return models.ServerSideErrorResponse("", err), nil
	}

	// create a new favorite db item and add to db
	fav := models.NewFavorite(userid, recipe)
	utils.BasicLog("calling helper to add new favorite", nil)
	helpers.NewFavoritesHelper(ctx).Add(fav)

	return models.SuccessfulRequestResponse("Added to favorites", false), nil
}
