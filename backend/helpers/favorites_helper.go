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

type getAllFavoritesOutput struct {
	Favorites []models.Recipe
	NextKey   map[string]types.AttributeValue
}

func NewFavoritesHelper(ctx context.Context) *favoritesHelper {
	utils.BasicLog("initializing favorite helper...", nil)
	return &favoritesHelper{
		Ctx: ctx,
	}
}

func (r *favoritesHelper) recipeInUserFavorites(userId, recipeId string) (bool, error) {
	input := &dynamodb.GetItemInput{
		Key:       *models.FavoriteKey(userId, recipeId),
		TableName: &utils.GetDependencies().MainTableName,
	}
	result, err := utils.GetDependencies().DbClient.GetItem(r.Ctx, input)
	if err != nil {
		log.Printf("failed to check if user already has current recipe in favorites! ERROR: %v", err)
		return false, err
	}

	return len(result.Item) > 0, nil
}

func (this *favoritesHelper) Add(favorite *models.Favorite) error {
	recipeInFavorites, err := this.recipeInUserFavorites(favorite.UserId, favorite.RecipeId)
	if err != nil {
		return err
	}

	if recipeInFavorites {
		return nil
	}

	err = newHelper(this.Ctx).putIntoDb(utils.ToDatabaseFormat(favorite))
	if err != nil {
		return err
	}

	NewQueueHelper(this.Ctx).PutInQueue(WithLikeAction(favorite.UserId, favorite.RecipeId, true))

	return nil
}

func (this *favoritesHelper) GetAll(userId string, lastEvalKey map[string]types.AttributeValue) (*getAllFavoritesOutput, error) {
	input := &dynamodb.QueryInput{
		TableName:              &utils.GetDependencies().MainTableName,
		KeyConditionExpression: aws.String("pk = :pk AND begins_with(sk, :sk)"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":pk": &types.AttributeValueMemberS{Value: models.FavoritePkPrefix + userId},
			":sk": &types.AttributeValueMemberS{Value: models.FavoriteSkPrefix},
		},
		Limit:             aws.Int32(backend.MAX_RECIPES_DUMP),
		ExclusiveStartKey: lastEvalKey,
	}

	items, err := utils.GetDependencies().DbClient.Query(this.Ctx, input)
	if err != nil {
		log.Println("failed to get all user favorites from db")
		return nil, err
	}

	favs := models.DbItemsToFavoriteStructs(&items.Items)

	recipes := []models.Recipe{}
	for _, fav := range *favs {
		r := *models.NewRecipe(
			fav.Name,
			fav.ImageUrl,
			fav.Category,
			fav.Description,
			fav.PreparationTime,
			fav.Difficulty,
			fav.IsPublic,
			fav.AuthorId,
			fav.AuthorName,
			fav.AuthorDpUrl,
		)
		r.Id = fav.RecipeId
		r.AddIngredients(fav.Ingredients...)
		recipes = append(recipes, r)
	}

	return &getAllFavoritesOutput{
		Favorites: recipes,
		NextKey:   items.LastEvaluatedKey,
	}, nil
}

func (this *favoritesHelper) Remove(userId, recipeId string) error {
	recipeInFavorites, err := this.recipeInUserFavorites(userId, recipeId)
	if err != nil {
		return err
	}

	if !recipeInFavorites {
		return nil
	}

	err = newHelper(this.Ctx).deleteFromDb(models.FavoriteKey(userId, recipeId))
	if err != nil {
		return err
	}

	NewQueueHelper(this.Ctx).PutInQueue(WithLikeAction(userId, recipeId, false))
	return nil
}
