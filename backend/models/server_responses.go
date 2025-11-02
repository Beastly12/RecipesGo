package models

// a way to standardize responses from functions triggered by apigateway event

import (
	"backend/utils"
	"encoding/base64"
	"encoding/json"
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

type ResponseBody struct {
	Message interface{} `json:"message"`
	Next    interface{} `json:"next,omitempty"`
}

// buildResponse builds a standard API Gateway proxy response
func buildResponse(statusCode int, body ResponseBody) events.APIGatewayV2HTTPResponse {
	jsonBody, _ := json.Marshal(body)

	utils.ShutdownLogs()
	return events.APIGatewayV2HTTPResponse{
		StatusCode: statusCode,
		Headers: map[string]string{
			"Content-Type": "application/json",
		},
		Body: string(jsonBody),
	}
}

func InvalidRequestErrorResponse(msg string) events.APIGatewayV2HTTPResponse {
	if msg == "" {
		msg = "Invalid request body."
	}
	return buildResponse(400, ResponseBody{msg, nil})
}

func UnauthorizedErrorResponse(msg string) events.APIGatewayV2HTTPResponse {
	if msg == "" {
		msg = "Unauthorized request."
	}
	return buildResponse(401, ResponseBody{msg, nil})
}

func NotFoundResponse(msg string) events.APIGatewayV2HTTPResponse {
	if msg == "" {
		msg = "Resource not found."
	}

	return buildResponse(404, ResponseBody{msg, nil})
}

func ServerSideErrorResponse(msg string, error error) events.APIGatewayV2HTTPResponse {
	if msg == "" {
		msg = "An error has occurred on our end, try again."
	}
	log.Println("ERROR: " + error.Error())
	return buildResponse(500, ResponseBody{msg, nil})
}

func SuccessfulRequestResponse(msg string, createdResource bool) events.APIGatewayV2HTTPResponse {
	if msg == "" {
		msg = "Request successful"
	}

	sCode := 200
	if createdResource {
		sCode = 201
	}

	return buildResponse(sCode, ResponseBody{msg, nil})
}

func SuccessfulGetRequestResponse(body interface{}, lastKey map[string]types.AttributeValue) events.APIGatewayV2HTTPResponse {
	return buildResponse(200, ResponseBody{
		body,
		encodeLastEvalKey(lastKey),
	})
}

func encodeLastEvalKey(key map[string]types.AttributeValue) string {
	utils.BasicLog("encoding last eval key", key)
	if key == nil {
		utils.BasicLog("no last eval key provided, skipping", nil)
		return ""
	}

	jsonBytes, err := json.Marshal(key)
	if err != nil {
		utils.BasicLog("failed to encode last eval key", err)
		log.Panicf("Failed to encode last key: %v, error: %v", key, err)
	}

	utils.BasicLog("last eval key encoded successfully!", jsonBytes)
	return base64.StdEncoding.EncodeToString(jsonBytes)
}

func DecodeLastEvalKey(key string) (map[string]types.AttributeValue, error) {
	var lastKey map[string]types.AttributeValue
	utils.BasicLog("decoding last eval key", key)

	if key == "" {
		utils.BasicLog("no last key provided, skipping...", nil)
		return lastKey, nil
	}

	decoded, err := base64.StdEncoding.DecodeString(key)
	if err != nil {
		utils.BasicLog("failed to convert last eval key from base 64", err)
		return nil, err
	}

	err = json.Unmarshal(decoded, &lastKey)
	if err != nil {
		utils.BasicLog("failed to unmarshal last eval key", err)
		return nil, err
	}

	utils.BasicLog("decoded last eval key successfully", lastKey)
	return lastKey, nil
}
