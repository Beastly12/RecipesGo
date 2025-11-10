package models

import (
	"backend/utils"
	"strings"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

const (
	FavoritePkPrefix  = "FAVORITE_BY#"
	FavoriteSkPrefix  = "FAVORITE#"
	FavoriteGsiPrefix = "FAVORITE_CAT#"
)

type Favorite struct {
	UserId      string `dynamodbav:"pk" json:"userid"`
	RecipeId    string `dynamodbav:"sk" json:"-"`
	Category    string `dynamodbav:"gsi" json:"category"`
	RecipeIdGsi string `dynamodbav:"gsi2" json:"-"`
	DateAdded   string `dynamodbav:"lsi" json:"dateAdded"`
}

func NewFavorite(userid string, recipe *Recipe) *Favorite {
	return &Favorite{
		UserId:      userid,
		RecipeId:    recipe.Id,
		RecipeIdGsi: utils.RemovePrefix(recipe.Id, "#"),
		Category:    recipe.Category,
		DateAdded:   utils.GetTimeNow(),
	}
}

// DANGEROUS CODE: applies prefixes for database storage
func (f *Favorite) ApplyPrefixes() {
	f.UserId = utils.AddPrefix(f.UserId, FavoritePkPrefix)
	f.RecipeId = utils.AddPrefix(f.RecipeId, FavoriteSkPrefix)
	f.Category = utils.AddPrefix(f.Category, FavoriteGsiPrefix)
}

func DbItemsToFavoriteStructs(items *[]map[string]types.AttributeValue) *[]Favorite {
	return utils.DatabaseItemsToStructs(items, func(f *Favorite) {
		f.UserId = strings.TrimPrefix(f.UserId, FavoritePkPrefix)
		f.RecipeId = strings.TrimPrefix(f.RecipeId, FavoriteSkPrefix)
		f.Category = strings.TrimPrefix(f.Category, FavoriteGsiPrefix)
	})
}

func FavoriteKey(userid, recipeId string) *map[string]types.AttributeValue {
	return &map[string]types.AttributeValue{
		"pk": &types.AttributeValueMemberS{Value: FavoritePkPrefix + userid},
		"sk": &types.AttributeValueMemberS{Value: FavoriteSkPrefix + recipeId},
	}
}
