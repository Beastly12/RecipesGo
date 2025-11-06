package utils

import (
	"log"

	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

type DatabaseFormattable interface {
	ApplyPrefixes()
}

func ToDatabaseFormat[T DatabaseFormattable](item T) *map[string]types.AttributeValue {
	item.ApplyPrefixes()
	dbItem, err := attributevalue.MarshalMap(item)
	if err != nil {
		panic("failed to convert struct to db item")
	}

	return &dbItem
}

func DatabaseItemsToStructs[T any](
	items *[]map[string]types.AttributeValue,
	postProcess func(*T),
) *[]T {
	results := []T{}

	if err := attributevalue.UnmarshalListOfMaps(*items, &results); err != nil {
		log.Fatalf("An error occurred while trying to un marshal db items to struct %T: %v", results, err)
	}

	for index := range results {
		postProcess(&results[index])
	}

	return &results
}

func DatabaseItemToStruct[T any](
	item *map[string]types.AttributeValue,
	postProcess func(*T),
) *T {
	var result T

	if err := attributevalue.UnmarshalMap(*item, &result); err != nil {
		log.Fatalf("An error occurred while trying to un marshal db items to struct %T: %v", result, err)
	}

	postProcess(&result)

	return &result
}
