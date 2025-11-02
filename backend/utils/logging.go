package utils

import "log"

func BasicLog(msg string, val any) {
	if val == nil {
		log.Printf("WARN: %s (nil value)", msg)
		return
	}
	log.Printf("%s\nVALUE: %+v", msg, val)
}
