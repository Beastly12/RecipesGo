package helpers

import (
	"backend"
	"backend/models"
	"backend/utils"
	"context"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

type favoritesHelper struct {
	Ctx context.Context
}

func NewFavoritesHelper(ctx context.Context) *favoritesHelper {
	return &favoritesHelper{
		Ctx: ctx,
	}
}

func (this *favoritesHelper) Add(favorite *models.Favorite) error {
	return NewHelper(this.Ctx).putIntoDb(utils.ToDatabaseFormat(favorite))
}

func (this *favoritesHelper) GetAll(userId string, lastRecipeId string) (*[]models.Recipe, error) {
	input := &dynamodb.QueryInput{
		TableName:              &utils.GetDependencies().MainTableName,
		KeyConditionExpression: aws.String("pk = :pk AND begins_with(sk, :sk)"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":pk": &types.AttributeValueMemberS{Value: models.FavoritePkPrefix + userId},
			":sk": &types.AttributeValueMemberS{Value: models.FavoriteSkPrefix},
		},
		Limit: aws.Int32(backend.MAX_RECIPES_DUMP),
	}

	if lastRecipeId != "" {
		input.ExclusiveStartKey = *models.FavoriteKey(userId, lastRecipeId)
	}

	items, err := utils.GetDependencies().DbClient.Query(this.Ctx, input)
	if err != nil {
		log.Println("failed to get all user favorites from db")
		return nil, err
	}

	favs, err := models.DbItemsToFavoriteStructs(&items.Items)
	if err != nil {
		return nil, err
	}

	var recipes []models.Recipe
	for _, fav := range *favs {
		r := *models.NewRecipe(
			fav.Name,
			fav.ImageUrl,
			fav.AuthorName,
			fav.Description,
			fav.PreparationTime,
			fav.Ingredients...,
		)
		r.Id = fav.RecipeId
		recipes = append(recipes, r)
	}

	return &recipes, nil
}

func (this *favoritesHelper) Remove(userId, recipeId string) error {
	input := &dynamodb.DeleteItemInput{
		Key:       *models.FavoriteKey(userId, recipeId),
		TableName: &utils.GetDependencies().MainTableName,
	}

	_, err := utils.GetDependencies().DbClient.DeleteItem(this.Ctx, input)
	if err != nil {
		log.Println("An error occurred while trying to remove a recipe from favorites")
		return err
	}

	return nil
}
