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
	CloudFrontName string
	TableName      string
	DbClient       *dynamodb.Client
	Ctx            context.Context
}

func NewDynamoHelper(tableName, cloudfrontDomainName string, dbClient *dynamodb.Client, ctx context.Context) dynamoHelper {
	return dynamoHelper{
		CloudFrontName: cloudfrontDomainName,
		TableName:      tableName,
		DbClient:       dbClient,
		Ctx:            ctx,
	}
}

func (deps *dynamoHelper) putIntoDb(item *map[string]types.AttributeValue) error {
	input := &dynamodb.PutItemInput{
		Item:      *item,
		TableName: &deps.TableName,
	}

	_, err := deps.DbClient.PutItem(deps.Ctx, input)

	if err != nil {
		return err
	}

	return nil
}

func (deps *dynamoHelper) AddNewUser(user *models.User) error {
	return deps.putIntoDb(utils.ToDatabaseFormat(user))
}

func (deps *dynamoHelper) GetUser(userid string) (*models.User, error) {
	input := &dynamodb.GetItemInput{
		Key:       *models.UserKey(userid),
		TableName: &deps.TableName,
	}

	result, err := deps.DbClient.GetItem(deps.Ctx, input)

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

func (deps *dynamoHelper) AddNewRecipe(recipe *models.Recipe) error {
	return deps.putIntoDb(utils.ToDatabaseFormat(recipe))
}

func (deps *dynamoHelper) GetAllRecipes() (*[]models.Recipe, error) {
	input := &dynamodb.QueryInput{
		TableName:              &deps.TableName,
		IndexName:              aws.String("NicknameIndex"),
		KeyConditionExpression: aws.String("nickname = :n"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":n": &types.AttributeValueMemberS{Value: models.RecipesSkPrefix},
		},
	}

	items, err := deps.DbClient.Query(deps.Ctx, input)
	if err != nil {
		log.Println("failed to get all recipes from db")
		return nil, err
	}

	recipes, rErr := models.DatabaseItemsToRecipeStructs(&items.Items, deps.CloudFrontName)
	if rErr != nil {
		log.Println("An error occurred while trying to convert db recipe items to recipe structs")
		return nil, rErr
	}

	return recipes, nil
}

func (deps *dynamoHelper) GetRecipe(recipeId string) (*models.Recipe, error) {
	input := &dynamodb.GetItemInput{
		Key:       *models.RecipeKey(recipeId),
		TableName: &deps.TableName,
	}

	item, err := deps.DbClient.GetItem(deps.Ctx, input)
	if err != nil {
		log.Println("failed to get recipe form database")
		return nil, err
	}

	if len(item.Item) < 1 {
		return nil, nil
	}

	recipes, err := models.DatabaseItemsToRecipeStructs(&[]map[string]types.AttributeValue{item.Item}, deps.CloudFrontName)

	if err != nil {
		return nil, err
	}

	recipe := (*recipes)[0]
	return &recipe, nil
}

func (deps *dynamoHelper) AddToFavorite(favorite *models.Favorite) error {
	return deps.putIntoDb(utils.ToDatabaseFormat(favorite))
}

func (deps *dynamoHelper) GetAllFavorites(userId string) (*[]models.Favorite, error) {
	input := &dynamodb.QueryInput{
		TableName:              &deps.TableName,
		KeyConditionExpression: aws.String("pk = :pk AND begins_with(sk, :sk)"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":pk": &types.AttributeValueMemberS{Value: models.FavoritePkPrefix + userId},
			":sk": &types.AttributeValueMemberS{Value: models.FavoriteSkPrefix},
		},
	}

	items, err := deps.DbClient.Query(deps.Ctx, input)
	if err != nil {
		log.Println("failed to get all user favorites from db")
		return nil, err
	}

	return models.DbItemsToFavoriteStructs(&items.Items)
}

func (deps *dynamoHelper) RemoveFromFavorite(userId, recipeId string) error {
	input := &dynamodb.DeleteItemInput{
		Key:       *models.FavoriteKey(userId, recipeId),
		TableName: &deps.TableName,
	}

	_, err := deps.DbClient.DeleteItem(deps.Ctx, input)
	if err != nil {
		log.Println("An error occurred while trying to remove a recipe from favorites")
		return err
	}

	return nil
}
