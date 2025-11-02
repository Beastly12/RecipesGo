package utils

import "log"

func BasicLog(msg string, val interface{}) {
	if val != nil {
		log.Printf(msg+" \nVALUE: %v", val)
	} else {
		log.Panicln(msg)
	}
}
