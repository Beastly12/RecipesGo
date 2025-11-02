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
	utils.BasicLog("getting ready to put item in db", item)
	input := &dynamodb.PutItemInput{
		Item:      *item,
		TableName: &utils.GetDependencies().MainTableName,
	}

	utils.BasicLog("gotten input", input)

	_, err := utils.GetDependencies().DbClient.PutItem(h.Ctx, input)

	if err != nil {
		utils.BasicLog("failed to put item in db", err)
		return err
	}

	utils.BasicLog("put item in db successful", nil)
	return nil
}

func (h *helper) deleteFromDb(itemKey *map[string]types.AttributeValue) error {
	utils.BasicLog("preparing to delete item from db", itemKey)
	input := &dynamodb.DeleteItemInput{
		Key:       *itemKey,
		TableName: &utils.GetDependencies().MainTableName,
	}
	utils.BasicLog("gotten input", input)

	_, err := utils.GetDependencies().DbClient.DeleteItem(h.Ctx, input)

	if err != nil {
		utils.BasicLog("failed to delete item from db", err)
		return err
	}

	utils.BasicLog("item deleted successfully", nil)
	return nil
}
