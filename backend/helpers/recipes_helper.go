package helpers

import (
	"backend/models"
	"backend/utils"
	"context"
	"fmt"
	"log"
	"strings"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/expression"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

type recipeHelper struct {
	Ctx context.Context
}

type getAllRecipesOutput struct {
	Recipes []models.Recipe
	NextKey map[string]types.AttributeValue
}

func NewRecipeHelper(ctx context.Context) *recipeHelper {
	return &recipeHelper{
		Ctx: ctx,
	}
}

// adds recipe to db
func (this *recipeHelper) Add(recipe *models.Recipe) error {
	authored := models.NewAuthoredRecipe(recipe.AuthorId, recipe.Id, recipe.RecipeDetails)
	recipeSearchIndexTrans := newSearchHelper().getRecipeSearchIndexTransactions(recipe)

	update := expression.Add(expression.Name("recipeCount"), expression.Value(1))

	expr, err := expression.NewBuilder().WithUpdate(update).Build()
	if err != nil {
		log.Println("Failed to build update for recipe count increase!")
		return err
	}

	transactions := []types.TransactWriteItem{
		{
			Put: &types.Put{
				Item:      *utils.ToDatabaseFormat(authored),
				TableName: &utils.GetDependencies().MainTableName,
			},
		},
		{
			Put: &types.Put{
				Item:      *utils.ToDatabaseFormat(recipe),
				TableName: &utils.GetDependencies().MainTableName,
			},
		},
		{
			Update: &types.Update{
				Key:                       *models.UserKey(authored.UserId),
				TableName:                 &utils.GetDependencies().MainTableName,
				UpdateExpression:          expr.Update(),
				ExpressionAttributeNames:  expr.Names(),
				ExpressionAttributeValues: expr.Values(),
			},
		},
	}
	transactions = append(transactions, recipeSearchIndexTrans...)
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

func (r *recipeHelper) GetAllRecipes(lastKey map[string]types.AttributeValue, category string) (*getAllRecipesOutput, error) {
	utils.BasicLog("starting get all recipes helper function...", nil)
	var indexName *string
	var keyConditionExpression *string
	var expressionAttributeValues map[string]types.AttributeValue

	if category == "" || strings.ToLower(category) == "all" {
		// return all recipes
		utils.BasicLog("no category provided will return all recipes", nil)
		indexName = aws.String("gsiIndex")
		keyConditionExpression = aws.String("gsi = :v")
		expressionAttributeValues = map[string]types.AttributeValue{
			":v": &types.AttributeValueMemberS{Value: utils.AddPrefix(models.RecipeItemType, models.RecipesGsiPrefix)}} // gsi: RECIPE_TYPE#RECIPE
		utils.BasicLog("expression attribute values", utils.AddPrefix(models.RecipeItemType, models.RecipesGsiPrefix))
	} else {
		// return all recipes in a category
		utils.BasicLog("category provided will return recipes in that category", category)
		indexName = aws.String("gsiIndex2")
		keyConditionExpression = aws.String("gsi2 = :v")
		expressionAttributeValues = map[string]types.AttributeValue{
			":v": &types.AttributeValueMemberS{Value: utils.AddPrefix(strings.ToLower(category), models.RecipesGsi2Prefix)}} // gsi2: RECIPE_CAT#{category}
		utils.BasicLog("expression attr val ", utils.AddPrefix(strings.ToLower(category), models.RecipesGsi2Prefix))
	}

	input := &dynamodb.QueryInput{
		TableName:                 &utils.GetDependencies().MainTableName,
		IndexName:                 indexName,
		KeyConditionExpression:    keyConditionExpression,
		ExpressionAttributeValues: expressionAttributeValues,
		ExclusiveStartKey:         lastKey,
		ScanIndexForward:          aws.Bool(false),
		Limit:                     aws.Int32(10),
	}

	utils.BasicLog("gotten db input", input)

	result, err := utils.GetDependencies().DbClient.Query(r.Ctx, input)
	if err != nil {
		utils.BasicLog("failed to query the db for recipes", err)
		return nil, err
	}

	utils.BasicLog("db query successful", result)

	if result.Count < 1 {
		utils.BasicLog("no recipes found in db", nil)
		return &getAllRecipesOutput{
			Recipes: []models.Recipe{},
			NextKey: nil,
		}, nil
	}

	recipes := models.DatabaseItemsToRecipeStructs(&result.Items, utils.GetDependencies().CloudFrontDomainName)

	utils.BasicLog("db item to recipes successful", recipes)
	utils.BasicLog("last eval key", result.LastEvaluatedKey)

	return &getAllRecipesOutput{
		Recipes: *recipes,
		NextKey: result.LastEvaluatedKey,
	}, nil
}

// get specific recipe from db
func (this *recipeHelper) Get(recipeId string) (*models.Recipe, error) {
	input := &dynamodb.GetItemInput{
		Key:       *models.RecipeKey(recipeId),
		TableName: &utils.GetDependencies().MainTableName,
	}

	item, err := utils.GetDependencies().DbClient.GetItem(this.Ctx, input)
	if err != nil {
		log.Println("failed to get recipe form database")
		return nil, err
	}

	if len(item.Item) < 1 {
		return nil, nil
	}

	recipes := models.DatabaseItemsToRecipeStructs(&[]map[string]types.AttributeValue{item.Item}, utils.GetDependencies().CloudFrontDomainName)

	recipe := (*recipes)[0]
	return &recipe, nil
}

func (r *recipeHelper) IncreaseViewCount(recipe models.Recipe) error {
	update := expression.Set(
		expression.Name("views"),
		expression.Plus(
			expression.IfNotExists(expression.Name("views"), expression.Value(0)),
			expression.Value(1),
		),
	)
	expr, err := expression.NewBuilder().WithUpdate(update).Build()
	if err != nil {
		println("Failed to build update for view count")
		return err
	}

	input := &dynamodb.TransactWriteItemsInput{
		TransactItems: []types.TransactWriteItem{
			{
				Update: &types.Update{
					Key:                       *models.RecipeKey(recipe.Id),
					TableName:                 &utils.GetDependencies().MainTableName,
					UpdateExpression:          expr.Update(),
					ExpressionAttributeNames:  expr.Names(),
					ExpressionAttributeValues: expr.Values(),
				},
			},
			{
				Update: &types.Update{
					Key:                       *models.UserKey(recipe.AuthorId),
					TableName:                 &utils.GetDependencies().MainTableName,
					UpdateExpression:          expr.Update(),
					ExpressionAttributeNames:  expr.Names(),
					ExpressionAttributeValues: expr.Values(),
				},
			},
		},
	}
	_, err = utils.GetDependencies().DbClient.TransactWriteItems(r.Ctx, input)
	return err
}

// deletes recipe from db
func (r *recipeHelper) Delete(recipe models.Recipe) error {
	update := expression.Set(
		expression.Name("recipeCount"),
		expression.Minus(
			expression.IfNotExists(expression.Name("recipeCount"), expression.Value(0)),
			expression.Value(1),
		),
	)

	condition := expression.GreaterThan(
		expression.Name("recipeCount"),
		expression.Value(0),
	)

	expr, err := expression.NewBuilder().
		WithUpdate(update).
		WithCondition(condition).
		Build()

	if err != nil {
		println("Failed to build reduce author recipe count update!")
		return err
	}

	transactions := []types.TransactWriteItem{
		{
			Delete: &types.Delete{
				Key:       *models.RecipeKey(recipe.Id),
				TableName: &utils.GetDependencies().MainTableName,
			},
		},
		{
			Delete: &types.Delete{
				Key:       models.AuthoredKey(recipe.AuthorId, recipe.Id),
				TableName: &utils.GetDependencies().MainTableName,
			},
		},
		{
			Update: &types.Update{
				Key:                       *models.UserKey(recipe.AuthorId),
				TableName:                 &utils.GetDependencies().MainTableName,
				UpdateExpression:          expr.Update(),
				ConditionExpression:       expr.Condition(),
				ExpressionAttributeNames:  expr.Names(),
				ExpressionAttributeValues: expr.Values(),
			},
		},
	}

	input := &dynamodb.TransactWriteItemsInput{
		TransactItems: transactions,
	}

	_, err = utils.GetDependencies().DbClient.TransactWriteItems(r.Ctx, input)
	if err != nil {
		return err
	}

	// del search indexes
	keysToDelete := models.GetSearchItemKeys(recipe.Name, recipe.Id, models.SEARCH_ITEM_TYPE_RECIPE)

	helper := newHelper(r.Ctx)
	for _, key := range *keysToDelete {
		err := helper.deleteFromDb(&key)
		if err != nil {
			log.Printf("An error occurred while trying to delete recipe search index! ERROR: %v", err)
		}
	}

	return nil
}

func (r *recipeHelper) UpdateRecipe(recipeId string, recipe models.Recipe) error {
	update := expression.UpdateBuilder{}
	hasUpdates := false

	if recipe.ImageUrl != "" {
		update = update.Set(expression.Name("imageUrl"), expression.Value(recipe.ImageUrl))
		hasUpdates = true
	}
	if recipe.Name != "" {
		update = update.Set(expression.Name("name"), expression.Value(recipe.Name))
		hasUpdates = true
	}
	if recipe.Description != "" {
		update = update.Set(expression.Name("description"), expression.Value(recipe.Description))
		hasUpdates = true
	}
	if recipe.Category != "" {
		update = update.Set(expression.Name("gsi2"), expression.Value(
			utils.AddPrefix(recipe.Category, models.RecipesGsi2Prefix),
		))
		hasUpdates = true
	}
	if len(recipe.Ingredients) > 0 {
		update = update.Set(expression.Name("ingredients"), expression.Value(recipe.Ingredients))
		hasUpdates = true
	}
	if recipe.PreparationTime > 0 {
		update = update.Set(expression.Name("preparationTime"), expression.Value(recipe.PreparationTime))
		hasUpdates = true
	}
	if recipe.Difficulty != "" {
		update = update.Set(expression.Name("difficulty"), expression.Value(recipe.Difficulty))
		hasUpdates = true
	}
	if len(recipe.Instructions) > 0 {
		update = update.Set(expression.Name("instructions"), expression.Value(recipe.Instructions))
		hasUpdates = true
	}

	update = update.Set(expression.Name("isPublic"), expression.Value(recipe.IsPublic))
	hasUpdates = true

	if !hasUpdates {
		return fmt.Errorf("no fields to update")
	}

	expr, err := expression.NewBuilder().WithUpdate(update).Build()
	if err != nil {
		return fmt.Errorf("failed to build expression: %w", err)
	}

	input := &dynamodb.UpdateItemInput{
		Key:                       *models.RecipeKey(recipeId),
		TableName:                 &utils.GetDependencies().MainTableName,
		UpdateExpression:          expr.Update(),
		ExpressionAttributeNames:  expr.Names(),
		ExpressionAttributeValues: expr.Values(),
	}

	_, err = utils.GetDependencies().DbClient.UpdateItem(r.Ctx, input)
	if err != nil {
		log.Println("Failed to update recipe")
		return err
	}

	return nil
}

func (r *recipeHelper) RecipeLikesPlus1(userId, recipeId string) error {
	input := &dynamodb.UpdateItemInput{
		Key:              *models.RecipeKey(recipeId),
		TableName:        &utils.GetDependencies().MainTableName,
		UpdateExpression: aws.String("ADD likes :inc"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":inc": &types.AttributeValueMemberN{Value: fmt.Sprintf("%d", 1)},
		},
	}

	_, err := utils.GetDependencies().DbClient.UpdateItem(r.Ctx, input)
	if err != nil {
		log.Printf("failed to increase like count!!!, ERROR: %v", err)
		return err
	}

	return nil
}

func (r *recipeHelper) RecipeLikesMinus1(userId, recipeId string) error {
	input := &dynamodb.UpdateItemInput{
		Key:              *models.RecipeKey(recipeId),
		TableName:        &utils.GetDependencies().MainTableName,
		UpdateExpression: aws.String("SET likes = if_not_exists(likes, :zero) - :inc"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":inc":  &types.AttributeValueMemberN{Value: fmt.Sprintf("%d", 1)},
			":zero": &types.AttributeValueMemberN{Value: "0"},
			":min":  &types.AttributeValueMemberN{Value: fmt.Sprintf("%d", 0)},
		},
		ConditionExpression: aws.String("attribute_not_exists(likes) OR likes >= :min"),
	}

	_, err := utils.GetDependencies().DbClient.UpdateItem(r.Ctx, input)
	if err != nil {
		log.Printf("failed to decrease like count!!! ERROR: %v", err)
		return err
	}

	return nil
}
