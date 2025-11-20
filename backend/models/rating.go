package models

import (
	"backend/utils"
	"strings"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

const (
	RatingPkPrefix  = "RECIPE_RATED#"
	RatingSkPrefix  = "RATED_BY#"
	RatingGsiPrefix = "RATER_NAME#"
)

type Rating struct {
	RecipeId  string `dynamodbav:"pk" json:"RecipeId"`
	Userid    string `dynamodbav:"sk" json:"userId"`
	UserDpUrl string `dynamodbav:"-" json:"dpUrl"`
	UserName  string `dynamodbav:"-" json:"name"`
	Stars     int    `dynamodbav:"stars" json:"stars"`
	Comment   string `dynamodbav:"comment" json:"comment"`
	DateAdded string `dynamodbav:"lsi" json:"dateAdded"`
}

func NewRating(user User, recipeId, comment string, stars int) *Rating {
	return &Rating{
		RecipeId:  recipeId,
		Userid:    user.Userid,
		UserDpUrl: user.DpUrl,
		UserName:  user.Name,
		Stars:     stars,
		Comment:   comment,
		DateAdded: utils.GetTimeNow(),
	}
}

func (r *Rating) ApplyPrefixes() {
	r.RecipeId = utils.AddPrefix(r.RecipeId, RatingPkPrefix)
	r.Userid = utils.AddPrefix(r.Userid, RatingSkPrefix)
	r.UserName = utils.AddPrefix(r.UserName, RatingGsiPrefix)
}

func DbItemsToRatingsStructs(items *[]map[string]types.AttributeValue) *[]Rating {
	return utils.DatabaseItemsToStructs(items, func(r *Rating) {
		r.RecipeId = strings.TrimPrefix(r.RecipeId, RatingPkPrefix)
		r.Userid = strings.TrimPrefix(r.Userid, RatingSkPrefix)
		r.UserName = utils.RemovePrefix(r.UserName, "#")
		if r.UserDpUrl != "" {
			r.UserDpUrl = utils.GenerateViewURL(r.UserDpUrl, utils.GetDependencies().CloudFrontDomainName)
		}
	})
}

func DbItemToRatingStruct(item *map[string]types.AttributeValue) *Rating {
	items := []map[string]types.AttributeValue{*item}
	ratings := DbItemsToRatingsStructs(&items)
	return &(*ratings)[0]
}

func RatingKey(recipeId, userId string) *map[string]types.AttributeValue {
	userId = utils.RemovePrefix(userId, "#")
	recipeId = utils.RemovePrefix(recipeId, "#")
	return &map[string]types.AttributeValue{
		"pk": &types.AttributeValueMemberS{Value: utils.AddPrefix(recipeId, RatingPkPrefix)},
		"sk": &types.AttributeValueMemberS{Value: utils.AddPrefix(userId, RatingSkPrefix)},
	}
}
