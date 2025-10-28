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
	err := NewHelper(r.Ctx).putIntoDb(utils.ToDatabaseFormat(rating))

	return err
}
