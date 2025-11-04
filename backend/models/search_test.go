package models

import (
	"encoding/json"
	"reflect"
	"testing"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func TestGenerateSearchIndexes(t *testing.T) {
	tests := []struct {
		name     string
		id       string
		itemType string
		expected []Search
	}{
		{
			name:     "johnny dang",
			id:       "123",
			itemType: "author",
			expected: []Search{
				{
					Index:    "jo",
					Value:    "johnny#123",
					ItemType: "author",
				},
				{
					Index:    "da",
					Value:    "dang#123",
					ItemType: "author",
				},
			},
		},
		{
			name:     "dang dang",
			id:       "123",
			itemType: "author",
			expected: []Search{
				{
					Index:    "da",
					Value:    "dang#123",
					ItemType: "author",
				},
			},
		},
		{
			name:     "a very deliciouş 🇩🇪german, donnër-kebab",
			id:       "123",
			itemType: "recipe",
			expected: []Search{
				{
					Index:    "ve",
					Value:    "very#123",
					ItemType: "recipe",
				},
				{
					Index:    "de",
					Value:    "delicious#123",
					ItemType: "recipe",
				},
				{
					Index:    "ge",
					Value:    "german#123",
					ItemType: "recipe",
				},
				{
					Index:    "do",
					Value:    "donner#123",
					ItemType: "recipe",
				},
				{
					Index:    "ke",
					Value:    "kebab#123",
					ItemType: "recipe",
				},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := GenerateSearchIndexes(tt.name, tt.id, tt.itemType)
			if !reflect.DeepEqual(*result, tt.expected) {
				t.Errorf("Expected:\n%v \nBut got:\n%v instead", tt.expected, result)
			}
		})
	}
}

func TestGetSearchKeys(t *testing.T) {
	tests := []struct {
		name     string
		id       string
		itemType string
		expected []map[string]types.AttributeValue
	}{
		{
			name:     "test recipe",
			id:       "123",
			itemType: "recipe",
			expected: []map[string]types.AttributeValue{
				{
					"pk": &types.AttributeValueMemberS{Value: "SEARCH_INDEX#" + "te"},
					"sk": &types.AttributeValueMemberS{Value: "SEARCH_VALUE#" + "test#123"},
				},
				{
					"pk": &types.AttributeValueMemberS{Value: "SEARCH_INDEX#" + "re"},
					"sk": &types.AttributeValueMemberS{Value: "SEARCH_VALUE#" + "recipe#123"},
				},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := GetSearchItemKeys(tt.name, tt.id, tt.itemType)
			if !reflect.DeepEqual(tt.expected, *result) {
				expectedJSON, _ := json.MarshalIndent(tt.expected, "", "  ")
				resultJSON, _ := json.MarshalIndent(result, "", "  ")
				t.Errorf("expected:\n%s\n\nbut got:\n%s", expectedJSON, resultJSON)
			}
		})
	}
}
