package utils

import (
	"testing"
)

func TestAddPrefix(t *testing.T) {
	tests := []struct {
		word   string
		prefix string
		expect string
	}{
		{
			word:   "test",
			prefix: "first ",
			expect: "first test",
		},
		{
			word:   "first test",
			prefix: "first ",
			expect: "first test",
		},
		{
			word:   "first#test",
			prefix: "user#",
			expect: "user#test",
		},
	}

	for _, tt := range tests {
		t.Run(tt.expect, func(t *testing.T) {
			result := AddPrefix(tt.word, tt.prefix)
			if result != tt.expect {
				t.Errorf("Expected %v but got %v instead", tt.expect, result)
			}
		})
	}
}

func TestAddSuffix(t *testing.T) {
	tests := []struct {
		word   string
		suffix string
		expect string
	}{
		{
			word:   "first",
			suffix: " test",
			expect: "first test",
		},
		{
			word:   "test first",
			suffix: " first",
			expect: "test first",
		},
		{
			word:   "test#",
			suffix: "##",
			expect: "test###",
		},
	}

	for _, tt := range tests {
		t.Run(tt.expect, func(t *testing.T) {
			result := AddSuffix(tt.word, tt.suffix)
			if result != tt.expect {
				t.Errorf("Expected %v but got %v instead", tt.expect, result)
			}
		})
	}
}

func TestRemovePrefix(t *testing.T) {
	tests := []struct {
		str    string
		expect string
	}{
		{
			str:    "USER#123#RECIPE_DATE#12-12-2022 18:18:10",
			expect: "12-12-2022 18:18:10",
		},
	}

	for _, test := range tests {
		t.Run(test.str, func(t *testing.T) {
			result := RemovePrefix(test.str, "#")
			if result != test.expect {
				t.Errorf("Expected: %v\nbut got: %v instead!", test.expect, result)
			}
		})
	}
}

func TestRemoveInvalidChars(t *testing.T) {
	expected := "italian and food"
	subject := "italian, and food"
	result := removeEverythingExceptValidChars(subject)
	t.Run("remove invalid chars", func(t *testing.T) {
		if result != expected {
			t.Errorf("expected %v but got %v instead", expected, result)
		}
	})
}
