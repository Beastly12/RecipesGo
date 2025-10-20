package utils

import (
	"backend"
	"time"
)

func GetTimeNow() string {
	return time.Now().Format(backend.FULL_DATE_TIME_LAYOUT)
}
