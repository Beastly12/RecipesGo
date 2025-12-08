package utils

import (
	"context"
	"fmt"
	"sync"

	"github.com/lestrrat-go/jwx/v2/jwk"
	"github.com/lestrrat-go/jwx/v2/jwt"
)

type Validator struct {
	region     string
	userPoolID string
	clientID   string
	jwksURL    string

	once sync.Once
	jwks jwk.Set
}

func NewValidator(region, userPoolID, clientID string) *Validator {
	return &Validator{
		region:     region,
		userPoolID: userPoolID,
		clientID:   clientID,
		jwksURL: fmt.Sprintf(
			"https://cognito-idp.%s.amazonaws.com/%s/.well-known/jwks.json",
			region,
			userPoolID,
		),
	}
}

func (v *Validator) loadJWKS() error {
	var err error
	v.once.Do(func() {
		v.jwks, err = jwk.Fetch(context.Background(), v.jwksURL)
	})
	return err
}

func (v *Validator) Validate(tokenString string) (jwt.Token, error) {
	// Load JWK set
	if err := v.loadJWKS(); err != nil {
		return nil, fmt.Errorf("failed to load JWKs: %w", err)
	}

	// Parse + validate signature + validate audience
	tok, err := jwt.Parse(
		[]byte(tokenString),
		jwt.WithKeySet(v.jwks),
		jwt.WithValidate(true),
		jwt.WithAudience(v.clientID), // <— Correct audience validation
	)
	if err != nil {
		return nil, fmt.Errorf("invalid JWT: %w", err)
	}

	// Validate issuer manually (AWS Cognito requirement)
	expectedIssuer := fmt.Sprintf(
		"https://cognito-idp.%s.amazonaws.com/%s",
		v.region,
		v.userPoolID,
	)

	if tok.Issuer() != expectedIssuer {
		return nil, fmt.Errorf("invalid issuer: got %s", tok.Issuer())
	}

	return tok, nil
}
