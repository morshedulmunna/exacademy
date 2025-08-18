package services

// HealthService handles gRPC health check requests
type HealthService struct {
	serviceName string
	version     string
}

// NewHealthService creates a new health service
func NewHealthService(serviceName, version string) *HealthService {
	return &HealthService{
		serviceName: serviceName,
		version:     version,
	}
}
