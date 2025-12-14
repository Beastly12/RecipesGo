package utils

import (
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

func IsAuthenticatedUser(req events.APIGatewayV2HTTPRequest, userId string) bool {
	sub := GetAuthUserId(req)
	if sub == "" {
		return false
	}
	return sub == userId
}

func getBearerToken(req events.APIGatewayV2HTTPRequest) string {
	auth := req.Headers["authorization"]
	if auth == "" {
		auth = req.Headers["Authorization"]
	}

	if auth == "" || !strings.HasPrefix(auth, "Bearer ") {
		return ""
	}

	return strings.TrimPrefix(auth, "Bearer ")
}

func ForceGetAuthUserId(req events.APIGatewayV2HTTPRequest) string {
	validator := NewValidator(
		"eu-west-2",
		GetDependencies().UserPoolId,
		GetDependencies().ClientId,
	)

	token := getBearerToken(req)
	if token == "" {
		claims, err := validator.Validate(token)
		if err != nil {
			return ""
		}

		return claims.Subject()
	}

	return ""
}
