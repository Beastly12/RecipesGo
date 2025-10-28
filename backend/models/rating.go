package models

import (
	"backend/utils"
	"strings"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

const (
	RatingPkPrefix = "RECIPE#"
	RatingSkPrefix = "RATED_BY#"
)

type Rating struct {
	RecipeId  string `dynamodbav:"sk" json:"RecipeId"`
	Userid    string `dynamodbav:"pk" json:"userId"`
	Stars     int    `dynamodbav:"stars" json:"stars"`
	Comment   string `dynamodbav:"comment" json:"comment"`
	DateAdded string `dynamodbav:"lsi" json:"dateAdded"`
}

func NewRating(userId, recipeId, comment string, stars int) *Rating {
	return &Rating{
		RecipeId:  recipeId,
		Userid:    userId,
		Stars:     stars,
		Comment:   comment,
		DateAdded: utils.GetTimeNow(),
	}
}

func (r *Rating) ApplyPrefixes() {
	r.RecipeId = utils.AddPrefix(r.RecipeId, RatingPkPrefix)
	r.Userid = utils.AddPrefix(r.Userid, RatingSkPrefix)
}

func DbItemsToRatingsStructs(items *[]map[string]types.AttributeValue) *[]Rating {
	return utils.DatabaseItemToStruct(items, func(r *Rating) {
		r.RecipeId = strings.TrimPrefix(r.RecipeId, RatingPkPrefix)
		r.Userid = strings.TrimPrefix(r.Userid, RatingSkPrefix)
	})
}

func RatingKey(recipeId, userId string) *map[string]types.AttributeValue {
	return &map[string]types.AttributeValue{
		"pk": &types.AttributeValueMemberS{Value: utils.AddPrefix(recipeId, RatingPkPrefix)},
		"sk": &types.AttributeValueMemberS{Value: utils.AddPrefix(userId, RatingSkPrefix)},
	}
}
