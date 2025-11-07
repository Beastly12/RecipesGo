package helpers

import (
	"backend"
	"backend/models"
	"backend/utils"
	"context"
	"encoding/json"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/sqs"
)

type QueueAction struct {
	SenderId    string `json:"senderId"`
	RecipientId string `json:"recipientId"`
	Action      string `json:"action"`
	Payload     any    `json:"payload"`
}

type queueHelper struct {
	Ctx context.Context
}

func NewQueueHelper(ctx context.Context) *queueHelper {
	return &queueHelper{
		Ctx: ctx,
	}
}

func WithLikeAction(userId, recipeId string, increaseLike bool) QueueAction {
	if !increaseLike {
		return QueueAction{
			SenderId:    userId,
			RecipientId: recipeId,
			Action:      backend.QUEUE_ACTION_REMOVE_FAVORITE_RECIPE,
		}
	}

	return QueueAction{
		SenderId:    userId,
		RecipientId: recipeId,
		Action:      backend.QUEUE_ACTION_FAVORITE_RECIPE,
	}
}

func WithRateAction(rating models.Rating) QueueAction {
	return QueueAction{
		SenderId:    rating.Userid,
		RecipientId: rating.RecipeId,
		Action:      backend.QUEUE_ACTION_RATE_RECIPE,
		Payload:     rating,
	}
}

func (q *queueHelper) PutInQueue(action QueueAction) error {
	msg, err := json.Marshal(action)
	if err != nil {
		panic("Failed to marshal queue action!")
	}

	input := &sqs.SendMessageInput{
		QueueUrl:    &utils.GetDependencies().QueueUrl,
		MessageBody: aws.String(string(msg)),
	}

	_, err = utils.GetDependencies().SqsClient.SendMessage(q.Ctx, input)
	if err != nil {
		log.Printf("ERROR: Failed to send message to queue! \nERROR MESSAGE: %v", err)
		return err
	}

	println("message queued!")
	return nil
}
