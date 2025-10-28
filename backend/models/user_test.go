package models

import (
	"backend/utils"
	"reflect"
	"testing"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func TestNewUser(t *testing.T) {
	expect := &User{
		Userid:      "123",
		Description: "PROFILE",
		Nickname:    "test",
		DpUrl:       "",
	}

	result := NewUser("123", "test")

	if !reflect.DeepEqual(expect, result) {
		t.Errorf("User result does not match expected user, %v, %v", expect, result)
	}
}

func TestUserStructToDbItem(t *testing.T) {
	result := *utils.ToDatabaseFormat(NewUser("123", "test"))
	expect := map[string]types.AttributeValue{
		"pk":    &types.AttributeValueMemberS{Value: "USER#123"},
		"sk":    &types.AttributeValueMemberS{Value: "PROFILE"},
		"gsi":   &types.AttributeValueMemberS{Value: "test"},
		"dpUrl": &types.AttributeValueMemberS{Value: ""},
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
			"pk":    &types.AttributeValueMemberS{Value: "USER#123"},
			"sk":    &types.AttributeValueMemberS{Value: "PROFILE"},
			"gsi":   &types.AttributeValueMemberS{Value: "test"},
			"dpUrl": &types.AttributeValueMemberS{Value: "cdn.pic.com"},
		},
	}

	expected := User{
		Userid:      "123",
		Description: "PROFILE",
		Nickname:    "test",
		DpUrl:       "cdn.pic.com",
	}

	res, _ := DbItemsToUserStructs(&userItem)
	result := (*res)[0]

	if !reflect.DeepEqual(result, expected) {
		t.Errorf("Expected %v but got %v instead", expected, result)
	}
}

func TestUsersConstants(t *testing.T) {
	// test pk prefix
	expectedPk := "USER#"

	if UserPkPrefix != expectedPk {
		t.Errorf("Expected recipes pk prefix to be %v, but got %v instead", expectedPk, UserPkPrefix)
	}

	// test sk prefix
	expectedSk := "PROFILE"
	if UserSkPrefix != expectedSk {
		t.Errorf("Expected recipes sk prefix to be %v, but got %v instead", expectedSk, UserSkPrefix)
	}
}

func TestUserKey(t *testing.T) {
	expected := &map[string]types.AttributeValue{
		"pk": &types.AttributeValueMemberS{Value: "USER#123"},
		"sk": &types.AttributeValueMemberS{Value: "PROFILE"},
	}

	result := UserKey("123")

	if !reflect.DeepEqual(expected, result) {
		t.Errorf("Expected key to be %s but got %s instead", expected, result)
	}
}
