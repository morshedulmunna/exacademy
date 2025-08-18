package global

import (
	"net/http"
	"time"

	"skoolz/config"
	"skoolz/pkg/shared/response"
)

// HealthResponse represents the health check response
type HealthResponse struct {
	Status    string                 `json:"status"`
	Service   string                 `json:"service"`
	Timestamp time.Time              `json:"timestamp"`
	Version   string                 `json:"version"`
	Services  map[string]interface{} `json:"services,omitempty"`
}

// HealthHandler handles health check requests
type HealthHandler struct {
	serviceName string
	version     string
}

// NewHealthHandler creates a new health handler
func NewHealthHandler() *HealthHandler {
	serviceName := config.GetConfig().ServiceName
	version := config.GetConfig().Version
	return &HealthHandler{
		serviceName: serviceName,
		version:     version,
	}
}

// HealthCheck handles the health check endpoint
func (h *HealthHandler) HealthCheck(w http.ResponseWriter, r *http.Request) {
	services := make(map[string]interface{})
	overallStatus := "ok"

	// Check messaging services if factory is available

	data := map[string]interface{}{
		"status":    overallStatus,
		"service":   h.serviceName,
		"timestamp": time.Now(),
		"version":   h.version,
		"services":  services,
	}

	response.WriteOK(w, "Service health check completed", data)
}
