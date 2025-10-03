package helpers

import (
	"context"
	"log"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

type UserDynamoHelper struct {
	TableName string
	DbClient  *dynamodb.Client
	Ctx       context.Context
}

func (deps *UserDynamoHelper) AddNewUser(user *map[string]types.AttributeValue) error {
	input := &dynamodb.PutItemInput{
		Item:      *user,
		TableName: &deps.TableName,
	}

	_, err := deps.DbClient.PutItem(deps.Ctx, input)

	if err != nil {
		log.Print("An error occurred while trying to put new user in the db")
		return err
	}

	log.Println("added user successfully")

	return nil
}
