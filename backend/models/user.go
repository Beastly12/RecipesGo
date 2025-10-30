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
	Fullname    string `dynamodbav:"gsi" json:"fullname"`
	DpUrl       string `dynamodbav:"dpUrl" json:"dpUrl"`
	Bio         string `dynamodbav:"bio" json:"bio"`
	Location    string `dynamodbav:"location" json:"location"`
}

// Returns key to query given user from db
func UserKey(userid string) *map[string]types.AttributeValue {
	return &map[string]types.AttributeValue{
		"pk": &types.AttributeValueMemberS{Value: UserPkPrefix + userid},
		"sk": &types.AttributeValueMemberS{Value: UserSkPrefix},
	}
}

// Returns a new user struct with the id and name provided
func NewUser(userid, fullname string) *User {
	return &User{
		Userid:      userid,
		Description: UserSkPrefix,
		Fullname:    fullname,
		DpUrl:       "",
	}
}

// DANGEROUS CODE: applies prefixes for database storage
func (u *User) ApplyPrefixes() {
	u.Userid = utils.AddPrefix(u.Userid, UserPkPrefix)
}

// Takes dynamo database items and tries to convert them to user structs
func DbItemsToUserStructs(items *[]map[string]types.AttributeValue) *[]User {
	return utils.DatabaseItemToStruct(items, func(u *User) {
		u.Userid = strings.TrimPrefix(u.Userid, UserPkPrefix)
	})
}
