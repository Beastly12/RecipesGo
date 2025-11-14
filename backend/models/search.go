package models

import (
	"backend/utils"
	"log"
	"strings"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

const (
	SearchPkPrefix          = "SEARCH_INDEX#"
	SearchSkPrefix          = "SEARCH_VALUE#"
	minSearchIndexWordLen   = 2
	SEARCH_ITEM_TYPE_AUTHOR = "author"
	SEARCH_ITEM_TYPE_RECIPE = "recipe"
)

type Search struct {
	Index    string `dynamodbav:"pk"`
	Value    string `dynamodbav:"sk"`
	Id       string `dynamodbav:"itemId"`
	ItemType string `dynamodbav:"type"`
}

func (s *Search) ApplyPrefixes() {
	s.Index = utils.AddPrefix(s.Index, SearchPkPrefix)
	s.Value = utils.AddPrefix(s.Value, SearchSkPrefix)
}

func DatabaseItemsToSearchStructs(items *[]map[string]types.AttributeValue) *[]Search {
	return utils.DatabaseItemsToStructs(items, func(s *Search) {
		s.Index = strings.TrimPrefix(s.Index, SearchPkPrefix)
		s.Value = strings.TrimPrefix(s.Value, SearchSkPrefix)
	})
}

func GenerateSearchIndexes(name, id, itemType string) *[]Search {
	name = utils.RemovePrefix(name, "#")
	id = utils.RemovePrefix(id, "#")
	itemType = utils.RemovePrefix(itemType, "#")

	if itemType != SEARCH_ITEM_TYPE_AUTHOR && itemType != SEARCH_ITEM_TYPE_RECIPE {
		log.Fatalf("Invalid search item type provided! %v", itemType)
	}

	if len(name) < minSearchIndexWordLen {
		return &[]Search{}
	}

	id = utils.RemovePrefix(id, "#") // id may already be formatted for db, so we need to remove existing prefixes before adding search prefixes to it

	cleanName := utils.NormalizeString(name)
	tokens := utils.SplitOnDelimiter(cleanName, " ", ".", ",", "_", "-", "&")
	var indexes []Search
	seen := make(map[string]struct{})

	for _, token := range tokens {
		if len(token) < minSearchIndexWordLen {
			continue
		}

		index := token[:minSearchIndexWordLen]
		value := token + "," + id // concat id to add uniqueness to each search item
		if _, ok := seen[index+value]; !ok {
			seen[index+value] = struct{}{}
			indexes = append(indexes, Search{
				Index:    index,
				Value:    value,
				ItemType: itemType,
				Id:       id,
			})
		}
	}

	return &indexes
}

func GetSearchItemKeys(name, id, itemType string) *[]map[string]types.AttributeValue {
	var keys []map[string]types.AttributeValue
	items := GenerateSearchIndexes(name, id, itemType)

	for _, item := range *items {
		keys = append(keys, map[string]types.AttributeValue{
			"pk": &types.AttributeValueMemberS{Value: utils.AddPrefix(item.Index, SearchPkPrefix)},
			"sk": &types.AttributeValueMemberS{Value: utils.AddPrefix(item.Value, SearchSkPrefix)},
		})
	}

	return &keys
}
