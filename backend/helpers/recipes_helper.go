package helpers

import (
	"backend"
	"backend/models"
	"backend/utils"
	"context"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

type recipeHelper struct {
	Ctx context.Context
}

func NewRecipeHelper(ctx context.Context) *recipeHelper {
	return &recipeHelper{
		Ctx: ctx,
	}
}

// adds recipe to db
func (this *recipeHelper) Add(recipe *models.Recipe) error {
	return newHelper(this.Ctx).putIntoDb(utils.ToDatabaseFormat(recipe))
}

// get all recipes in db
func (this *recipeHelper) GetAll(lastEvalKey string) (*[]models.Recipe, error) {
	input := &dynamodb.QueryInput{
		TableName:              &utils.GetDependencies().MainTableName,
		IndexName:              aws.String("NicknameIndex"),
		KeyConditionExpression: aws.String("nickname = :n"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":n": &types.AttributeValueMemberS{Value: models.RecipesSkPrefix},
		},
		Limit: aws.Int32(backend.MAX_RECIPES_DUMP),
	}

	if lastEvalKey != "" {
		// not first page
		input.ExclusiveStartKey = *models.RecipeKey(lastEvalKey)
	}

	items, err := utils.GetDependencies().DbClient.Query(this.Ctx, input)
	if err != nil {
		log.Println("failed to get all recipes from db")
		return nil, err
	}

	recipes := models.DatabaseItemsToRecipeStructs(&items.Items, utils.GetDependencies().CloudFrontDomainName)

	return recipes, nil
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
