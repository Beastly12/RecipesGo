package models

import (
	"backend/utils"
	"strings"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/google/uuid"
)

const (
	RecipesPkPrefix = "RECIPE#"
	RecipesSkPrefix = "RECIPE"
)

type Recipe struct {
	Id string `dynamodbav:"pk" json:"id"`
	RecipeDetails
	ItemType string `dynamodbav:"gsi" json:"-"` // nickname is gsi, so we can query by gsi
	SortKey  string `dynamodbav:"sk" json:"-"`
}

type RecipeDetails struct {
	ImageUrl        string   `dynamodbav:"imageUrl" json:"imageUrl,omitempty"`
	Name            string   `dynamodbav:"name" json:"name"`
	AuthorName      string   `dynamodbav:"authorName" json:"authorName"`
	Description     string   `dynamodbav:"description" json:"description"`
	Categories      []string `dynamodbav:"categories" json:"categories"`
	Ingredients     []string `dynamodbav:"ingredients" json:"ingredients"`
	PreparationTime int      `dynamodbav:"preparationTime" json:"preparationTime"`
	Difficulty      string   `dynamodbav:"difficulty" json:"difficulty"`
	DateCreated     string   `json:"dateCreated" dynamodbav:"lsi"`
}

// Returns a recipe struct with details provided
func NewRecipe(name, imageUrl, authorName, description string, preparationTimeMins int, difficulty string) *Recipe {

	time := utils.GetTimeNow()

	return &Recipe{
		Id: uuid.New().String(),
		RecipeDetails: RecipeDetails{
			ImageUrl:        imageUrl,
			Name:            name,
			AuthorName:      authorName,
			Description:     description,
			PreparationTime: preparationTimeMins,
			Difficulty:      difficulty,
			DateCreated:     time,
		},
		ItemType: RecipesSkPrefix, // sets nickname to be "RECIPE", to query all recipes
		SortKey:  RecipesSkPrefix,
	}
}

func (r *Recipe) AddIngredients(ingredients ...string) {
	r.Ingredients = append(r.Ingredients, ingredients...)
}

func (r *Recipe) AddCategories(categories ...string) {
	r.Categories = append(r.Categories, categories...)
}

// DANGEROUS CODE: applies prefixes for database storage
func (r *Recipe) ApplyPrefixes() {
	r.Id = utils.AddPrefix(r.Id, RecipesPkPrefix)
}

// Converts db items to recipe structs
func DatabaseItemsToRecipeStructs(items *[]map[string]types.AttributeValue, cloudfrontDomainName string) *[]Recipe {
	return utils.DatabaseItemToStruct(items, func(r *Recipe) {
		r.Id = strings.TrimPrefix(r.Id, RecipesPkPrefix)
		if r.ImageUrl != "" {
			r.ImageUrl = utils.GenerateViewURL(r.ImageUrl, cloudfrontDomainName)
		}
	})
}

func RecipeKey(recipeId string) *map[string]types.AttributeValue {
	return &map[string]types.AttributeValue{
		"pk": &types.AttributeValueMemberS{Value: RecipesPkPrefix + recipeId},
		"sk": &types.AttributeValueMemberS{Value: RecipesSkPrefix},
	}
}
