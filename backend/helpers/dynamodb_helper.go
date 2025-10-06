package helpers

import (
	"backend/models"
	"backend/utils"
	"context"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

type dynamoHelper struct {
	Dependencies *utils.DynamoAndCloudfront
	Ctx          context.Context
}

func NewDynamoHelper(dependencies *utils.DynamoAndCloudfront, ctx context.Context) *dynamoHelper {
	return &dynamoHelper{
		Dependencies: dependencies,
		Ctx:          ctx,
	}
}

func (this *dynamoHelper) putIntoDb(item *map[string]types.AttributeValue) error {
	input := &dynamodb.PutItemInput{
		Item:      *item,
		TableName: &this.Dependencies.TableName,
	}

	_, err := this.Dependencies.DbClient.PutItem(this.Ctx, input)

	if err != nil {
		return err
	}

	return nil
}

func (this *dynamoHelper) AddNewUser(user *models.User) error {
	return this.putIntoDb(utils.ToDatabaseFormat(user))
}

func (this *dynamoHelper) GetUser(userid string) (*models.User, error) {
	input := &dynamodb.GetItemInput{
		Key:       *models.UserKey(userid),
		TableName: &this.Dependencies.TableName,
	}

	result, err := this.Dependencies.DbClient.GetItem(this.Ctx, input)

	if err != nil {
		log.Println("an error occurred while trying to get user from db")
		return nil, err
	}

	users, uErr := models.DbItemsToUserStructs(&[]map[string]types.AttributeValue{result.Item})

	if uErr != nil {
		log.Println("Failed to convert db item to user")
		return nil, uErr
	}

	if len(*users) < 1 {
		return nil, nil
	}

	user := (*users)[0]
	return &user, nil
}

func (this *dynamoHelper) AddNewRecipe(recipe *models.Recipe) error {
	return this.putIntoDb(utils.ToDatabaseFormat(recipe))
}

func (this *dynamoHelper) GetAllRecipes() (*[]models.Recipe, error) {
	input := &dynamodb.QueryInput{
		TableName:              &this.Dependencies.TableName,
		IndexName:              aws.String("NicknameIndex"),
		KeyConditionExpression: aws.String("nickname = :n"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":n": &types.AttributeValueMemberS{Value: models.RecipesSkPrefix},
		},
	}

	items, err := this.Dependencies.DbClient.Query(this.Ctx, input)
	if err != nil {
		log.Println("failed to get all recipes from db")
		return nil, err
	}

	recipes, rErr := models.DatabaseItemsToRecipeStructs(&items.Items, this.Dependencies.CloudfrontDomainName)
	if rErr != nil {
		log.Println("An error occurred while trying to convert db recipe items to recipe structs")
		return nil, rErr
	}

	return recipes, nil
}

func (this *dynamoHelper) GetRecipe(recipeId string) (*models.Recipe, error) {
	input := &dynamodb.GetItemInput{
		Key:       *models.RecipeKey(recipeId),
		TableName: &this.Dependencies.TableName,
	}

	item, err := this.Dependencies.DbClient.GetItem(this.Ctx, input)
	if err != nil {
		log.Println("failed to get recipe form database")
		return nil, err
	}

	if len(item.Item) < 1 {
		return nil, nil
	}

	recipes, err := models.DatabaseItemsToRecipeStructs(&[]map[string]types.AttributeValue{item.Item}, this.Dependencies.CloudfrontDomainName)

	if err != nil {
		return nil, err
	}

	recipe := (*recipes)[0]
	return &recipe, nil
}

func (this *dynamoHelper) AddToFavorite(favorite *models.Favorite) error {
	return this.putIntoDb(utils.ToDatabaseFormat(favorite))
}

func (this *dynamoHelper) GetAllFavorites(userId string) (*[]models.Recipe, error) {
	input := &dynamodb.QueryInput{
		TableName:              &this.Dependencies.TableName,
		KeyConditionExpression: aws.String("pk = :pk AND begins_with(sk, :sk)"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":pk": &types.AttributeValueMemberS{Value: models.FavoritePkPrefix + userId},
			":sk": &types.AttributeValueMemberS{Value: models.FavoriteSkPrefix},
		},
	}

	items, err := this.Dependencies.DbClient.Query(this.Ctx, input)
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

func (this *dynamoHelper) RemoveFromFavorite(userId, recipeId string) error {
	input := &dynamodb.DeleteItemInput{
		Key:       *models.FavoriteKey(userId, recipeId),
		TableName: &this.Dependencies.TableName,
	}

	_, err := this.Dependencies.DbClient.DeleteItem(this.Ctx, input)
	if err != nil {
		log.Println("An error occurred while trying to remove a recipe from favorites")
		return err
	}

	return nil
}
