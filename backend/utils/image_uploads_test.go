package utils

import (
	"strings"
	"testing"
)

func TestIsValidImageExtension(t *testing.T) {
	tests := []struct {
		ext        string
		expectTrue bool
	}{
		{
			ext:        "jpg",
			expectTrue: true,
		},
		{
			ext:        "jpeg",
			expectTrue: true,
		},
		{
			ext:        "png",
			expectTrue: true,
		},
		{
			ext:        "gif",
			expectTrue: true,
		},
		{
			ext:        "webp",
			expectTrue: true,
		},
		{
			ext:        "mp3",
			expectTrue: false,
		},
		{
			ext:        "exe",
			expectTrue: false,
		},
		{
			ext:        "crypto",
			expectTrue: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.ext, func(t *testing.T) {
			result := IsValidImageExtension(tt.ext)
			if result != tt.expectTrue {
				t.Errorf("For %v file ext, expected %v but got %v instead", tt.ext, tt.expectTrue, result)
			}
		})
	}
}

func TestGenerateImageKey(t *testing.T) {
	// format: images/{userID}/{timestamp}_{uniqueID}.{ext}
	result := GenerateImageKey("123", "jpg")
	timestamp_uniqueid := strings.Split(result, "/")[2]
	expect := "images/123/" + timestamp_uniqueid

	if result != expect {
		t.Errorf("expected\n%v\n but got \n%v\n instead", expect, result)
	}
}

func TestGetContentType(t *testing.T) {
	tests := []struct {
		ext      string
		expected string
	}{
		{
			ext:      "jpg",
			expected: "image/jpeg",
		},
		{
			ext:      "jpeg",
			expected: "image/jpeg",
		},
		{
			ext:      "png",
			expected: "image/png",
		},
		{
			ext:      "gif",
			expected: "image/gif",
		},
		{
			ext:      "webp",
			expected: "image/webp",
		},
		{
			ext:      "exe",
			expected: "fake",
		},
		{
			ext:      "pgn",
			expected: "fake",
		},
	}

	for _, tt := range tests {
		t.Run(tt.ext, func(t *testing.T) {
			result := GetContentType(tt.ext)
			if result != tt.expected {
				t.Errorf("Expected %v but got %v instead", tt.expected, result)
			}
		})
	}
}

func TestGenerateViewUrl(t *testing.T) {
	tests := []struct {
		name     string
		imageKey string
		expect   string
	}{
		{
			name:     "test url with cloud front",
			imageKey: "test.jpg",
			expect:   "https://123abc.cloudfront.net/images/test.jpg",
		},
		{
			name:     "test url with cloud front",
			imageKey: "images/test.jpg",
			expect:   "https://123abc.cloudfront.net/images/test.jpg",
		},
		{
			name:     "test url with duplicate cloud front",
			imageKey: "https://cdn.cf.com/images/test.jpg",
			expect:   "https://123abc.cloudfront.net/images/test.jpg",
		},
		{
			name:     "test url with duplicate cloud front",
			imageKey: "https://d28on1laul5ygu.cloudfront.net/https://d28on1laul5ygu.cloudfront.net/images/96e2e2d4-60d1-700d-61fe-09c0d7f2d609/1764164851_1fafc2e2.jpeg",
			expect:   "https://123abc.cloudfront.net/images/96e2e2d4-60d1-700d-61fe-09c0d7f2d609/1764164851_1fafc2e2.jpeg",
		},
	}

	TEST_InitCloudFrontDependencies()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := GenerateViewURL(tt.imageKey)
			if tt.expect != result {
				t.Errorf("expected\n%v\n but got \n%v\n instead", tt.expect, result)
			}
		})
	}
}
