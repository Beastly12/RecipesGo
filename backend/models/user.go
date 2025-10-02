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

type user struct {
	Userid      string `dynamodbav:"pk" json:"userid"`
	Description string `dynamodbav:"sk"`
	Username    string `dynamodbav:"username" json:"username"`
	DpUrl       string `dynamodbav:"dpUrl" json:"dpUrl"`
	Bio         string `dynamodbav:"bio" json:"bio"`
}

// Returns a new user struct with the id and name provided
func NewUser(userid, username string) *user {
	return &user{
		Userid:      userid,
		Description: UserSkPrefix,
		Username:    username,
		DpUrl:       "",
		Bio:         "",
	}
}

// Takes in a user struct and returns a dynamo database item for user
func UserStructToDbItem(u user) *map[string]types.AttributeValue {
	u.Userid = utils.AddPrefix(u.Userid, UserPkPrefix)

	item, err := attributevalue.MarshalMap(u)

	if err != nil {
		panic("Failed to marshal user struct to db item")
	}

	return &item
}

// Takes dynamo database items and tries to convert them to user structs
func DbItemsToUserStructs(items *[]map[string]types.AttributeValue) (*[]user, error) {
	var users []user
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
