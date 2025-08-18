package response_test

import (
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "testing"

    "execute_academy/pkg/shared/response"
)

func TestWriteOK(t *testing.T) {
    rr := httptest.NewRecorder()
    response.WriteOK(rr, map[string]any{"hello": "world"})
    if rr.Code != http.StatusOK {
        t.Fatalf("expected 200, got %d", rr.Code)
    }
    var parsed map[string]any
    if err := json.Unmarshal(rr.Body.Bytes(), &parsed); err != nil {
        t.Fatalf("expected valid json: %v", err)
    }
    if parsed["status"] != "success" {
        t.Fatalf("expected status success, got %v", parsed["status"])
    }
}


