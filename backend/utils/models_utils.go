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

func DatabaseItemToStruct[T any](
	items *[]map[string]types.AttributeValue,
	postProcess func(*T),
) (*[]T, error) {
	var results []T

	if err := attributevalue.UnmarshalListOfMaps(*items, &results); err != nil {
		log.Printf("An error occurred while trying to un marshal db items to struct %T", results)
		return nil, err
	}

	for index := range results {
		postProcess(&results[index])
	}

	return &results, nil
}
