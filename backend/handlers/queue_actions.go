package handlers

import (
	"backend"
	"backend/helpers"
	"context"
	"encoding/json"
	"log"

	"github.com/aws/aws-lambda-go/events"
)

func HandleQueueActions(ctx context.Context, sqs events.SQSEvent) error {
	for _, msg := range sqs.Records {
		var action helpers.QueueAction
		if err := json.Unmarshal([]byte(msg.Body), &action); err != nil {
			log.Printf("FAILED TO UNMARSHAL MESSAGE! %v", err)
			continue
		}

		switch action.Action {
		case backend.QUEUE_ACTION_RECALCULATE_RATING:
			if action.RecipientId == "" {
				log.Print("skipping invalid recalculate ratings message")
				continue
			}

			err := helpers.NewRatingsHelper(ctx).UpdateRating(action.RecipientId)
			if err != nil {
				log.Printf("FAILED TO UPDATE RECIPE RATINGS! ERROR: %v", err)
				continue
			}

			log.Print("Updated recipe ratings successfully!")
			continue

		}
	}

	return nil
}
