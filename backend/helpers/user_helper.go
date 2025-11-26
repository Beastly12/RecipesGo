package helpers

import (
	"backend/models"
	"backend/utils"
	"context"
	"fmt"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/expression"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
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
	return newHelper(u.Ctx).putIntoDb(utils.ToDatabaseFormat(user))
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

func (u *userHelper) GetDisplayDetails(userId string) (*models.User, error) {
	attr := expression.NamesList(expression.Name("dpUrl"), expression.Name("gsi"))
	expr, err := expression.NewBuilder().WithProjection(attr).Build()
	if err != nil {
		log.Printf("Failed to get user display details! ERROR: %v", err)
		return nil, err
	}

	input := &dynamodb.GetItemInput{
		Key:                      *models.UserKey(userId),
		TableName:                &utils.GetDependencies().MainTableName,
		ProjectionExpression:     expr.Projection(),
		ExpressionAttributeNames: expr.Names(),
	}

	result, err := utils.GetDependencies().DbClient.GetItem(u.Ctx, input)
	return &(*models.DbItemsToUserStructs(&[]map[string]types.AttributeValue{result.Item}))[0], nil
}

func (u *userHelper) UpdateOverallRecipesRating(userId string) error {
	// calc the new overall rating for author
	authorRating, err := NewUserHelper(u.Ctx).RecalculateRecipesOverallRatings(userId)
	if err != nil {
		log.Printf("Failed to get author average rating! ERROR: %v", err)
		return err
	}
	log.Printf("AUTHORS OVERALL RATING: %v", authorRating)

	// update the author rating
	update := expression.Set(expression.Name("overallRating"), expression.Value(authorRating))
	authorExpr, err := expression.NewBuilder().WithUpdate(update).Build()
	if err != nil {
		return fmt.Errorf("failed to build author expression: %w", err)
	}

	input := &dynamodb.UpdateItemInput{
		Key:                       *models.UserKey(userId),
		TableName:                 &utils.GetDependencies().MainTableName,
		UpdateExpression:          authorExpr.Update(),
		ExpressionAttributeNames:  authorExpr.Names(),
		ExpressionAttributeValues: authorExpr.Values(),
	}

	_, err = utils.GetDependencies().DbClient.UpdateItem(u.Ctx, input)
	return err
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
	recipes := models.DatabaseItemsToRecipeStructs(&result)

	recipeCount := len(*recipes)
	var ratings float32
	for _, recipe := range *recipes {
		log.Printf("RECIPE: %v, RATING: %v", recipe.Name, recipe.Rating)
		ratings += float32(recipe.Rating)
	}

	return ratings / float32(recipeCount), nil
}

func setUpdate(update expression.UpdateBuilder, name, value string) expression.UpdateBuilder {
	return update.Set(
		expression.Name(name),
		expression.Value(value),
	)
}

func (u *userHelper) UpdateUser(userId string, user *models.User) error {
	update := expression.UpdateBuilder{}
	hasUpdates := false

	if user.Name != "" {
		update = setUpdate(update, "gsi", utils.AddPrefix(user.Name, models.UserGsiPrefix))
		hasUpdates = true
	}

	if user.DpUrl != "" {
		update = setUpdate(update, "dpUrl", user.DpUrl)
		hasUpdates = true
	}

	if user.Bio != "" {
		update = setUpdate(update, "bio", user.Bio)
		hasUpdates = true
	}

	if user.Location != "" {
		update = setUpdate(update, "location", user.Location)
		hasUpdates = true
	}

	if !hasUpdates {
		return fmt.Errorf("Nothing to update!")
	}

	expr, err := expression.NewBuilder().WithUpdate(update).Build()

	input := &dynamodb.UpdateItemInput{
		Key:                       *models.UserKey(userId),
		TableName:                 &utils.GetDependencies().MainTableName,
		UpdateExpression:          expr.Update(),
		ExpressionAttributeNames:  expr.Names(),
		ExpressionAttributeValues: expr.Values(),
	}

	_, err = utils.GetDependencies().DbClient.UpdateItem(u.Ctx, input)
	return err
}

func (u *userHelper) RemoveUserPicture(userId string) error {
	update := expression.Set(
		expression.Name("dpUrl"),
		expression.Value(""),
	)
	expr, err := expression.NewBuilder().WithUpdate(update).Build()
	if err != nil {
		println("Failed to build profile picture update")
		return err
	}

	input := &dynamodb.UpdateItemInput{
		Key:                       *models.UserKey(userId),
		TableName:                 &utils.GetDependencies().MainTableName,
		UpdateExpression:          expr.Update(),
		ExpressionAttributeNames:  expr.Names(),
		ExpressionAttributeValues: expr.Values(),
	}

	_, err = utils.GetDependencies().DbClient.UpdateItem(u.Ctx, input)
	return err
}

func (u *userHelper) DeleteUser(userid string) error {
	cognitoInput := &cognitoidentityprovider.AdminDeleteUserInput{
		UserPoolId: &utils.GetDependencies().UserPoolId,
		Username:   &userid,
	}

	dynamodbInput := &dynamodb.DeleteItemInput{
		Key:       *models.UserKey(userid),
		TableName: &utils.GetDependencies().MainTableName,
	}

	_, err := utils.GetDependencies().CognitoClient.AdminDeleteUser(u.Ctx, cognitoInput)
	if err != nil {
		return err
	}

	_, err = utils.GetDependencies().DbClient.DeleteItem(u.Ctx, dynamodbInput)
	if err != nil {
		return err
	}

	return nil
}
