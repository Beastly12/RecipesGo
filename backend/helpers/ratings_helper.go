package helpers

import (
	"backend"
	"backend/models"
	"backend/utils"
	"context"

	"github.com/aws/aws-sdk-go-v2/aws"
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

	NewQueueHelper(r.Ctx).PutInQueue(WithRateAction(*rating))

	return nil
}

func (r *ratingsHelper) RemoveRating(recipeId, userId string) error {
	return newHelper(r.Ctx).deleteFromDb(models.RatingKey(recipeId, userId))
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
