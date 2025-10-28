package helpers

import (
	"backend/models"
	"backend/utils"
	"context"
)

type ratingsHelper struct {
	Ctx context.Context
}

func NewRatingsHelper(ctx context.Context) *ratingsHelper {
	return &ratingsHelper{
		Ctx: ctx,
	}
}

func (r *ratingsHelper) AddRating(rating *models.Rating) error {
	err := newHelper(r.Ctx).putIntoDb(utils.ToDatabaseFormat(rating))

	return err
}

func (r *ratingsHelper) RemoveRating(recipeId, userId string) error {
	return newHelper(r.Ctx).deleteFromDb(models.RatingKey(recipeId, userId))
}
