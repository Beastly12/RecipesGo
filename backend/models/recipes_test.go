package models

import (
	"reflect"
	"testing"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func TestNewRecipe(t *testing.T) {
	result := NewRecipe(
		"Hot water",
		"cdn.test.com",
		"johnny_test",
		"A very delicious cup of hot water",
		"water", "cast iron skillet",
	)

	expect := &Recipe{
		Id:          result.Id,
		ImageUrl:    "cdn.test.com",
		Name:        "Hot water",
		AuthorName:  "johnny_test",
		Description: "A very delicious cup of hot water",
		Ingredients: []string{"water", "cast iron skillet"},
		SortKey:     "RECIPE",
	}

	if !reflect.DeepEqual(result, expect) {
		t.Errorf("Expected %v but got %v instead", expect, result)
	}
}

func TestDbItemToRecipesStruct(t *testing.T) {
	expect := Recipe{
		Id:          "123",
		ImageUrl:    "cdn.test.com",
		Name:        "White rice",
		AuthorName:  "johnny_test",
		Description: "Plain white rice",
		Ingredients: []string{"Rice", "Water"},
		SortKey:     "RECIPE",
	}

	items := []map[string]types.AttributeValue{
		{
			"pk":          &types.AttributeValueMemberS{Value: "RECIPE#123"},
			"sk":          &types.AttributeValueMemberS{Value: "RECIPE"},
			"imageUrl":    &types.AttributeValueMemberS{Value: "cdn.test.com"},
			"name":        &types.AttributeValueMemberS{Value: "White rice"},
			"description": &types.AttributeValueMemberS{Value: "Plain white rice"},
			"authorName":  &types.AttributeValueMemberS{Value: "johnny_test"},
			"ingredients": &types.AttributeValueMemberL{Value: []types.AttributeValue{
				&types.AttributeValueMemberS{Value: "Rice"},
				&types.AttributeValueMemberS{Value: "Water"},
			}},
		},
	}

	res, _ := DatabaseItemsToRecipeStructs(&items)
	result := (*res)[0]

	if !reflect.DeepEqual(result, expect) {
		t.Errorf("Expected %v but got %v instead", expect, result)
	}

}
