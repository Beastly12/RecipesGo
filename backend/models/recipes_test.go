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
		1,
		"easy",
	)

	result.AddIngredients("water", "cast iron skillet")
	result.AddCategories("breakfast", "italian")
	result.AddInstructions("boil for 5 mins")

	expect := &Recipe{
		Id: result.Id,
		RecipeDetails: RecipeDetails{
			ImageUrl:        "https://cdn.test.com/test.jpg",
			Name:            "Hot water",
			AuthorName:      "johnny_test",
			Description:     "A very delicious cup of hot water",
			Ingredients:     []string{"water", "cast iron skillet"},
			Categories:      []string{"breakfast", "italian"},
			Instructions:    []string{"boil for 5 mins"},
			DateCreated:     result.DateCreated,
			PreparationTime: 1,
			Difficulty:      "easy",
		},
		SortKey:  "RECIPE",
		ItemType: "RECIPE",
	}

	if !reflect.DeepEqual(result, expect) {
		t.Errorf("Expected %v but got %v instead", expect, result)
	}
}

func TestDbItemToRecipesStruct(t *testing.T) {
	expect := Recipe{
		Id: "123",
		RecipeDetails: RecipeDetails{
			ImageUrl:        "https://cdn.com/test.jpg",
			Name:            "White rice",
			AuthorName:      "johnny_test",
			Description:     "Plain white rice",
			Ingredients:     []string{"Rice", "Water"},
			Categories:      []string{"dinner"},
			Instructions:    []string{"oven"},
			PreparationTime: 1,
			Difficulty:      "easy",
		},
		SortKey: "RECIPE",
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
			"preparationTime": &types.AttributeValueMemberN{Value: "1"},
			"categories": &types.AttributeValueMemberL{Value: []types.AttributeValue{
				&types.AttributeValueMemberS{Value: "dinner"},
			}},
			"instructions": &types.AttributeValueMemberL{Value: []types.AttributeValue{&types.AttributeValueMemberS{Value: "oven"}}},
			"difficulty":   &types.AttributeValueMemberN{Value: "easy"},
		},
	}

	res := DatabaseItemsToRecipeStructs(&items, "cdn.com")
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
		1,
		"hard",
	)

	recipe.AddIngredients("water")
	recipe.AddCategories("dessert")

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
		"categories": &types.AttributeValueMemberL{Value: []types.AttributeValue{
			&types.AttributeValueMemberS{Value: "dessert"},
		}},
		"lsi":        &types.AttributeValueMemberS{Value: time},
		"gsi":        &types.AttributeValueMemberS{Value: "RECIPE"},
		"difficulty": &types.AttributeValueMemberS{Value: "hard"},
	}

	result := utils.ToDatabaseFormat(utils.DatabaseFormattable(recipe))

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
