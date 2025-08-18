package swagger_test

import (
    "net/http"
    "net/http/httptest"
    "testing"

    "execute_academy/internal/interfaces/http/middleware"
    swag "execute_academy/internal/interfaces/http/swagger"
)

func TestServeOpenAPI(t *testing.T) {
    req := httptest.NewRequest(http.MethodGet, "/api/openapi.json", nil)
    rr := httptest.NewRecorder()
    swag.ServeOpenAPI(rr, req)
    if rr.Code != http.StatusOK {
        t.Fatalf("expected 200, got %d", rr.Code)
    }
    if ct := rr.Header().Get("Content-Type"); ct != "application/json" {
        t.Fatalf("expected json content-type, got %s", ct)
    }
}

func TestServeSwaggerUI(t *testing.T) {
    req := httptest.NewRequest(http.MethodGet, "/api/docs", nil)
    rr := httptest.NewRecorder()
    handler := middleware.NewManager().With(http.HandlerFunc(swag.ServeSwaggerUI))
    handler.ServeHTTP(rr, req)
    if rr.Code != http.StatusOK {
        t.Fatalf("expected 200, got %d", rr.Code)
    }
    if ct := rr.Header().Get("Content-Type"); ct == "" {
        t.Fatalf("expected content-type header present")
    }
}


