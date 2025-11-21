package utils

import (
	"encoding/base64"
	"encoding/json"
	"log"
	"strings"

	"github.com/aws/aws-lambda-go/events"
)

func GetAuthUserId(req events.APIGatewayV2HTTPRequest) string {
	if req.RequestContext.Authorizer == nil {
		log.Println("missing authorizer")
		return ""
	}

	jwt := req.RequestContext.Authorizer.JWT
	if jwt.Claims == nil {
		log.Println("missing JWT claims")
		return ""
	}

	sub, ok := jwt.Claims["sub"]
	if !ok || sub == "" {
		log.Println("missing or empty sub claim")
		return ""
	}
	return sub
}

func ForceGetAuthUserId(req events.APIGatewayV2HTTPRequest) string {
	authHeader := req.Headers["authorization"]
	if authHeader == "" {
		authHeader = req.Headers["Authorization"]
	}
	if authHeader == "" {
		log.Println("missing authorization header")
		return ""
	}

	token := strings.TrimPrefix(authHeader, "Bearer ")
	token = strings.TrimPrefix(token, "bearer ")

	parts := strings.Split(token, ".")
	if len(parts) != 3 {
		log.Println("invalid JWT format")
		return ""
	}

	payload, err := base64.RawURLEncoding.DecodeString(parts[1])
	if err != nil {
		log.Printf("failed to decode JWT payload: %v", err)
		return ""
	}

	var claims map[string]interface{}
	if err := json.Unmarshal(payload, &claims); err != nil {
		log.Printf("failed to parse JWT claims: %v", err)
		return ""
	}

	sub, ok := claims["sub"].(string)
	if !ok || sub == "" {
		log.Println("missing or empty sub claim")
		return ""
	}

	return sub
}

func IsAuthenticatedUser(req events.APIGatewayV2HTTPRequest, userId string) bool {
	sub := GetAuthUserId(req)
	if sub == "" {
		return false
	}
	return sub == userId
}
