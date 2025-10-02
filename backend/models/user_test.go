package models

import (
	"reflect"
	"testing"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func TestNewUser(t *testing.T) {
	expect := &User{
		Userid:      "123",
		Description: "PROFILE",
		Username:    "test",
		DpUrl:       "",
		Bio:         "",
	}

	result := NewUser("123", "test")

	if !reflect.DeepEqual(expect, result) {
		t.Errorf("User result does not match expected user, %v, %v", expect, result)
	}
}

func TestUserStructToDbItem(t *testing.T) {
	result := *NewUser("123", "test").ToDatabaseFormat()
	expect := map[string]types.AttributeValue{
		"pk":       &types.AttributeValueMemberS{Value: "USER#123"},
		"sk":       &types.AttributeValueMemberS{Value: "PROFILE"},
		"username": &types.AttributeValueMemberS{Value: "test"},
		"dpUrl":    &types.AttributeValueMemberS{Value: ""},
		"bio":      &types.AttributeValueMemberS{Value: ""},
	}

	if len(result) != len(expect) {
		t.Errorf("Expected %v keys but got %v instead", len(expect), len(result))
	}

	for key, expVal := range expect {
		val, exists := (result)[key]
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

func TestDbItemsToUserStructs(t *testing.T) {
	userItem := []map[string]types.AttributeValue{
		{
			"pk":       &types.AttributeValueMemberS{Value: "USER#123"},
			"sk":       &types.AttributeValueMemberS{Value: "PROFILE"},
			"username": &types.AttributeValueMemberS{Value: "test"},
			"dpUrl":    &types.AttributeValueMemberS{Value: "cdn.pic.com"},
			"bio":      &types.AttributeValueMemberS{Value: "i love food"},
		},
	}

	expected := User{
		Userid:      "123",
		Description: "PROFILE",
		Username:    "test",
		DpUrl:       "cdn.pic.com",
		Bio:         "i love food",
	}

	res, _ := DbItemsToUserStructs(&userItem)
	result := (*res)[0]

	if !reflect.DeepEqual(result, expected) {
		t.Errorf("Expected %v but got %v instead", expected, result)
	}
}
