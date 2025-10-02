package models

import (
	"backend/utils"
	"log"
	"strings"

	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/google/uuid"
)

const (
	RecipesPkPrefix = "RECIPE#"
	RecipesSkPrefix = "RECIPE"
)

type Recipe struct {
	Id          string   `dynamodbav:"pk" json:"id"`
	ImageUrl    string   `dynamodbav:"imageUrl" json:"imageUrl"`
	Name        string   `dynamodbav:"name" json:"name"`
	AuthorName  string   `dynamodbav:"authorName" json:"authorName"`
	Description string   `dynamodbav:"description" json:"description"`
	Ingredients []string `dynamodbav:"ingredients" json:"ingredients"`
	SortKey     string   `dynamodbav:"sk"`
}

// Returns a recipe struct with details provided
func NewRecipe(name, imageUrl, authorName, description string, ingredients ...string) *Recipe {

	return &Recipe{
		Id:          uuid.New().String(),
		ImageUrl:    imageUrl,
		Name:        name,
		AuthorName:  authorName,
		Description: description,
		Ingredients: ingredients,
		SortKey:     RecipesSkPrefix,
	}
}

// Converts recipe struct to dynamo db items
func (r Recipe) ToDatabaseFormat() *map[string]types.AttributeValue {
	r.Id = utils.AddPrefix(r.Id, RecipesPkPrefix)

	item, err := attributevalue.MarshalMap(r)

	if err != nil {
		panic("An error occurred while converting recipe struct to db item")
	}

	return &item
}

// Converts db items to recipe structs
func DatabaseItemsToRecipeStructs(items *[]map[string]types.AttributeValue) (*[]Recipe, error) {
	var recipes []Recipe

	if err := attributevalue.UnmarshalListOfMaps(*items, &recipes); err != nil {
		log.Println("An error occurred while unmarshaling db items to recipe structs")
		return nil, err
	}

	for index, recipe := range recipes {
		recipes[index].Id = strings.TrimPrefix(recipe.Id, RecipesPkPrefix)
	}

	return &recipes, nil
}
