package config

import (
	"fmt"
	"log/slog"
	"net/url"
	"os"
	"strings"
	"sync"
)

// Mode represents the application mode
type Mode string

const (
	Development Mode = "development"
	Production  Mode = "production"
	Testing     Mode = "testing"
)

// PostgresDatabase represents PostgreSQL database configuration
type PostgresDatabase struct {
	Host                string `envconfig:"POSTGRES_HOST" default:"localhost"`
	Database            string `envconfig:"POSTGRES_DATABASE"`
	User                string `envconfig:"POSTGRES_USER"`
	Password            string `envconfig:"POSTGRES_PASSWORD"`
	Port                int    `envconfig:"POSTGRES_PORT" default:"5432"`
	ReplicaSet          string `envconfig:"POSTGRES_REPLICA_SET"`
	SSL                 bool   `envconfig:"POSTGRES_SSL" default:"false"`
	MaxPoolSize         uint64 `envconfig:"POSTGRES_MAX_POOL_SIZE" default:"10"`
	MinPoolSize         uint64 `envconfig:"POSTGRES_MIN_POOL_SIZE" default:"1"`
	MaxConnIdleTimeInMs int    `envconfig:"POSTGRES_MAX_CONN_IDLE_TIME_MS" default:"300000"`
}

// MongoDatabase represents MongoDB database configuration
type MongoDatabase struct {
	// Full connection URI (takes precedence if provided)
	URI string `envconfig:"MONGO_URI"`

	// Individual connection parts (used when URI is empty)
	Host       string `envconfig:"MONGO_HOST" default:"localhost"`
	Port       int    `envconfig:"MONGO_PORT" default:"27017"`
	User       string `envconfig:"MONGO_USER"`
	Password   string `envconfig:"MONGO_PASSWORD"`
	Database   string `envconfig:"MONGO_DATABASE"`
	AuthSource string `envconfig:"MONGO_AUTH_SOURCE"`
	ReplicaSet string `envconfig:"MONGO_REPLICA_SET"`
	TLS        bool   `envconfig:"MONGO_TLS" default:"false"`

	// Pool and timeout configuration
	MaxPoolSize      uint64 `envconfig:"MONGO_MAX_POOL_SIZE" default:"10"`
	MinPoolSize      uint64 `envconfig:"MONGO_MIN_POOL_SIZE" default:"0"`
	ConnectTimeoutMs int    `envconfig:"MONGO_CONNECT_TIMEOUT_MS" default:"10000"`
}

// RedisConfig represents Redis cache configuration
type RedisConfig struct {
	Host     string `envconfig:"REDIS_HOST" default:"localhost"`
	Port     int    `envconfig:"REDIS_PORT" default:"6379"`
	Password string `envconfig:"REDIS_PASSWORD"`
	DB       int    `envconfig:"REDIS_DB" default:"0"`
	PoolSize int    `envconfig:"REDIS_POOL_SIZE" default:"10"`
	MinIdle  int    `envconfig:"REDIS_MIN_IDLE" default:"5"`
}

// KafkaConfig represents Kafka configuration
type KafkaConfig struct {
	Brokers     []string `envconfig:"KAFKA_BROKERS" default:"localhost:9092"`
	ClientID    string   `envconfig:"KAFKA_CLIENT_ID" default:"execute_academy"`
	GroupID     string   `envconfig:"KAFKA_GROUP_ID" default:"execute_academy-group"`
	EnableKafka bool     `envconfig:"KAFKA_ENABLE" default:"true"`
	Topics      struct {
		UserEvents   string `envconfig:"KAFKA_TOPIC_EVENTS" default:"user-events"`
		UserCommands string `envconfig:"KAFKA_TOPIC_COMMANDS" default:"user-commands"`
	}
	Consumer struct {
		AutoOffsetReset string `envconfig:"KAFKA_CONSUMER_AUTO_OFFSET_RESET" default:"earliest"`
		MaxBytes        int    `envconfig:"KAFKA_CONSUMER_MAX_BYTES" default:"1048576"`
		MaxWaitSeconds  int    `envconfig:"KAFKA_CONSUMER_MAX_WAIT_SECONDS" default:"10"`
	}
	Producer struct {
		RequiredAcks int `envconfig:"KAFKA_PRODUCER_REQUIRED_ACKS" default:"1"`
		MaxAttempts  int `envconfig:"KAFKA_PRODUCER_MAX_ATTEMPTS" default:"3"`
	}
}

// NatsConfig represents NATS configuration
type NatsConfig struct {
	URL      string `envconfig:"NATS_URL" default:"nats://localhost:4222"`
	ClientID string `envconfig:"NATS_CLIENT_ID" default:"execute_academy"`
	Cluster  string `envconfig:"NATS_CLUSTER" default:"test-cluster"`
	Subjects struct {
		UserEvents   string `envconfig:"NATS_SUBJECT_EVENTS" default:"user.events"`
		UserCommands string `envconfig:"NATS_SUBJECT_COMMANDS" default:"user.commands"`
		UserQueries  string `envconfig:"NATS_SUBJECT_QUERIES" default:"user.queries"`
	}
	QueueGroup string `envconfig:"NATS_QUEUE_GROUP" default:"execute_academy-group"`
}

// ExternalService represents external service configuration
type ExternalService struct {
	Name     string `envconfig:"EXTERNAL_SERVICE_NAME"`
	BaseURL  string `envconfig:"EXTERNAL_SERVICE_BASE_URL"`
	Timeout  int    `envconfig:"EXTERNAL_SERVICE_TIMEOUT" default:"30"`
	APIKey   string `envconfig:"EXTERNAL_SERVICE_API_KEY"`
	Username string `envconfig:"EXTERNAL_SERVICE_USERNAME"`
	Password string `envconfig:"EXTERNAL_SERVICE_PASSWORD"`
}

// GrpcService represents gRPC external service configuration
type GrpcService struct {
	Name    string `envconfig:"GRPC_SERVICE_NAME"`
	Host    string `envconfig:"GRPC_SERVICE_HOST"`
	Port    int    `envconfig:"GRPC_SERVICE_PORT" default:"50051"`
	Timeout int    `envconfig:"GRPC_SERVICE_TIMEOUT" default:"30"`
}

// EmailConfig represents email service configuration
type EmailConfig struct {
	SMTPHost     string `envconfig:"SMTP_HOST" default:"localhost"`
	SMTPPort     int    `envconfig:"SMTP_PORT" default:"587"`
	SMTPUsername string `envconfig:"SMTP_USERNAME"`
	SMTPPassword string `envconfig:"SMTP_PASSWORD"`
	FromEmail    string `envconfig:"FROM_EMAIL" default:"noreply@execute_academy.com"`
	FromName     string `envconfig:"FROM_NAME" default:"execute_academy"`
	TemplatePath string `envconfig:"EMAIL_TEMPLATE_PATH" default:"./templates/email"`
	QueueType    string `envconfig:"EMAIL_QUEUE_TYPE" default:"kafka"` // kafka or nats
}

type CorsOrigin struct {
	Origin []string `envconfig:"CORS_ORIGIN"`
}

// Config represents the application configuration
type Config struct {
	Version          string `envconfig:"VERSION" default:"1.0.0"`
	Mode             Mode   `envconfig:"MODE" default:"development"`
	ServiceName      string `envconfig:"SERVICE_NAME" default:"starter-service"`
	HttpPort         int    `envconfig:"HTTP_PORT" default:"8080"`
	GrpcPort         int    `envconfig:"GRPC_PORT" default:"8081"`
	HealthCheckRoute string `envconfig:"HEALTH_CHECK_ROUTE" default:"/health"`
	ApiVersion       string `envconfig:"API_VERSION" default:"v1"`
	JwtSecret        string `envconfig:"JWT_SECRET" default:"secret"`
	// JwtAccessTTLMinutes controls the lifetime of access tokens in minutes
	// Defaults to 1440 minutes (24 hours) when not provided
	JwtAccessTTLMinutes int    `envconfig:"JWT_ACCESS_TTL_MINUTES" default:"1440"`
	ServiceBasePath     string `envconfig:"SERVICE_BASE_PATH" default:"/api/v1"`

	// Database configuration
	Database PostgresDatabase

	// MongoDB configuration
	Mongo MongoDatabase

	// Cache configuration
	Redis RedisConfig

	// Message broker configuration
	Kafka KafkaConfig
	Nats  NatsConfig

	// Email configuration
	Email EmailConfig

	// External services configuration
	ExternalServices map[string]ExternalService
	GrpcServices     map[string]GrpcService

	// Logging
	LogLevel string `envconfig:"LOG_LEVEL" default:"info"`

	// CORS configuration
	Cors CorsOrigin

	// OAuth configuration
	OAuth struct {
		GoogleClientID     string `envconfig:"GOOGLE_CLIENT_ID"`
		GoogleClientSecret string `envconfig:"GOOGLE_CLIENT_SECRET"`
		OAuthRedirectURL   string `envconfig:"OAUTH_REDIRECT_URL"`
		FrontendAppURL     string `envconfig:"FRONTEND_APP_URL" default:"http://localhost:3000"`
	}
}

var (
	config *Config
	once   sync.Once
)

// GetConfig returns the application configuration
func GetConfig() *Config {
	once.Do(func() {
		// Load configuration from .env file and environment variables
		if err := LoadConfig(); err != nil {
			slog.Error("Failed to load configuration", "error", err)
			os.Exit(1)
		}
	})
	return config
}

// IsDevelopment checks if the application is in development mode
func (c *Config) IsDevelopment() bool {
	return c.Mode == Development
}

// IsProduction checks if the application is in production mode
func (c *Config) IsProduction() bool {
	return c.Mode == Production
}

// IsTesting checks if the application is in testing mode
func (c *Config) IsTesting() bool {
	return c.Mode == Testing
}

// GetDatabaseURL returns the database URL
func (c *Config) GetDatabaseURL() string {
	// Use the new Database configuration if available
	if c.Database.User != "" && c.Database.Password != "" && c.Database.Database != "" {
		sslMode := "disable"
		if c.Database.SSL {
			sslMode = "require"
		}
		return fmt.Sprintf("postgres://%s:%s@%s:%d/%s?sslmode=%s",
			c.Database.User, c.Database.Password, c.Database.Host, c.Database.Port, c.Database.Database, sslMode)
	}

	return ""
}

// GetMongoURI returns the MongoDB connection URI
func (c *Config) GetMongoURI() string {
	// Prefer explicit URI if provided
	if c.Mongo.URI != "" {
		return c.Mongo.URI
	}

	// Build URI from discrete fields
	var auth string
	if c.Mongo.User != "" {
		user := url.QueryEscape(c.Mongo.User)
		pass := url.QueryEscape(c.Mongo.Password)
		// Include password only if provided
		if c.Mongo.Password != "" {
			auth = fmt.Sprintf("%s:%s@", user, pass)
		} else {
			auth = fmt.Sprintf("%s@", user)
		}
	}

	hostPort := fmt.Sprintf("%s:%d", c.Mongo.Host, c.Mongo.Port)

	// Optional database path
	path := ""
	if c.Mongo.Database != "" {
		path = "/" + url.PathEscape(c.Mongo.Database)
	}

	// Query parameters
	var params []string
	if c.Mongo.ReplicaSet != "" {
		params = append(params, "replicaSet="+url.QueryEscape(c.Mongo.ReplicaSet))
	}
	if c.Mongo.TLS {
		params = append(params, "tls=true")
	}
	if c.Mongo.AuthSource != "" {
		params = append(params, "authSource="+url.QueryEscape(c.Mongo.AuthSource))
	}
	// Sensible default: when a username is provided but no authSource, default to admin
	if c.Mongo.User != "" && c.Mongo.AuthSource == "" {
		params = append(params, "authSource=admin")
	}

	query := ""
	if len(params) > 0 {
		query = "?" + strings.Join(params, "&")
	}

	// Construct the final URI
	return fmt.Sprintf("mongodb://%s%s%s%s", auth, hostPort, path, query)
}
