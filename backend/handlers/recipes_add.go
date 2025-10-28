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

type jsonBody struct {
	Name            string   `json:"name"`
	ImageUrl        string   `json:"imageUrl"`
	Description     string   `json:"description"`
	Categories      []string `json:"categories"`
	Ingredients     []string `json:"ingredients"`
	Instructions    []string `json:"instructions"`
	PreparationTime int      `json:"preparationTime"`
	Difficulty      string   `json:"difficulty"`
	IsPublic        bool     `json:"isPublic"`
}

// adds new recipe to db
func handleAddRecipe(ctx context.Context, req *events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// converts json body into recipe
	var recipe jsonBody
	if err := json.Unmarshal([]byte(req.Body), &recipe); err != nil {
		// if we fail to convert json to recipe struct
		log.Println("failed to unmarshal request body into json body")
		return models.InvalidRequestErrorResponse(""), nil
	}

	if recipe.Name == "" {
		return models.InvalidRequestErrorResponse("Recipe must have a name"), nil
	}

	if len(recipe.Ingredients) < 1 {
		return models.InvalidRequestErrorResponse("Recipe must have at least 1 ingredient"), nil
	}

	if len(recipe.Categories) < 1 {
		return models.InvalidRequestErrorResponse("Recipe must have at least 1 category"), nil
	}

	if len(recipe.Instructions) < 1 {
		return models.InvalidRequestErrorResponse("Recipe must have at least one preparation instruction"), nil
	}

	// get details of user trying to create new recipe
	userid := utils.GetAuthUserId(req)
	if userid == "" {
		// if user is not logged in
		return models.UnauthorizedErrorResponse("You have to be logged in to add a new recipe!"), nil
	}
	user, err := helpers.NewUserHelper(ctx).Get(userid)
	if err != nil {
		// if err occurs while trying to get user full details from db
		log.Println("failed to get user")
		return models.ServerSideErrorResponse("", err), nil
	}

	if user == nil {
		// if no such user exists
		log.Println("user not found")
		return models.NotFoundResponse("User not found, please make sure you are logged in."), nil
	}

	// create new recipe struct
	newRecipe := models.NewRecipe(
		recipe.Name,
		recipe.ImageUrl,
		user.Nickname,
		recipe.Description,
		recipe.PreparationTime,
		recipe.Difficulty,
		recipe.IsPublic,
	)

	newRecipe.AddIngredients(recipe.Ingredients...)
	newRecipe.AddCategories(recipe.Categories...)
	newRecipe.AddInstructions(recipe.Instructions...)

	// add it to db
	addErr := helpers.NewRecipeHelper(ctx).Add(newRecipe)

	if addErr != nil {
		// if err occurs while adding new recipe to db
		log.Println("an error occurred while adding recipe to db")
		return models.ServerSideErrorResponse("Something went wrong while adding recipe to database, try again.", addErr), nil
	}

	// if add successful
	return models.SuccessfulRequestResponse("Added new recipe successfully!", true), nil
}
