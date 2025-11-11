package models

import (
	"backend/utils"
	"strings"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

const (
	UserPkPrefix  = "USER#"
	UserGsiPrefix = "USER_NAME#"
	UserSkPrefix  = "PROFILE"
)

type User struct {
	Userid      string `dynamodbav:"pk" json:"userid"`
	Description string `dynamodbav:"sk" json:"-"`
	Name        string `dynamodbav:"gsi" json:"name"`
	DpUrl       string `dynamodbav:"dpUrl" json:"dpUrl"`
	Bio         string `dynamodbav:"bio" json:"bio"`
	Location    string `dynamodbav:"location" json:"location"`
	UserStats
}

type UserStats struct {
	RecipeCount int `dynamodbav:"recipeCount" json:"recipeCount,omitempty"`
	ViewCount   int `dynamodbav:"viewCount" json:"viewCount,omitempty"`
	LikeCount   int `dynamodbav:"likeCount" json:"likeCount,omitempty"`
}

// Returns key to query given user from db
func UserKey(userid string) *map[string]types.AttributeValue {
	userid = utils.RemovePrefix(userid, "#")
	return &map[string]types.AttributeValue{
		"pk": &types.AttributeValueMemberS{Value: UserPkPrefix + userid},
		"sk": &types.AttributeValueMemberS{Value: UserSkPrefix},
	}
}

// Returns a new user struct with the id and name provided
func NewUser(userid, name string) *User {
	return &User{
		Userid:      userid,
		Description: UserSkPrefix,
		Name:        name,
		DpUrl:       "",
	}
}

// DANGEROUS CODE: applies prefixes for database storage
func (u *User) ApplyPrefixes() {
	u.Userid = utils.AddPrefix(u.Userid, UserPkPrefix)
	u.Name = utils.AddPrefix(u.Name, UserGsiPrefix)
}

// Takes dynamo database items and tries to convert them to user structs
func DbItemsToUserStructs(items *[]map[string]types.AttributeValue) *[]User {
	return utils.DatabaseItemsToStructs(items, func(u *User) {
		u.Userid = strings.TrimPrefix(u.Userid, UserPkPrefix)
		u.Name = utils.RemovePrefix(u.Name, "#")
	})
}
