package models

import (
	"backend/utils"
	"reflect"
	"testing"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func TestFavoriteConst(t *testing.T) {
	expectPk := "FAVORITE_BY#"
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
		"pk": &types.AttributeValueMemberS{Value: "FAVORITE_BY#123"},
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
			UserId:    "123",
			RecipeId:  "123",
			DateAdded: d,
			Category:  recipe.Category,
		},
	}

	items := []map[string]types.AttributeValue{
		{
			"pk":        &types.AttributeValueMemberS{Value: "FAVORITE_BY#123"},
			"sk":        &types.AttributeValueMemberS{Value: "FAVORITE#123"},
			"authorId":  &types.AttributeValueMemberS{Value: "123"},
			"gsi":       &types.AttributeValueMemberS{Value: "italian"},
			"lsi":       &types.AttributeValueMemberS{Value: recipe.DateCreated},
			"dateAdded": &types.AttributeValueMemberS{Value: d},
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
		"pk":  &types.AttributeValueMemberS{Value: "FAVORITE_BY#123"},
		"sk":  &types.AttributeValueMemberS{Value: "FAVORITE#123"},
		"lsi": &types.AttributeValueMemberS{Value: dc},
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
