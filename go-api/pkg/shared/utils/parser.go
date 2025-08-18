package utils

import (
	"encoding/json"
	"execute_academy/pkg/shared/response"
	"net/http"
	"reflect"

	"github.com/go-playground/validator"
)

// ParseRequestBody parses the request body into the provided struct
// Returns true if parsing was successful, false otherwise
func ParseRequestBody(w http.ResponseWriter, r *http.Request, v interface{}) bool {
	if err := json.NewDecoder(r.Body).Decode(v); err != nil {
		response.WriteBadRequest(w, "Invalid request body")
		return false
	}
	return true
}

// ParseRequestBodyWithCustomError parses the request body with a custom error message
// Returns true if parsing was successful, false otherwise
func ParseRequestBodyWithCustomError(w http.ResponseWriter, r *http.Request, v interface{}, errorMessage string) bool {
	if err := json.NewDecoder(r.Body).Decode(v); err != nil {
		response.WriteBadRequest(w, errorMessage)
		return false
	}
	return true
}

// ParseRequestBodyWithValidation parses the request body and validates it using the provided validator
// Returns true if parsing and validation were successful, false otherwise
func ParseRequestBodyWithValidation(w http.ResponseWriter, r *http.Request, v any) bool {
	if !ParseRequestBody(w, r, v) {
		return false
	}

	// Only validate if v is a struct or pointer-to-struct
	rv := reflect.ValueOf(v)
	if rv.Kind() == reflect.Ptr {
		rv = rv.Elem()
	}
	if rv.IsValid() && rv.Kind() == reflect.Struct {
		validate := validator.New()
		if err := validate.Struct(v); err != nil {
			// Return validation errors as a bad request.
			response.WriteBadRequest(w, err.Error())
			return false
		}
	}

	return true
}

// ParseQueryParams parses query parameters into a map
func ParseQueryParams(r *http.Request) map[string]string {
	params := make(map[string]string)
	for key, values := range r.URL.Query() {
		if len(values) > 0 {
			params[key] = values[0]
		}
	}
	return params
}
