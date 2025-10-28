package helpers

import (
	"backend/utils"
	"context"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

type helper struct {
	Ctx context.Context
}

func newHelper(ctx context.Context) *helper {
	return &helper{
		Ctx: ctx,
	}
}

func (h *helper) putIntoDb(item *map[string]types.AttributeValue) error {
	input := &dynamodb.PutItemInput{
		Item:      *item,
		TableName: &utils.GetDependencies().MainTableName,
	}

	_, err := utils.GetDependencies().DbClient.PutItem(h.Ctx, input)

	if err != nil {
		return err
	}

	return nil
}

func (h *helper) deleteFromDb(itemKey *map[string]types.AttributeValue) error {
	input := &dynamodb.DeleteItemInput{
		Key:       *itemKey,
		TableName: &utils.GetDependencies().MainTableName,
	}

	_, err := utils.GetDependencies().DbClient.DeleteItem(h.Ctx, input)

	if err != nil {
		return err
	}

	return nil
}
