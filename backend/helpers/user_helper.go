package helpers

import (
	"backend/models"
	"backend/utils"
	"context"
	"log"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

type userHelper struct {
	Ctx context.Context
}

func NewUserHelper(ctx context.Context) *userHelper {
	return &userHelper{
		Ctx: ctx,
	}
}

// adds new user to db
func (this *userHelper) Add(user *models.User) error {
	return NewHelper(this.Ctx).putIntoDb(utils.ToDatabaseFormat(user))
}

// gets user details from db
func (this *userHelper) Get(userid string) (*models.User, error) {
	input := &dynamodb.GetItemInput{
		Key:       *models.UserKey(userid),
		TableName: &utils.GetDependencies().MainTableName,
	}

	result, err := utils.GetDependencies().DbClient.GetItem(this.Ctx, input)

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
