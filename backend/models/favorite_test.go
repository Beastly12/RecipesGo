package models

import (
	"backend/utils"
	"reflect"
	"testing"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func TestFavoriteConst(t *testing.T) {
	expectPk := "USER#"
	expectSk := "FAVORITE#"

	if expectPk != FavoritePkPrefix {
		t.Errorf("Expected %v but got %v instead", expectPk, FavoritePkPrefix)
	}

	if expectSk != FavoriteSkPrefix {
		t.Errorf("Expected %v but got %v instead", expectSk, FavoriteSkPrefix)
	}
}

func TestFavoriteKey(t *testing.T) {
	expect := &map[string]types.AttributeValue{
		"pk": &types.AttributeValueMemberS{Value: "USER#123"},
		"sk": &types.AttributeValueMemberS{Value: "FAVORITE#123"},
	}

	result := FavoriteKey("123", "123")

	if !reflect.DeepEqual(expect, result) {
		t.Errorf("Expected \n%s\n but got \n%s\n instead.", expect, result)
	}
}

func TestDbItemToFavorite(t *testing.T) {
	recipe := NewRecipe(
		"test",
		"",
		"test",
		"test",
		1,
		"medium",
		true,
	)
	recipe.AddIngredients("water")
	recipe.AddCategories("italian")

	d := utils.GetTimeNow()

	expect := &[]Favorite{
		{
			UserId:        "123",
			RecipeId:      "123",
			RecipeDetails: recipe.RecipeDetails,
			DateAdded:     d,
		},
	}

	items := []map[string]types.AttributeValue{
		{
			"pk":          &types.AttributeValueMemberS{Value: "USER#123"},
			"sk":          &types.AttributeValueMemberS{Value: "FAVORITE#123"},
			"imageUrl":    &types.AttributeValueMemberS{Value: ""},
			"name":        &types.AttributeValueMemberS{Value: "test"},
			"authorName":  &types.AttributeValueMemberS{Value: "test"},
			"description": &types.AttributeValueMemberS{Value: "test"},
			"ingredients": &types.AttributeValueMemberL{Value: []types.AttributeValue{
				&types.AttributeValueMemberS{Value: "water"},
			}},
			"categories": &types.AttributeValueMemberL{Value: []types.AttributeValue{
				&types.AttributeValueMemberS{Value: "italian"},
			}},
			"preparationTime": &types.AttributeValueMemberN{Value: "1"},
			"difficulty":      &types.AttributeValueMemberN{Value: "medium"},
			"lsi":             &types.AttributeValueMemberS{Value: recipe.DateCreated},
			"dateAdded":       &types.AttributeValueMemberS{Value: d},
			"isPublic":        &types.AttributeValueMemberBOOL{Value: true},
		},
	}

	result := DbItemsToFavoriteStructs(&items)

	if !reflect.DeepEqual(result, expect) {
		t.Errorf("Expected \n%v\n but got \n%v\n instead", expect, result)
	}
}

func TestFavoriteToDatabase(t *testing.T) {
	dc := utils.GetTimeNow()

	expect := map[string]types.AttributeValue{
		"pk":          &types.AttributeValueMemberS{Value: "USER#123"},
		"sk":          &types.AttributeValueMemberS{Value: "FAVORITE#123"},
		"imageUrl":    &types.AttributeValueMemberS{Value: ""},
		"name":        &types.AttributeValueMemberS{Value: "test"},
		"authorName":  &types.AttributeValueMemberS{Value: "test_person"},
		"description": &types.AttributeValueMemberS{Value: "test food"},
		"ingredients": &types.AttributeValueMemberL{Value: []types.AttributeValue{
			&types.AttributeValueMemberS{Value: "water"},
		}},
		"preparationTime": &types.AttributeValueMemberN{Value: "1"},
		"difficulty":      &types.AttributeValueMemberS{Value: "extreme"},
		"lsi":             &types.AttributeValueMemberS{Value: dc},
		"dateAdded":       &types.AttributeValueMemberS{Value: dc},
		"isPublic":        &types.AttributeValueMemberBOOL{Value: true},
	}

	rec := NewRecipe(
		"test",
		"",
		"test_person",
		"test food",
		1,
		"extreme",
		true,
	)
	rec.Id = "123"
	rec.AddIngredients("water")
	rec.AddCategories("italian")
	fav := NewFavorite(
		"123",
		rec,
	)
	fav.DateAdded = dc

	result := utils.ToDatabaseFormat(fav)

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
