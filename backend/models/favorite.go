package models

import (
	"backend/utils"
	"strings"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

const (
	FavoritePkPrefix = UserPkPrefix
	FavoriteSkPrefix = "FAVORITE#"
)

// pk: USER#{userid} sk: FAVORITE#{recipe_id} recipe_details: ...
type Favorite struct {
	UserId   string `dynamodbav:"pk" json:"userid"`
	RecipeId string `dynamodbav:"sk" json:"-"`
	RecipeDetails
	DateAdded string `dynamodbav:"dateAdded" json:"dateAdded"`
}

func NewFavorite(userid string, recipe *Recipe) *Favorite {
	return &Favorite{
		UserId:        userid,
		RecipeId:      recipe.Id,
		RecipeDetails: recipe.RecipeDetails,
		DateAdded:     utils.GetTimeNow(),
	}
}

// DANGEROUS CODE: applies prefixes for database storage
func (f *Favorite) ApplyPrefixes() {
	f.UserId = utils.AddPrefix(f.UserId, FavoritePkPrefix)
	f.RecipeId = utils.AddPrefix(f.RecipeId, FavoriteSkPrefix)
}

func DbItemsToFavoriteStructs(items *[]map[string]types.AttributeValue) *[]Favorite {
	return utils.DatabaseItemToStruct(items, func(f *Favorite) {
		f.UserId = strings.TrimPrefix(f.UserId, FavoritePkPrefix)
		f.RecipeId = strings.TrimPrefix(f.RecipeId, FavoriteSkPrefix)
	})
}

func FavoriteKey(userid, recipeId string) *map[string]types.AttributeValue {
	return &map[string]types.AttributeValue{
		"pk": &types.AttributeValueMemberS{Value: FavoritePkPrefix + userid},
		"sk": &types.AttributeValueMemberS{Value: FavoriteSkPrefix + recipeId},
	}
}
