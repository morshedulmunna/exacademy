package httpintegration_test

import (
    "net/http"
    "net/http/httptest"
    "testing"

    "execute_academy/internal/interfaces/http/routes"
)

// Note: This is a lightweight integration test using ServeMux directly.
func TestWelcomeRoutes(t *testing.T) {
    mux := http.NewServeMux()
    handler := routes.SetupRoutes(mux, nil)

    ts := httptest.NewServer(handler)
    defer ts.Close()

    for _, path := range []string{"/api", "/api/v1", "/health"} {
        resp, err := http.Get(ts.URL + path)
        if err != nil {
            t.Fatalf("GET %s failed: %v", path, err)
        }
        if resp.StatusCode != http.StatusOK {
            t.Fatalf("%s expected 200 got %d", path, resp.StatusCode)
        }
        _ = resp.Body.Close()
    }
}


