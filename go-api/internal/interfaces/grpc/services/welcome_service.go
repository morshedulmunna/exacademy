package services

// WelcomeService handles gRPC welcome requests
type WelcomeService struct {
	serviceName string
}

// NewWelcomeService creates a new welcome service
func NewWelcomeService(serviceName string) *WelcomeService {
	return &WelcomeService{
		serviceName: serviceName,
	}
}
