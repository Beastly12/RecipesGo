package utils

import (
	"encoding/json"
	"fmt"
	"log"
	"reflect"
)

var logChan = make(chan string, 1000)

func init() {
	go func() {
		for msg := range logChan {
			log.Print(msg)
		}
	}()
}

func BasicLog(msg string, val any) {
	if val == nil {
		select {
		case logChan <- "Message: " + msg + " (nil value)":
		default:
		}
		return
	}

	v := reflect.ValueOf(val)
	for v.Kind() == reflect.Ptr && !v.IsNil() {
		v = v.Elem()
	}
	val = v.Interface()

	bytes, err := json.MarshalIndent(val, "", "  ")
	if err != nil {
		select {
		case logChan <- msg + "\nVALUE: " + fmt.Sprintf("%+v", val):
		default:
		}
		return
	}

	select {
	case logChan <- msg + "\nVALUE: " + string(bytes):
	default:
	}
}

func ShutdownLogs() {
	close(logChan)
}
