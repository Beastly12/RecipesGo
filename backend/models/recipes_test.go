package models

import (
	"backend/utils"
	"reflect"
	"testing"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func TestNewRecipe(t *testing.T) {
	result := NewRecipe(
		"Hot water",
		"https://cdn.test.com/test.jpg",
		"johnny_test",
		"A very delicious cup of hot water",
		"water", "cast iron skillet",
	)

	expect := &Recipe{
		Id:          result.Id,
		ImageUrl:    "https://cdn.test.com/test.jpg",
		Name:        "Hot water",
		AuthorName:  "johnny_test",
		Description: "A very delicious cup of hot water",
		Ingredients: []string{"water", "cast iron skillet"},
		SortKey:     "RECIPE",
		ItemType:    "RECIPE",
		DateCreated: result.DateCreated,
	}

	if !reflect.DeepEqual(result, expect) {
		t.Errorf("Expected %v but got %v instead", expect, result)
	}
}

func TestDbItemToRecipesStruct(t *testing.T) {
	expect := Recipe{
		Id:          "123",
		ImageUrl:    "https://cdn.com/test.jpg",
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
			"imageUrl":    &types.AttributeValueMemberS{Value: "test.jpg"},
			"name":        &types.AttributeValueMemberS{Value: "White rice"},
			"description": &types.AttributeValueMemberS{Value: "Plain white rice"},
			"authorName":  &types.AttributeValueMemberS{Value: "johnny_test"},
			"ingredients": &types.AttributeValueMemberL{Value: []types.AttributeValue{
				&types.AttributeValueMemberS{Value: "Rice"},
				&types.AttributeValueMemberS{Value: "Water"},
			}},
		},
	}

	res, _ := DatabaseItemsToRecipeStructs(&items, "", "cdn.com")
	result := (*res)[0]

	if !reflect.DeepEqual(result, expect) {
		t.Errorf("Expected %v but got %v instead", expect, result)
	}

}

func TestRecipesConstants(t *testing.T) {
	// test pk prefix
	expectedPk := "RECIPE#"

	if RecipesPkPrefix != expectedPk {
		t.Errorf("Expected recipes pk prefix to be %v, but got %v instead", expectedPk, RecipesPkPrefix)
	}

	// test sk prefix
	expectedSk := "RECIPE"
	if RecipesSkPrefix != expectedSk {
		t.Errorf("Expected recipes sk prefix to be %v, but got %v instead", expectedSk, RecipesSkPrefix)
	}
}

func TestRecipeToDatabaseFormat(t *testing.T) {
	time := utils.GetTimeNow()

	recipe := NewRecipe(
		"test",
		"",
		"mad_scientist",
		"stuff",
		"water",
	)

	expect := map[string]types.AttributeValue{
		"pk":          &types.AttributeValueMemberS{Value: "RECIPE#" + recipe.Id},
		"sk":          &types.AttributeValueMemberS{Value: "RECIPE"},
		"imageUrl":    &types.AttributeValueMemberS{Value: ""},
		"name":        &types.AttributeValueMemberS{Value: "test"},
		"authorName":  &types.AttributeValueMemberS{Value: "mad_scientist"},
		"description": &types.AttributeValueMemberS{Value: "stuff"},
		"ingredients": &types.AttributeValueMemberL{Value: []types.AttributeValue{
			&types.AttributeValueMemberS{Value: "water"},
		}},
		"dateCreated": &types.AttributeValueMemberS{Value: time},
		"nickname":    &types.AttributeValueMemberS{Value: "RECIPE"},
	}

	result := recipe.ToDatabaseFormat()

	for key, expVal := range expect {
		val, exists := (*result)[key]
		if !exists {
			t.Errorf("Missing key: %v", key)
			continue
		}

		if reflect.TypeOf(val) != reflect.TypeOf(expVal) {
			t.Errorf("For key %v: expected type: %v, but got type: %v", key, reflect.TypeOf(expVal), reflect.TypeOf(val))
			continue
		}

		if !reflect.DeepEqual(val, expVal) {
			t.Errorf("For key %v: expected %v, got %v", key, expVal, val)
			continue
		}
	}
}

func TestRecipeKey(t *testing.T) {
	expect := &map[string]types.AttributeValue{
		"pk": &types.AttributeValueMemberS{Value: "RECIPE#123"},
		"sk": &types.AttributeValueMemberS{Value: "RECIPE"},
	}

	result := RecipeKey("123")

	if !reflect.DeepEqual(expect, result) {
		t.Errorf("expected\n%s\nbut got\n%s\ninstead", expect, result)
	}
}
