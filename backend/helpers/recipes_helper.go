package helpers

import (
	"backend/models"
	"backend/utils"
	"context"
	"log"
	"strings"

	"github.com/aws/aws-sdk-go-v2/aws"
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
	input := &dynamodb.TransactWriteItemsInput{
		TransactItems: []types.TransactWriteItem{
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
		},
	}

	_, err := utils.GetDependencies().DbClient.TransactWriteItems(this.Ctx, input)
	if err != nil {
		utils.PrintTransactWriteCancellationReason(err)
		return err
	}

	return nil
}

func (r *recipeHelper) GetAllRecipes(lastKey map[string]types.AttributeValue, category string) (*getAllRecipesOutput, error) {
	var indexName *string
	var keyConditionExpression *string
	var expressionAttributeValues map[string]types.AttributeValue

	if category == "" {
		// return all recipes
		indexName = aws.String("gsiIndex")
		keyConditionExpression = aws.String("gsi = :v")
		expressionAttributeValues = map[string]types.AttributeValue{
			":v": &types.AttributeValueMemberS{Value: utils.AddPrefix(models.RecipeItemType, models.RecipesGsiPrefix)}} // gsi: RECIPE_TYPE#RECIPE
	} else {
		// return all recipes in a category
		indexName = aws.String("gsi2Index")
		keyConditionExpression = aws.String("gsi2 = :v")
		expressionAttributeValues = map[string]types.AttributeValue{
			":v": &types.AttributeValueMemberS{Value: utils.AddPrefix(strings.ToLower(category), models.RecipesGsi2Prefix)}} // gsi2: RECIPE_CAT#{category}
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

	result, err := utils.GetDependencies().DbClient.Query(r.Ctx, input)
	if err != nil {
		return nil, err
	}

	if result.Count < 1 {
		return nil, nil
	}

	recipes := models.DatabaseItemsToRecipeStructs(&result.Items, utils.GetDependencies().CloudFrontDomainName)

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

// deletes recipe from db
func (r *recipeHelper) Delete(recipeId string) error {
	return newHelper(r.Ctx).deleteFromDb(models.RecipeKey(recipeId))
}
