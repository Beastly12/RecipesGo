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
	a := NewUser("123", "test")
	recipe := NewRecipe(
		"test",
		"",
		"italian",
		"test",
		1,
		"medium",
		true,
		a.Userid,
		a.Name,
		a.DpUrl,
	)
	recipe.AddIngredients("water")

	d := utils.GetTimeNow()

	expect := &[]Favorite{
		{
			UserId:        "123",
			RecipeId:      "123",
			RecipeDetails: recipe.RecipeDetails,
			DateAdded:     d,
			Category:      recipe.Category,
		},
	}

	items := []map[string]types.AttributeValue{
		{
			"pk":          &types.AttributeValueMemberS{Value: "USER#123"},
			"sk":          &types.AttributeValueMemberS{Value: "FAVORITE#123"},
			"imageUrl":    &types.AttributeValueMemberS{Value: ""},
			"name":        &types.AttributeValueMemberS{Value: "test"},
			"authorName":  &types.AttributeValueMemberS{Value: "test"},
			"authorDpUrl": &types.AttributeValueMemberS{Value: ""},
			"authorId":    &types.AttributeValueMemberS{Value: "123"},
			"description": &types.AttributeValueMemberS{Value: "test"},
			"ingredients": &types.AttributeValueMemberL{Value: []types.AttributeValue{
				&types.AttributeValueMemberS{Value: "water"},
			}},
			"gsi":             &types.AttributeValueMemberS{Value: "italian"},
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
	a := NewUser("123", "test_person")

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
		"isPublic":        &types.AttributeValueMemberBOOL{Value: true},
	}

	rec := NewRecipe(
		"test",
		"",
		"italian",
		"test food",
		1,
		"extreme",
		true,
		a.Userid,
		a.Name,
		a.DpUrl,
	)
	rec.Id = "123"
	rec.AddIngredients("water")
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
