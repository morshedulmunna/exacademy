package utils

import (
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"testing"
)

func TestParseRequestBody(t *testing.T) {
	tests := []struct {
		name           string
		requestBody    interface{}
		expectedResult bool
	}{
		{
			name:           "Valid JSON",
			requestBody:    map[string]string{"name": "test"},
			expectedResult: true,
		},
		{
			name:           "Invalid JSON",
			requestBody:    "invalid json",
			expectedResult: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var body []byte
			var err error

			if str, ok := tt.requestBody.(string); ok {
				body = []byte(str)
			} else {
				body, err = json.Marshal(tt.requestBody)
				if err != nil {
					t.Fatalf("Failed to marshal test data: %v", err)
				}
			}

			req := httptest.NewRequest("POST", "/test", bytes.NewBuffer(body))
			w := httptest.NewRecorder()

			var result map[string]interface{}
			success := ParseRequestBody(w, req, &result)

			if success != tt.expectedResult {
				t.Errorf("ParseRequestBody() = %v, want %v", success, tt.expectedResult)
			}
		})
	}
}

func TestParseQueryParams(t *testing.T) {
	req := httptest.NewRequest("GET", "/test?name=john&age=25&city=newyork", nil)
	params := ParseQueryParams(req)

	expected := map[string]string{
		"name": "john",
		"age":  "25",
		"city": "newyork",
	}

	for key, value := range expected {
		if params[key] != value {
			t.Errorf("ParseQueryParams() = %v, want %v for key %s", params[key], value, key)
		}
	}
}

func TestParseRequestBodyWithCustomError(t *testing.T) {
	req := httptest.NewRequest("POST", "/test", bytes.NewBuffer([]byte("invalid json")))
	w := httptest.NewRecorder()

	var result map[string]interface{}
	customError := "Custom error message"
	success := ParseRequestBodyWithCustomError(w, req, &result, customError)

	if success {
		t.Error("ParseRequestBodyWithCustomError() should return false for invalid JSON")
	}
}

func TestParseRequestBodyWithValidation(t *testing.T) {
	tests := []struct {
		name           string
		requestBody    string
		expectedResult bool
	}{
		{
			name:           "Valid JSON with valid struct",
			requestBody:    `{"name":"test","email":"test@example.com"}`,
			expectedResult: true,
		},
		{
			name:           "Invalid JSON",
			requestBody:    "invalid json",
			expectedResult: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest("POST", "/test", bytes.NewBuffer([]byte(tt.requestBody)))
			w := httptest.NewRecorder()

			var result map[string]interface{}
			success := ParseRequestBodyWithValidation(w, req, &result)

			if success != tt.expectedResult {
				t.Errorf("ParseRequestBodyWithValidation() = %v, want %v", success, tt.expectedResult)
			}
		})
	}
}
