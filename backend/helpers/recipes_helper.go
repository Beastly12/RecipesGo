package helpers

import (
	"backend"
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

type getRecipesOutput struct {
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
	update := expression.Add(expression.Name("recipeCount"), expression.Value(1))

	expr, err := expression.NewBuilder().WithUpdate(update).Build()
	if err != nil {
		log.Println("Failed to build update for recipe count increase!")
		return err
	}

	transactions := []types.TransactWriteItem{
		{
			Put: &types.Put{
				Item:      *utils.ToDatabaseFormat(recipe),
				TableName: &utils.GetDependencies().MainTableName,
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

func (r *recipeHelper) getRecipes(lastKey map[string]types.AttributeValue, keyCondition expression.KeyConditionBuilder, indexName string, postProcess func(*[]models.Recipe)) (*getRecipesOutput, error) {
	expr, err := expression.NewBuilder().WithKeyCondition(keyCondition).Build()
	if err != nil {
		println("Failed to build key condition expression")
		return nil, err
	}

	input := &dynamodb.QueryInput{
		TableName:                 &utils.GetDependencies().MainTableName,
		ExclusiveStartKey:         lastKey,
		IndexName:                 &indexName,
		KeyConditionExpression:    expr.KeyCondition(),
		ExpressionAttributeNames:  expr.Names(),
		ExpressionAttributeValues: expr.Values(),
		ScanIndexForward:          aws.Bool(false),
		Limit:                     aws.Int32(backend.MAX_RECIPES_DUMP),
	}

	result, err := utils.GetDependencies().DbClient.Query(r.Ctx, input)
	if err != nil {
		return nil, err
	}

	if len(result.Items) < 1 {
		return &getRecipesOutput{
			Recipes: []models.Recipe{},
			NextKey: nil,
		}, nil
	}

	recipes := models.DatabaseItemsToRecipeStructs(&result.Items)

	postProcess(recipes)

	return &getRecipesOutput{
		Recipes: *recipes,
		NextKey: result.LastEvaluatedKey,
	}, nil
}

func (r *recipeHelper) GetRecipes(lastKey map[string]types.AttributeValue, category string) (*getRecipesOutput, error) {
	index := "gsiIndex"
	keyCondition := expression.KeyEqual(expression.Key("gsi"), expression.Value(models.RecipeTypeKey())).And(
		expression.KeyBeginsWith(expression.Key("lsi"), models.RecipesLsiPrefix),
	)

	if category != "" {
		index = "gsiIndex2"
		keyCondition = expression.KeyEqual(expression.Key("gsi2"), expression.Value(models.RecipeCategoryKey(strings.ToLower(category)))).And(
			expression.KeyBeginsWith(expression.Key("lsi"), models.RecipesLsiPrefix),
		)
	}

	return r.getRecipes(lastKey, keyCondition, index, func(rcp *[]models.Recipe) {
		for i, recipe := range *rcp {
			user, err := NewUserHelper(r.Ctx).GetDisplayDetails(recipe.AuthorId)
			if err != nil || user == nil {
				(*rcp)[i].AuthorDpUrl = ""
				(*rcp)[i].AuthorName = "[deleted]"
				continue
			}

			(*rcp)[i].AuthorDpUrl = user.DpUrl
			(*rcp)[i].AuthorName = user.Name
		}
	})
}

func (r *recipeHelper) GetPrivateRecipes(lastKey map[string]types.AttributeValue, category, userId string) (*getRecipesOutput, error) {
	println("START GETTING PRIV RECIPES")
	if userId == "" {
		println("no user id provided")
		return &getRecipesOutput{
			Recipes: []models.Recipe{},
			NextKey: nil,
		}, nil
	}
	println("GETTING PRIVATE RECIPES: " + userId)
	index := "gsiIndex"
	keyCondition := expression.KeyEqual(expression.Key("gsi"), expression.Value(models.RecipeTypeKey())).And(
		expression.KeyBeginsWith(expression.Key("lsi"), models.PrivateRecipeLsiBeginsWith(userId)),
	)

	println(models.RecipeTypeKey())
	println(models.PrivateRecipeLsiBeginsWith(userId))

	if category != "" {
		index = "gsiIndex2"
		keyCondition = expression.KeyEqual(expression.Key("gsi2"), expression.Value(models.RecipeCategoryKey(category))).And(
			expression.KeyBeginsWith(expression.Key("lsi"), models.PrivateRecipeLsiBeginsWith(userId)),
		)
	}

	return r.getRecipes(lastKey, keyCondition, index, func(rcp *[]models.Recipe) {
		user, err := NewUserHelper(r.Ctx).GetDisplayDetails(userId)
		for i := range *rcp {
			if err != nil || user == nil {
				(*rcp)[i].AuthorDpUrl = ""
				(*rcp)[i].AuthorName = "[deleted]"
				continue
			}

			(*rcp)[i].AuthorDpUrl = user.DpUrl
			(*rcp)[i].AuthorName = user.Name
		}
	})
}

func (r *recipeHelper) GetRecipesByUser(lastKey map[string]types.AttributeValue, userId string, includePrivateRecipes bool) (*getRecipesOutput, error) {
	index := "gsiIndex3"

	keyCondition := expression.KeyEqual(
		expression.Key(
			"gsi3",
		),
		expression.Value(
			utils.AddPrefix(userId, models.RecipesGsi3Prefix),
		),
	).And(
		expression.KeyBeginsWith(expression.Key("lsi"), models.RecipesLsiPrefix),
	)

	if includePrivateRecipes {
		keyCondition = expression.KeyEqual(
			expression.Key(
				"gsi3",
			),
			expression.Value(
				utils.AddPrefix(userId, models.RecipesGsi3Prefix),
			),
		)
	}

	return r.getRecipes(lastKey, keyCondition, index, func(rcp *[]models.Recipe) {
		user, err := NewUserHelper(r.Ctx).GetDisplayDetails(userId)
		for i := range *rcp {
			if err != nil || user == nil {
				(*rcp)[i].AuthorDpUrl = ""
				(*rcp)[i].AuthorName = "[deleted]"
				continue
			}

			(*rcp)[i].AuthorDpUrl = user.DpUrl
			(*rcp)[i].AuthorName = user.Name
		}
	})
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

	recipe := (*models.DatabaseItemsToRecipeStructs(&[]map[string]types.AttributeValue{item.Item}))[0]

	user, err := NewUserHelper(this.Ctx).GetDisplayDetails(recipe.AuthorId)
	if err != nil || user == nil {
		recipe.AuthorDpUrl = ""
		recipe.AuthorName = "[Deleted]"

		return &recipe, nil
	}

	recipe.AuthorDpUrl = user.DpUrl
	recipe.AuthorName = user.Name

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

	return nil
}

func (r *recipeHelper) UpdateRecipe(recipeId string, recipe models.Recipe) error {
	update := expression.UpdateBuilder{}
	if recipe.ImageUrl != "" {
		update = update.Set(expression.Name("imageUrl"), expression.Value(recipe.ImageUrl))
	}
	if recipe.Name != "" {
		update = update.Set(expression.Name("name"), expression.Value(recipe.Name))
	}
	if recipe.Description != "" {
		update = update.Set(expression.Name("description"), expression.Value(recipe.Description))
	}
	if recipe.Category != "" {
		update = update.Set(expression.Name("gsi2"), expression.Value(
			utils.AddPrefix(recipe.Category, models.RecipesGsi2Prefix),
		))
	}
	if len(recipe.Ingredients) > 0 {
		update = update.Set(expression.Name("ingredients"), expression.Value(recipe.Ingredients))
	}
	if recipe.PreparationTime > 0 {
		update = update.Set(expression.Name("preparationTime"), expression.Value(recipe.PreparationTime))
	}
	if recipe.Difficulty != "" {
		update = update.Set(expression.Name("difficulty"), expression.Value(recipe.Difficulty))
	}
	if len(recipe.Instructions) > 0 {
		update = update.Set(expression.Name("instructions"), expression.Value(recipe.Instructions))
	}

	update = update.Set(expression.Name("isPublic"), expression.Value(recipe.IsPublic))
	update = update.Set(expression.Name("lsi"), expression.Value(models.GetRecipeDateWithPrefix(recipe)))

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

func (r *recipeHelper) SearchRecipe(str string) (*[]models.Recipe, error) {
	keyCondition := expression.KeyEqual(
		expression.Key("gsi"),
		expression.Value(utils.AddPrefix(models.RecipeItemType, models.RecipesGsiPrefix)),
	)

	expr, err := expression.NewBuilder().WithKeyCondition(keyCondition).Build()
	if err != nil {
		println("Failed to build query expression")
		return nil, err
	}

	input := &dynamodb.QueryInput{
		TableName:                 &utils.GetDependencies().MainTableName,
		KeyConditionExpression:    expr.KeyCondition(),
		ExpressionAttributeNames:  expr.Names(),
		ExpressionAttributeValues: expr.Values(),
		IndexName:                 aws.String("gsiIndex"),
		ScanIndexForward:          aws.Bool(false),
	}

	found, err := newHelper(r.Ctx).searchDb(input, "name", str)
	if err != nil {
		println("ERROR OCCURRED WHILE SEARCHING RECIPES")
		return nil, err
	}

	matchingRecipes := models.DatabaseItemsToRecipeStructs(found)

	return matchingRecipes, nil
}
