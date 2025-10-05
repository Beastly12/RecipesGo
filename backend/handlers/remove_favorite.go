package handlers

import "backend/utils"

type RemoveFavorite struct {
	Dependencies utils.DynamoAndCloudfront
}

func NewRemoveFavorite(dependencies *utils.DynamoAndCloudfront) *RemoveFavorite {
	return &RemoveFavorite{
		Dependencies: *dependencies,
	}
}
