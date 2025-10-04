package utils

import (
	"context"
	"log"
	"os"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type DynamoAndCloudfront struct {
	TableName            string
	CloudfrontDomainName string
	DbClient             *dynamodb.Client
}

type ObjectStorage struct {
	BucketName           string
	CloudfrontDomainName string
	S3Client             *s3.Client
}

func GetDynamodbAndCloudfrontInit() DynamoAndCloudfront {
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		log.Fatalf("unable to load SDK config: %v", err)
	}

	// load dynamodb stuff
	dbClient := dynamodb.NewFromConfig(cfg)

	tableName := os.Getenv("MAIN_TABLE")
	if tableName == "" {
		panic("MAIN_TABLE environment variable not set")
	}

	cloudfrontDomain := os.Getenv("CLOUDFRONT_DOMAIN")
	if cloudfrontDomain == "" {
		panic("CLOUDFRONT_DOMAIN environment var not set!")
	}

	return DynamoAndCloudfront{
		TableName:            tableName,
		CloudfrontDomainName: cloudfrontDomain,
		DbClient:             dbClient,
	}

}

func GetObjectStorageInit() ObjectStorage {
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		log.Fatalf("unable to load SDK config: %v", err)
	}

	// load dynamodb stuff
	s3Client := s3.NewFromConfig(cfg)

	bucketName := os.Getenv("RECIPE_IMAGES_BUCKET")
	if bucketName == "" {
		panic("BUCKET_NAME environment var not set!")
	}

	cloudfrontDomain := os.Getenv("CLOUDFRONT_DOMAIN")
	if cloudfrontDomain == "" {
		panic("CLOUDFRONT_DOMAIN environment var not set!")
	}

	return ObjectStorage{
		BucketName:           bucketName,
		CloudfrontDomainName: cloudfrontDomain,
		S3Client:             s3Client,
	}
}
