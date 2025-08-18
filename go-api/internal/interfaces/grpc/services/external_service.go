package services

// ExternalServiceExample demonstrates external service consumption
type ExternalServiceExample struct {
	serviceName string
}

// NewExternalServiceExample creates a new external service example
func NewExternalServiceExample(serviceName string) *ExternalServiceExample {
	return &ExternalServiceExample{
		serviceName: serviceName,
	}
}
