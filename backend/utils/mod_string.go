package utils

import "strings"

func AddPrefix(s, prefix string) string {
	parts := strings.Split(s, prefix)
	return prefix + parts[len(parts)-1]
}

func AddSuffix(s, suffix string) string {
	parts := strings.Split(s, suffix)
	return parts[0] + suffix
}
