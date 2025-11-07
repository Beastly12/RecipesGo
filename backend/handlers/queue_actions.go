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
		case backend.QUEUE_ACTION_FAVORITE_RECIPE:
			if action.RecipientId == "" || action.SenderId == "" {
				log.Print("skipping invalid message")
				continue
			}

			err := helpers.NewRecipeHelper(ctx).RecipeLikesPlus1(action.SenderId, action.RecipientId)
			if err != nil {
				log.Printf("FAILED TO INCREASE RECIPE LIKES! ERROR: %v", err)
				continue
			}

			log.Print("Updated recipe likes successfully!")

		case backend.QUEUE_ACTION_REMOVE_FAVORITE_RECIPE:
			if action.RecipientId == "" || action.SenderId == "" {
				log.Print("skipping invalid message")
				continue
			}

			err := helpers.NewRecipeHelper(ctx).RecipeLikesMinus1(action.SenderId, action.RecipientId)
			if err != nil {
				log.Printf("FAILED TO DECREASE RECIPE LIKES! ERROR: %v", err)
				continue
			}

			log.Print("Updated recipe likes successfully!")
		}
	}

	return nil
}
