package handlers

import (
	"backend/models"
	"backend/utils"
	"context"
	"strings"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type GetUploadUrlDependencies struct {
	BucketName       string
	CloudfrontDomain string
	S3Client         *s3.Client
}

func NewGetUploadUrlHandler(dependencies *utils.ObjectStorage) *GetUploadUrlDependencies {
	return &GetUploadUrlDependencies{
		BucketName:       dependencies.BucketName,
		CloudfrontDomain: dependencies.CloudfrontDomainName,
		S3Client:         dependencies.S3Client,
	}
}

type response struct {
	UploadUrl string `json:"uploadUrl"`
	ImageKey  string `json:"imageKey"`
}

func (deps *GetUploadUrlDependencies) HandleGetUploadUrl(ctx context.Context, req *events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	userid := utils.GetAuthUserId(req)
	if userid == "" {
		return models.InvalidRequestErrorResponse("User id not found"), nil
	}

	fileExtension := req.QueryStringParameters["ext"]

	fileExtension = strings.ToLower(strings.TrimPrefix(fileExtension, "."))

	if !utils.IsValidImageExtension(fileExtension) {
		return models.InvalidRequestErrorResponse("Invalid image file extension. Only jpg, jpeg, png, gif, and webp are allowed!"), nil
	}

	imageKey := utils.GenerateImageKey(userid, fileExtension)

	// presign
	presignClient := s3.NewPresignClient(deps.S3Client)
	presignedReq, err := presignClient.PresignPutObject(ctx, &s3.PutObjectInput{
		Bucket:      &deps.BucketName,
		Key:         &imageKey,
		ContentType: aws.String(utils.GetContentType(fileExtension)),
	}, func(po *s3.PresignOptions) {
		po.Expires = 15 * time.Minute
	})
	if err != nil {
		return models.ServerSideErrorResponse("Failed to generate presigned url", err), nil
	}

	res := response{
		UploadUrl: presignedReq.URL,
		ImageKey:  imageKey,
	}

	return models.SuccessfulGetRequestResponse(res), nil
}
