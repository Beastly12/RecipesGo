package handlers

import (
	"backend/helpers"
	"backend/models"
	"backend/utils"
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/aws/aws-lambda-go/events"
)

type ratingBody struct {
	RecipeId string `json:"recipeId"`
	Stars    int    `json:"stars"`
	Comment  string `json:"comment"`
}

func handleAddRatings(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	var reqBody ratingBody
	if err := json.Unmarshal([]byte(req.Body), &reqBody); err != nil {
		log.Println("failed to unmarshal rating request body")
		return models.InvalidRequestErrorResponse(""), nil
	}

	if reqBody.RecipeId == "" {
		return models.InvalidRequestErrorResponse("Invalid recipe id provided!"), nil
	}

	if reqBody.Stars < 1 || reqBody.Stars > 5 {
		return models.InvalidRequestErrorResponse("Recipes cannot be rated lower than 1 star or higher than 5 stars"), nil
	}

	userid := utils.GetAuthUserId(req)
	if userid == "" {
		return models.UnauthorizedErrorResponse("You need to be logged in to use this feature!"), nil
	}

	recipe, recipeErr := helpers.NewRecipeHelper(ctx).Get(reqBody.RecipeId)
	if recipeErr != nil {
		return models.ServerSideErrorResponse("Failed to get recipe details, try again.", recipeErr), nil
	}

	if recipe == nil {
		return models.NotFoundResponse(fmt.Sprintf("No recipe with the id %v exists!", reqBody.RecipeId)), nil
	}

	newRating := models.NewRating(userid, reqBody.RecipeId, reqBody.Comment, reqBody.Stars)

	err := helpers.NewRatingsHelper(ctx).AddRating(newRating)
	if err != nil {
		return models.ServerSideErrorResponse("Failed to add rating, try again.", err), nil
	}

	return models.SuccessfulRequestResponse("Rated recipe successfully!", true), nil
}
