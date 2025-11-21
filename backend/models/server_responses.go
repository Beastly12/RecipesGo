package models

// a way to standardize responses from functions triggered by apigateway event

import (
	"backend/utils"
	"encoding/base64"
	"encoding/json"
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

type ResponseBody struct {
	Message interface{} `json:"message"`
	Last    interface{} `json:"last,omitempty"`
}

// buildResponse builds a standard API Gateway proxy response
func buildResponse(statusCode int, body ResponseBody) events.APIGatewayV2HTTPResponse {
	jsonBody, _ := json.Marshal(body)

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

func SuccessfulGetRequestResponse(body interface{}, lastKeys ...map[string]types.AttributeValue) events.APIGatewayV2HTTPResponse {
	return buildResponse(200, ResponseBody{
		body,
		encodeLastEvalKeys(lastKeys...),
	})
}

func encodeLastEvalKeys(keys ...map[string]types.AttributeValue) string {
	if len(keys) < 1 {
		return ""
	}

	hasNonEmpty := false
	for _, k := range keys {
		if len(k) > 0 {
			hasNonEmpty = true
			break
		}
	}
	if !hasNonEmpty {
		return ""
	}

	// Convert to generic Go types first
	var generic []map[string]any
	for _, k := range keys {
		var m map[string]any
		if err := attributevalue.UnmarshalMap(k, &m); err != nil {
			log.Panicf("Failed to unmarshal: %v", err)
		}
		generic = append(generic, m)
	}
	data, _ := json.Marshal(generic)
	return base64.URLEncoding.EncodeToString(data)
}

func DecodeLastEvalKeys(key string) ([]map[string]types.AttributeValue, error) {
	if key == "" {
		return []map[string]types.AttributeValue{nil}, nil
	}
	data, err := base64.URLEncoding.DecodeString(key)
	if err != nil {
		return nil, err
	}
	var generic []map[string]any
	if err := json.Unmarshal(data, &generic); err != nil {
		return nil, err
	}
	var keys []map[string]types.AttributeValue
	for _, g := range generic {
		m, err := attributevalue.MarshalMap(g)
		if err != nil {
			return nil, err
		}
		keys = append(keys, m)
	}
	return keys, nil
}

func fencodeLastEvalKey(key map[string]types.AttributeValue) string {
	utils.BasicLog("encoding last eval key", key)
	if key == nil {
		utils.BasicLog("no last eval key provided, skipping", nil)
		return ""
	}

	jsonBytes, err := attributevalue.MarshalMapJSON(key)
	if err != nil {
		utils.BasicLog("failed to marshal attribute values", err)
		log.Panicf("Failed to marshal last key: %v, error: %v", key, err)
	}

	utils.BasicLog("last eval key encoded successfully!", jsonBytes)
	return base64.URLEncoding.EncodeToString(jsonBytes)
}

func fDecodeLastEvalKey(key string) (map[string]types.AttributeValue, error) {
	utils.BasicLog("decoding last eval key", key)

	if key == "" {
		utils.BasicLog("no last key provided, skipping...", nil)
		return nil, nil
	}

	decoded, err := base64.URLEncoding.DecodeString(key)
	if err != nil {
		utils.BasicLog("failed to convert last eval key from base64", err)
		return nil, err
	}

	lastKey, err := attributevalue.UnmarshalMapJSON(decoded)
	if err != nil {
		utils.BasicLog("failed to unmarshal last eval key", err)
		return nil, err
	}

	utils.BasicLog("decoded last eval key successfully", lastKey)
	return lastKey, nil
}
