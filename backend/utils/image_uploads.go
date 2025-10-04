package utils

import (
	"fmt"
	"time"

	"github.com/google/uuid"
)

func IsValidImageExtension(ext string) bool {
	validExtensions := map[string]bool{
		"jpg":  true,
		"jpeg": true,
		"png":  true,
		"gif":  true,
		"webp": true,
	}
	return validExtensions[ext]
}

// creates a unique s3 key for images
func GenerateImageKey(userID, extension string) string {
	timestamp := time.Now().Unix()
	uniqueID := uuid.New().String()[:8]

	// format: images/{userID}/{timestamp}_{uniqueID}.{ext}
	return fmt.Sprintf("images/%s/%d_%s.%s", userID, timestamp, uniqueID, extension)
}

// returns the MIME type for the file extension
func GetContentType(extension string) string {
	contentTypes := map[string]string{
		"jpg":  "image/jpeg",
		"jpeg": "image/jpeg",
		"png":  "image/png",
		"gif":  "image/gif",
		"webp": "image/webp",
	}

	if ct, ok := contentTypes[extension]; ok {
		return ct
	}
	return "fake"
}

// creates the cloudfront url for viewing the image
func GenerateViewURL(imageKey, cloudfrontDomain, bucketName string) string {
	if imageKey == "" {
		return ""
	}

	if cloudfrontDomain != "" {
		return fmt.Sprintf("https://%s/%s", cloudfrontDomain, imageKey)
	}

	if bucketName == "" {
		return ""
	}
	// Fallback to S3 URL if CloudFront domain not configured
	return fmt.Sprintf("https://%s.s3.amazonaws.com/%s", bucketName, imageKey)
}
