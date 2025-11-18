package helpers

import (
	"backend"
	"backend/models"
	"backend/utils"
	"context"
	"fmt"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/expression"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

type ratingsHelper struct {
	Ctx context.Context
}

type getRatingsOutput struct {
	Ratings *[]models.Rating
	LastKey map[string]types.AttributeValue
}

func NewRatingsHelper(ctx context.Context) *ratingsHelper {
	return &ratingsHelper{
		Ctx: ctx,
	}
}

func (r *ratingsHelper) AddRating(rating *models.Rating) error {
	err := newHelper(r.Ctx).putIntoDb(utils.ToDatabaseFormat(rating))
	if err != nil {
		return err
	}

	NewQueueHelper(r.Ctx).PutInQueue(WithRecalculateRatingsAction(rating.RecipeId))

	return nil
}

func (r *ratingsHelper) RemoveRating(recipeId, userId string) error {
	err := newHelper(r.Ctx).deleteFromDb(models.RatingKey(recipeId, userId))
	if err != nil {
		return err
	}

	NewQueueHelper(r.Ctx).PutInQueue(WithRecalculateRatingsAction(recipeId))

	return nil
}

func (r *ratingsHelper) UpdateRating(recipeId, authorId string) error {
	// calc the new rating for given recipe
	recipeRating, err := NewRatingsHelper(r.Ctx).GetRecipeRatingAverage(recipeId)
	if err != nil {
		log.Printf("Failed to get recipe average rating! ERROR: %v", err)
		return err
	}

	// calc the new overall rating for author
	authorRating, err := NewUserHelper(r.Ctx).RecalculateRecipesOverallRatings(authorId)
	if err != nil {
		log.Printf("Failed to get author average rating! ERROR: %v", err)
		return err
	}
	log.Printf("AUTHORS OVERALL RATING: %v", authorRating)

	// update the recipe rating
	updateRecipeRating := expression.Set(expression.Name("rating"), expression.Value(recipeRating))
	recipeExpr, err := expression.NewBuilder().WithUpdate(updateRecipeRating).Build()
	if err != nil {
		return fmt.Errorf("failed to build recipe expression: %w", err)
	}

	// update the author rating
	updateAuthorRating := expression.Set(expression.Name("overallRating"), expression.Value(authorRating))
	authorExpr, err := expression.NewBuilder().WithUpdate(updateAuthorRating).Build()
	if err != nil {
		return fmt.Errorf("failed to build author expression: %w", err)
	}

	// add transactions
	transactions := []types.TransactWriteItem{
		{
			Update: &types.Update{
				Key:                       *models.RecipeKey(recipeId),
				TableName:                 &utils.GetDependencies().MainTableName,
				UpdateExpression:          recipeExpr.Update(),
				ExpressionAttributeNames:  recipeExpr.Names(),
				ExpressionAttributeValues: recipeExpr.Values(),
			},
		},
		{
			Update: &types.Update{
				Key:                       *models.UserKey(authorId),
				TableName:                 &utils.GetDependencies().MainTableName,
				UpdateExpression:          authorExpr.Update(),
				ExpressionAttributeNames:  authorExpr.Names(),
				ExpressionAttributeValues: authorExpr.Values(),
			},
		},
	}

	input := &dynamodb.TransactWriteItemsInput{
		TransactItems: transactions,
	}

	_, err = utils.GetDependencies().DbClient.TransactWriteItems(r.Ctx, input)
	if err != nil {
		utils.PrintTransactWriteCancellationReason(err)
		return err
	}

	return nil
}

func (r *ratingsHelper) GetRecipeRatings(recipeId string, lastKey map[string]types.AttributeValue) (*getRatingsOutput, error) {
	input := &dynamodb.QueryInput{
		TableName:              &utils.GetDependencies().MainTableName,
		KeyConditionExpression: aws.String("pk = :pk AND begins_with(sk, :sk)"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":pk": &types.AttributeValueMemberS{Value: utils.AddPrefix(recipeId, models.RatingPkPrefix)},
			":sk": &types.AttributeValueMemberS{Value: models.RatingSkPrefix},
		},
		Limit:             aws.Int32(backend.MAX_RECIPES_DUMP),
		ExclusiveStartKey: lastKey,
	}

	result, err := utils.GetDependencies().DbClient.Query(r.Ctx, input)
	if err != nil {
		return nil, err
	}

	if result.Count < 1 {
		return &getRatingsOutput{
			Ratings: &[]models.Rating{},
			LastKey: nil,
		}, nil
	}

	ratings := models.DbItemsToRatingsStructs(&result.Items)

	for i, rating := range *ratings {
		user, err := NewUserHelper(r.Ctx).GetDisplayDetails(rating.Userid)
		if err != nil || user == nil {
			(*ratings)[i].UserDpUrl = ""
			(*ratings)[i].UserName = "Unknown user"

			continue
		}

		(*ratings)[i].UserDpUrl = user.DpUrl
		(*ratings)[i].UserName = user.Name
	}

	return &getRatingsOutput{
		Ratings: ratings,
		LastKey: result.LastEvaluatedKey,
	}, nil
}

func (r *ratingsHelper) GetRecipeRatingAverage(recipeId string) (float32, error) {
	var sum float32
	var count int
	var last map[string]types.AttributeValue

	for {
		results, err := r.GetRecipeRatings(recipeId, last)
		if err != nil {
			return 0, err
		}
		for _, rating := range *results.Ratings {
			sum += float32(rating.Stars)
			count++
		}

		if len(results.LastKey) == 0 {
			break
		}

		last = results.LastKey
	}

	if count == 0 {
		return 0, nil
	}

	return sum / float32(count), nil
}
