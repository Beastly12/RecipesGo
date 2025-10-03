package helpers

import (
	"backend/models"
	"context"
	"log"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

type DynamoHelper struct {
	TableName string
	DbClient  *dynamodb.Client
	Ctx       context.Context
}

func (deps *DynamoHelper) AddNewUser(user *models.User) error {
	input := &dynamodb.PutItemInput{
		Item:      *user.ToDatabaseFormat(),
		TableName: &deps.TableName,
	}

	_, err := deps.DbClient.PutItem(deps.Ctx, input)

	if err != nil {
		log.Print("An error occurred while trying to put new user in the db")
		return err
	}

	return nil
}

func (deps *DynamoHelper) GetUser(userid string) (*models.User, error) {
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

func (deps *DynamoHelper) AddNewRecipe(recipe *models.Recipe) error {
	input := &dynamodb.PutItemInput{
		Item:      *recipe.ToDatabaseFormat(),
		TableName: &deps.TableName,
	}

	_, err := deps.DbClient.PutItem(deps.Ctx, input)

	if err != nil {
		log.Println("something went wrong while trying to add recipe to db")
		return err
	}

	return nil
}
