package helpers

import (
	"backend/models"
	"backend/utils"
	"context"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/expression"
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

func (u *userHelper) RecalculateRecipesOverallRatings(userId string) (float32, error) {
	println("CALCULATING USERS OVERALL RECIPE RATING")
	condition := expression.KeyEqual(
		expression.Key("gsi3"),
		expression.Value(utils.AddPrefix(userId, models.RecipesGsi3Prefix)),
	)
	expr, err := expression.NewBuilder().WithKeyCondition(condition).Build()

	if err != nil {
		return 0, err
	}

	input := &dynamodb.QueryInput{
		TableName:                 &utils.GetDependencies().MainTableName,
		IndexName:                 aws.String("gsiIndex3"),
		KeyConditionExpression:    expr.KeyCondition(),
		ExpressionAttributeNames:  expr.Names(),
		ExpressionAttributeValues: expr.Values(),
	}

	result, err := newHelper(u.Ctx).queryDb(input)
	if err != nil {
		println("FAILED TO GET USERS RECIPES")
		return 0, err
	}
	if len(result) < 1 {
		println("THIS USER HAS NO RECIPES")
		return 0, nil
	}

	log.Printf("FOUND %v RECIPES CREATED BY THIS USER", len(result))

	// convert to recipe items
	recipes := models.DatabaseItemsToRecipeStructs(&result, utils.GetDependencies().CloudFrontDomainName)

	recipeCount := len(*recipes)
	var ratings float32
	for _, recipe := range *recipes {
		log.Printf("RECIPE: %v, RATING: %v", recipe.Name, recipe.Rating)
		ratings += float32(recipe.Rating)
	}

	return ratings / float32(recipeCount), nil
}
