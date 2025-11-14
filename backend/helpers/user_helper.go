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

type authorStats struct {
	RecipesCount  int `json:"recipes_count"`
	ViewCount     int `json:"view_count"`
	OverallRating int `json:"overall_rating"`
	LikeCount     int `json:"like_count"`
}

func NewUserHelper(ctx context.Context) *userHelper {
	return &userHelper{
		Ctx: ctx,
	}
}

func (u *userHelper) AddUser(user *models.User) error {
	var transactionItems []types.TransactWriteItem

	transactionItems = append(transactionItems, types.TransactWriteItem{
		Put: &types.Put{
			Item:      *utils.ToDatabaseFormat(user),
			TableName: &utils.GetDependencies().MainTableName,
		},
	})

	transactionItems = append(transactionItems, newSearchHelper().getUserSearchIndexTransactions(user)...)

	input := &dynamodb.TransactWriteItemsInput{
		TransactItems: transactionItems,
	}

	_, err := utils.GetDependencies().DbClient.TransactWriteItems(u.Ctx, input)
	if err != nil {
		log.Println("Failed to add user items to db")
		utils.PrintTransactWriteCancellationReason(err)
		return err
	}

	return nil
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

	users := models.DbItemsToUserStructs(&[]map[string]types.AttributeValue{result.Item})

	if len(*users) < 1 {
		return nil, nil
	}

	user := (*users)[0]
	return &user, nil
}
