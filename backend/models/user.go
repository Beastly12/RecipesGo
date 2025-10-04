package models

import (
	"backend/utils"
	"log"
	"strings"

	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

const (
	UserPkPrefix = "USER#"
	UserSkPrefix = "PROFILE"
)

type User struct {
	Userid      string `dynamodbav:"pk" json:"userid"`
	Description string `dynamodbav:"sk" json:"-"`
	Nickname    string `dynamodbav:"nickname" json:"nickname"`
	DpUrl       string `dynamodbav:"dpUrl" json:"dpUrl"`
	Bio         string `dynamodbav:"bio" json:"bio"`
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
		Bio:         "",
	}
}

// Takes in a user struct and returns a dynamo database item for user
func (u User) ToDatabaseFormat() *map[string]types.AttributeValue {
	u.Userid = utils.AddPrefix(u.Userid, UserPkPrefix)

	item, err := attributevalue.MarshalMap(u)

	if err != nil {
		panic("Failed to marshal user struct to db item")
	}

	return &item
}

// Takes dynamo database items and tries to convert them to user structs
func DbItemsToUserStructs(items *[]map[string]types.AttributeValue) (*[]User, error) {
	var users []User
	if err := attributevalue.UnmarshalListOfMaps(*items, &users); err != nil {
		log.Println("An error occurred while trying to unmarshal list of database items to user structs")
		return nil, err
	}

	// clean up
	for index, item := range users {
		users[index].Userid = strings.TrimPrefix(item.Userid, UserPkPrefix)
	}

	return &users, nil
}
