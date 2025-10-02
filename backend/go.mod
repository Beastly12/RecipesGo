module backend

go 1.24.4

require github.com/aws/aws-sdk-go-v2/service/dynamodb v1.50.5

require github.com/aws/aws-sdk-go-v2/service/dynamodbstreams v1.31.0 // indirect

require (
	github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue v1.20.13
	github.com/aws/smithy-go v1.23.0 // indirect
	github.com/google/uuid v1.6.0
)
