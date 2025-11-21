package models

import (
	"backend/utils"
	"reflect"
	"testing"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func TestNewRecipe(t *testing.T) {
	a := NewUser("123", "johnny_test")
	result := NewRecipe(
		"Hot water",
		"https://cdn.test.com/test.jpg",
		"italian",
		"A very delicious cup of hot water",
		1,
		"easy",
		true,
		a.Userid,
		a.Name,
		a.DpUrl,
	)

	result.AddIngredients("water", "cast iron skillet")
	result.AddInstructions("boil for 5 mins")

	expect := &Recipe{
		Id: result.Id,
		RecipeDetails: RecipeDetails{
			ImageUrl:        "https://cdn.test.com/test.jpg",
			Name:            "Hot water",
			AuthorName:      "johnny_test",
			Description:     "A very delicious cup of hot water",
			Ingredients:     []string{"water", "cast iron skillet"},
			Instructions:    []string{"boil for 5 mins"},
			PreparationTime: 1,
			Difficulty:      "easy",
			IsPublic:        true,
			AuthorId:        "123",
		},
		DateCreated: result.DateCreated,
		SortKey:     "RECIPE",
		Category:    "italian",
		ItemType:    "RECIPE",
		AuthorIdGsi: "123",
	}

	if !reflect.DeepEqual(result, expect) {
		t.Errorf("Expected %v but got %v instead", expect, result)
	}
}

func TestDecodeLastKey(t *testing.T) {
	result, err := DecodeLastEvalKeys("")
	if err != nil || len(result) < 1 {
		t.Errorf("%v", err)
	}
}

func TestEncodeDecode(t *testing.T) {
	tests := []struct {
		lastKey map[string]types.AttributeValue
	}{
		{
			lastKey: map[string]types.AttributeValue{
				"pk": &types.AttributeValueMemberS{Value: "pk_val"},
			},
		},
	}

	for _, test := range tests {
		t.Run("test ", func(t *testing.T) {
			encodedStr := encodeLastEvalKeys(test.lastKey)
			decodedStr, err := DecodeLastEvalKeys(encodedStr)
			if err != nil {
				t.Errorf("An unexpected error has occurred! %v", err)
			}

			if !reflect.DeepEqual(decodedStr[0], test.lastKey) {
				t.Errorf("Expected %v but got %v instead", test.lastKey, decodedStr)
			}
		})
	}
}

func TestDbItemToRecipesStruct(t *testing.T) {
	d := utils.GetTimeNow()
	expect := Recipe{
		Id:      "123",
		SortKey: "RECIPE",
		RecipeDetails: RecipeDetails{
			ImageUrl:        "https://cdn.com/test.jpg",
			Name:            "White rice",
			AuthorName:      "johnny_test",
			Description:     "Plain white rice",
			AuthorId:        "123",
			AuthorDpUrl:     "",
			Ingredients:     []string{"Rice", "Water"},
			Instructions:    []string{"oven"},
			PreparationTime: 1,
			Difficulty:      "easy",
			IsPublic:        false,
		},
		DateCreated: d,
		ItemType:    "RECIPE",
		Category:    "dinner",
	}

	items := []map[string]types.AttributeValue{
		{
			"pk":          &types.AttributeValueMemberS{Value: "RECIPE#123"},
			"sk":          &types.AttributeValueMemberS{Value: "RECIPE"},
			"imageUrl":    &types.AttributeValueMemberS{Value: "test.jpg"},
			"name":        &types.AttributeValueMemberS{Value: "White rice"},
			"description": &types.AttributeValueMemberS{Value: "Plain white rice"},
			"authorName":  &types.AttributeValueMemberS{Value: "johnny_test"},
			"authorId":    &types.AttributeValueMemberS{Value: "123"},
			"authorDpUrl": &types.AttributeValueMemberS{Value: ""},
			"ingredients": &types.AttributeValueMemberL{Value: []types.AttributeValue{
				&types.AttributeValueMemberS{Value: "Rice"},
				&types.AttributeValueMemberS{Value: "Water"},
			}},
			"preparationTime": &types.AttributeValueMemberN{Value: "1"},
			"gsi":             &types.AttributeValueMemberS{Value: "RECIPE_TYPE#RECIPE"},
			"gsi2":            &types.AttributeValueMemberS{Value: "RECIPE_CAT#dinner"},
			"instructions":    &types.AttributeValueMemberL{Value: []types.AttributeValue{&types.AttributeValueMemberS{Value: "oven"}}},
			"difficulty":      &types.AttributeValueMemberN{Value: "easy"},
			"lsi":             &types.AttributeValueMemberN{Value: expect.DateCreated},
			"isPublic":        &types.AttributeValueMemberBOOL{Value: false},
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
	u := NewUser("123", "mad_scientist")

	recipe := NewRecipe(
		"test",
		"",
		"dessert",
		"stuff",
		1,
		"hard",
		false,
		u.Userid,
		u.Name,
		u.DpUrl,
	)

	recipe.AddIngredients("water")

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
		"gsi":        &types.AttributeValueMemberS{Value: "RECIPE_TYPE#" + "RECIPE"},
		"lsi":        &types.AttributeValueMemberS{Value: "USER#123RECIPE_DATE#" + time},
		"difficulty": &types.AttributeValueMemberS{Value: "hard"},
		"isPublic":   &types.AttributeValueMemberBOOL{Value: false},
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

func TestLsiBeginsWith(t *testing.T) {
	tests := []struct {
		userId string
		expect string
	}{
		{
			userId: "123",
			expect: "USER#123RECIPE_DATE#",
		},
	}

	for _, test := range tests {
		t.Run(test.expect, func(t *testing.T) {
			result := PrivateRecipeLsiBeginsWith(test.userId)
			if result != test.expect {
				t.Errorf("Expected %v\nbut got %v instead!", test.expect, result)
			}
		})
	}
}
