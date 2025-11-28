package utils

import (
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
)

const imgStorageKey = "images/" // PLEASE DO NOT TOUCH

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
	return fmt.Sprintf("%s%s/%d_%s.%s", imgStorageKey, userID, timestamp, uniqueID, extension)
}

func GenerateStaticImageKey(imageId, extension string) string {
	// format: images/{id}.{ext}
	return fmt.Sprintf("%s%s.%s", imgStorageKey, imageId, extension)
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
func GenerateViewURL(imageKey string) string {
	domainParts := strings.Split(GetDependencies().CloudFrontDomainName, "//")
	cloudfrontDomain := "https://" + domainParts[len(domainParts)-1] + "/"

	keyParts := strings.Split(imageKey, imgStorageKey)
	imageKey = imgStorageKey + keyParts[len(keyParts)-1]
	return cloudfrontDomain + imageKey
}
