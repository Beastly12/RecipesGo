package helpers

import (
	"backend/models"
	"backend/utils"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

type searchHelper struct {
}

func NewSearchHelper() *searchHelper {
	return &searchHelper{}
}

func (s *searchHelper) GetUserSearchIndexTransactions(u *models.User) []types.TransactWriteItem {
	indexes := models.GenerateSearchIndexes(u.Name, u.Userid, models.SEARCH_ITEM_TYPE_AUTHOR)

	var transactionItems []types.TransactWriteItem
	for _, index := range *indexes {
		transactionItems = append(transactionItems, types.TransactWriteItem{
			Put: &types.Put{
				Item:      *utils.ToDatabaseFormat(&index),
				TableName: &utils.GetDependencies().MainTableName,
			},
		})
	}

	return transactionItems
}

func (s *searchHelper) GetRecipeSearchIndexTransactions(r *models.Recipe) []types.TransactWriteItem {
	indexes := models.GenerateSearchIndexes(r.Name, r.Id, models.SEARCH_ITEM_TYPE_RECIPE)

	var transactionItems []types.TransactWriteItem
	for _, index := range *indexes {
		transactionItems = append(transactionItems, types.TransactWriteItem{
			Put: &types.Put{
				Item:      *utils.ToDatabaseFormat(&index),
				TableName: &utils.GetDependencies().MainTableName,
			},
		})
	}

	return transactionItems
}
