package helpers

import (
	"backend"
	"backend/models"
	"backend/utils"
	"context"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/expression"
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

func (r *favoritesHelper) getFavorite(userId, recipeId string) (*models.Favorite, error) {
	input := &dynamodb.GetItemInput{
		Key:       *models.FavoriteKey(userId, recipeId),
		TableName: &utils.GetDependencies().MainTableName,
	}
	result, err := utils.GetDependencies().DbClient.GetItem(r.Ctx, input)
	if err != nil {
		log.Printf("failed to check if user already has current recipe in favorites! ERROR: %v", err)
		return nil, err
	}

	if len(result.Item) < 1 {
		return nil, nil
	}

	favs := models.DbItemsToFavoriteStructs(
		&[]map[string]types.AttributeValue{
			result.Item,
		},
	)

	return &(*favs)[0], nil
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

func (this *favoritesHelper) Add(favorite *models.Favorite, recipeAuthorId string) error {
	recipeInFavorites, err := this.recipeInUserFavorites(favorite.UserId, favorite.RecipeId)
	if err != nil {
		return err
	}

	if recipeInFavorites {
		return nil
	}

	update := expression.Set(
		expression.Name("likes"),
		expression.Plus(
			expression.IfNotExists(expression.Name("likes"), expression.Value(0)),
			expression.Value(1),
		),
	)
	expr, err := expression.NewBuilder().WithUpdate(update).Build()
	if err != nil {
		println("failed to build like counter update!")
		return err
	}

	transactions := []types.TransactWriteItem{
		{
			Put: &types.Put{
				Item:      *utils.ToDatabaseFormat(favorite),
				TableName: &utils.GetDependencies().MainTableName,
			},
		},
		{
			Update: &types.Update{
				// update like counter on recipe
				Key:                       *models.RecipeKey(favorite.RecipeId),
				TableName:                 &utils.GetDependencies().MainTableName,
				UpdateExpression:          expr.Update(),
				ExpressionAttributeNames:  expr.Names(),
				ExpressionAttributeValues: expr.Values(),
			},
		},
		{
			Update: &types.Update{
				// update like counter on author
				Key:                       *models.UserKey(recipeAuthorId),
				TableName:                 &utils.GetDependencies().MainTableName,
				UpdateExpression:          expr.Update(),
				ExpressionAttributeNames:  expr.Names(),
				ExpressionAttributeValues: expr.Values(),
			},
		},
	}

	input := &dynamodb.TransactWriteItemsInput{
		TransactItems: transactions,
	}

	_, err = utils.GetDependencies().DbClient.TransactWriteItems(this.Ctx, input)
	if err != nil {
		utils.PrintTransactWriteCancellationReason(err)
		return err
	}

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

	recipeHelper := NewRecipeHelper(this.Ctx)
	recipes := []models.Recipe{}
	for _, fav := range *favs {
		r, err := recipeHelper.Get(fav.RecipeId)
		if err != nil {
			log.Printf("Failed to get recipe details for %v, ERROR: %v", fav.RecipeId, err)
			continue
		}
		recipes = append(recipes, *r)
	}

	return &getAllFavoritesOutput{
		Favorites: recipes,
		NextKey:   items.LastEvaluatedKey,
	}, nil
}

func (this *favoritesHelper) Remove(recipe *models.Recipe, userId string) error {
	favorite, err := this.getFavorite(userId, recipe.Id)
	if err != nil {
		return err
	}

	if favorite == nil {
		return nil
	}

	update := expression.Set(
		expression.Name("likes"),
		expression.Minus(
			expression.IfNotExists(expression.Name("likes"), expression.Value(0)),
			expression.Value(1),
		),
	)

	condition := expression.And(
		expression.AttributeExists(expression.Name("likes")),
		expression.GreaterThan(expression.Name("likes"), expression.Value(0)),
	)

	expr, err := expression.NewBuilder().WithUpdate(update).WithCondition(condition).Build()
	if err != nil {
		println("failed to build like counter update!")
		return err
	}

	transactions := []types.TransactWriteItem{
		{
			Delete: &types.Delete{
				Key:       *models.FavoriteKey(favorite.UserId, favorite.RecipeId),
				TableName: &utils.GetDependencies().MainTableName,
			},
		},
		{
			Update: &types.Update{
				// update like counter on recipe
				Key:                       *models.RecipeKey(favorite.RecipeId),
				TableName:                 &utils.GetDependencies().MainTableName,
				UpdateExpression:          expr.Update(),
				ExpressionAttributeNames:  expr.Names(),
				ExpressionAttributeValues: expr.Values(),
				ConditionExpression:       expr.Condition(),
			},
		},
		{
			Update: &types.Update{
				// update like counter on author
				Key:                       *models.UserKey(recipe.AuthorId),
				TableName:                 &utils.GetDependencies().MainTableName,
				UpdateExpression:          expr.Update(),
				ExpressionAttributeNames:  expr.Names(),
				ExpressionAttributeValues: expr.Values(),
				ConditionExpression:       expr.Condition(),
			},
		},
	}

	input := &dynamodb.TransactWriteItemsInput{
		TransactItems: transactions,
	}

	_, err = utils.GetDependencies().DbClient.TransactWriteItems(this.Ctx, input)
	if err != nil {
		utils.PrintTransactWriteCancellationReason(err)
		return err
	}

	return nil
}
