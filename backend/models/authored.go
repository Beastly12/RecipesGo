package models

import (
	"backend/utils"
	"strings"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

// query recipe by author,

const (
	AuthoredPkPrefix  = "AUTHOR#"
	AuthoredSkPrefix  = "AUTHORED#"
	AuthoredLsiPrefix = "DATE_CREATED#"
)

type Authored struct {
	UserId      string `dynamodbav:"pk" json:"userId"`
	RecipeId    string `dynamodbav:"sk" json:"recipeId"`
	RecipeIdGsi string `dynamodbav:"gsi2" json:"-"`
	DateCreated string `dynamodbav:"lsi" json:"dateCreated"`
}

func NewAuthoredRecipe(userId, recipeId string, recipeDetails RecipeDetails) *Authored {
	return &Authored{
		UserId:      userId,
		RecipeId:    recipeId,
		RecipeIdGsi: utils.RemovePrefix(recipeId, "#"),
		DateCreated: utils.GetTimeNow(),
	}
}

func (a *Authored) ApplyPrefixes() {
	a.UserId = utils.AddPrefix(a.UserId, AuthoredPkPrefix)
	a.RecipeId = utils.AddPrefix(a.RecipeId, AuthoredSkPrefix)
	a.DateCreated = utils.AddPrefix(a.DateCreated, AuthoredLsiPrefix)
}

func DbItemsToAuthoredStructs(items *[]map[string]types.AttributeValue, cloudfrontDomainName string) *[]Authored {
	return utils.DatabaseItemsToStructs(items, func(a *Authored) {
		a.UserId = strings.TrimPrefix(a.UserId, AuthoredPkPrefix)
		a.RecipeId = strings.TrimPrefix(a.RecipeId, AuthoredSkPrefix)
		a.DateCreated = strings.TrimPrefix(a.DateCreated, AuthoredLsiPrefix)
	})
}

func AuthoredKey(authorId, recipeId string) map[string]types.AttributeValue {
	return map[string]types.AttributeValue{
		"pk": &types.AttributeValueMemberS{Value: utils.AddPrefix(authorId, AuthoredPkPrefix)},
		"sk": &types.AttributeValueMemberS{Value: utils.AddPrefix(recipeId, AuthoredSkPrefix)},
	}
}
