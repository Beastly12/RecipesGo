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

func (h *helper) queryDb(input *dynamodb.QueryInput) ([]map[string]types.AttributeValue, error) {
	utils.BasicLog("preparing to query db", input)

	if input.TableName == nil {
		input.TableName = &utils.GetDependencies().MainTableName
	}

	var allItems []map[string]types.AttributeValue
	var lastEvaluatedKey map[string]types.AttributeValue

	for {
		if lastEvaluatedKey != nil {
			input.ExclusiveStartKey = lastEvaluatedKey
		}

		utils.BasicLog("executing query", input)
		result, err := utils.GetDependencies().DbClient.Query(h.Ctx, input)

		if err != nil {
			utils.BasicLog("failed to query db", err)
			return nil, err
		}

		utils.BasicLog("query successful, items count", len(result.Items))

		allItems = append(allItems, result.Items...)

		if result.LastEvaluatedKey == nil {
			break
		}

		lastEvaluatedKey = result.LastEvaluatedKey
		utils.BasicLog("more items to fetch, continuing pagination", lastEvaluatedKey)
	}

	utils.BasicLog("query completed, total items", len(allItems))
	return allItems, nil
}
