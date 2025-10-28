package models

import (
	"backend/utils"
	"strings"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

const (
	UserPkPrefix = "USER#"
	UserSkPrefix = "PROFILE"
)

type User struct {
	Userid      string `dynamodbav:"pk" json:"userid"`
	Description string `dynamodbav:"sk" json:"-"`
	Nickname    string `dynamodbav:"gsi" json:"nickname"`
	DpUrl       string `dynamodbav:"dpUrl" json:"dpUrl"`
}

// Returns key to query given user from db
func UserKey(userid string) *map[string]types.AttributeValue {
	return &map[string]types.AttributeValue{
		"pk": &types.AttributeValueMemberS{Value: UserPkPrefix + userid},
		"sk": &types.AttributeValueMemberS{Value: UserSkPrefix},
	}
}

// Returns a new user struct with the id and name provided
func NewUser(userid, nickname string) *User {
	return &User{
		Userid:      userid,
		Description: UserSkPrefix,
		Nickname:    nickname,
		DpUrl:       "",
	}
}

// DANGEROUS CODE: applies prefixes for database storage
func (u *User) ApplyPrefixes() {
	u.Userid = utils.AddPrefix(u.Userid, UserPkPrefix)
}

// Takes dynamo database items and tries to convert them to user structs
func DbItemsToUserStructs(items *[]map[string]types.AttributeValue) (*[]User, error) {
	return utils.DatabaseItemToStruct(items, func(u *User) {
		u.Userid = strings.TrimPrefix(u.Userid, UserPkPrefix)
	})
}
