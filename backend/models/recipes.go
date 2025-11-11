package models

import (
	"backend/utils"
	"strings"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/google/uuid"
)

const (
	RecipesPkPrefix   = "RECIPE#"
	RecipesSkPrefix   = "RECIPE"
	RecipesGsiPrefix  = "RECIPE_TYPE#"
	RecipesGsi2Prefix = "RECIPE_CAT#"
	RecipesLsiPrefix  = "RECIPE_DATE#"
	RecipeItemType    = "RECIPE"
)

// pk: id, sk: category, gsi: type
// can query by id, category, all

type Recipe struct {
	Id          string `dynamodbav:"pk" json:"id"`
	SortKey     string `dynamodbav:"sk" json:"-"`
	ItemType    string `dynamodbav:"gsi" json:"-"`
	Category    string `dynamodbav:"gsi2" json:"category"`
	DateCreated string `json:"dateCreated" dynamodbav:"lsi"`
	RecipeDetails
}

type RecipeDetails struct {
	ImageUrl        string   `dynamodbav:"imageUrl" json:"imageUrl,omitempty"`
	Name            string   `dynamodbav:"name" json:"name"`
	Description     string   `dynamodbav:"description" json:"description"`
	AuthorId        string   `dynamodbav:"authorId" json:"authorId"`
	AuthorName      string   `dynamodbav:"authorName" json:"authorName"`
	AuthorDpUrl     string   `dynamodbav:"authorDpUrl" json:"authorDpUrl"`
	Ingredients     []string `dynamodbav:"ingredients" json:"ingredients"`
	PreparationTime int      `dynamodbav:"preparationTime" json:"preparationTime"`
	Difficulty      string   `dynamodbav:"difficulty" json:"difficulty"`
	Instructions    []string `dynamodbav:"instructions" json:"instructions"`
	IsPublic        bool     `dynamodbav:"isPublic" json:"isPublic"`
	Likes           int      `dynamodbav:"likes" json:"likes"`
	Rating          float64  `dynamodbav:"rating" json:"rating"`
	Views           int      `dynamodbav:"viewCount" json:"viewCount"`
}

// Returns a recipe struct with details provided
func NewRecipe(name, imageUrl, category, description string, preparationTimeMins int, difficulty string, isPublic bool, authorId, authorName, authorDpUrl string) *Recipe {

	return &Recipe{
		Id:      uuid.New().String(),
		SortKey: RecipesSkPrefix,
		RecipeDetails: RecipeDetails{
			ImageUrl:        imageUrl,
			Name:            name,
			AuthorName:      authorName,
			Description:     description,
			PreparationTime: preparationTimeMins,
			Difficulty:      difficulty,
			IsPublic:        isPublic,
			AuthorId:        authorId,
			AuthorDpUrl:     authorDpUrl,
		},
		DateCreated: utils.GetTimeNow(),
		ItemType:    RecipeItemType,            // query by item time, sort by date
		Category:    strings.ToLower(category), // query by category, sort by date
	}
}

func (r *Recipe) AddIngredients(ingredients ...string) {
	r.Ingredients = append(r.Ingredients, ingredients...)
}

func (r *Recipe) AddInstructions(instructions ...string) {
	r.Instructions = append(r.Instructions, instructions...)
}

// DANGEROUS CODE: applies prefixes for database storage
func (r *Recipe) ApplyPrefixes() {
	r.Id = utils.AddPrefix(r.Id, RecipesPkPrefix)
	r.ItemType = utils.AddPrefix(r.ItemType, RecipesGsiPrefix)
	r.Category = utils.AddPrefix(r.Category, RecipesGsi2Prefix)
	r.DateCreated = utils.AddPrefix(r.DateCreated, RecipesLsiPrefix)
}

// Converts db items to recipe structs
func DatabaseItemsToRecipeStructs(items *[]map[string]types.AttributeValue, cloudfrontDomainName string) *[]Recipe {
	return utils.DatabaseItemsToStructs(items, func(r *Recipe) {
		r.Id = strings.TrimPrefix(r.Id, RecipesPkPrefix)
		r.ItemType = strings.TrimPrefix(r.ItemType, RecipesGsiPrefix)
		r.Category = strings.TrimPrefix(r.Category, RecipesGsi2Prefix)
		r.DateCreated = strings.TrimPrefix(r.DateCreated, RecipesLsiPrefix)
		if r.ImageUrl != "" {
			r.ImageUrl = utils.GenerateViewURL(r.ImageUrl, cloudfrontDomainName)
		}
	})
}

func RecipeKey(recipeId string) *map[string]types.AttributeValue {
	return &map[string]types.AttributeValue{
		"pk": &types.AttributeValueMemberS{Value: RecipesPkPrefix + utils.RemovePrefix(recipeId, "#")},
		"sk": &types.AttributeValueMemberS{Value: RecipesSkPrefix},
	}
}
