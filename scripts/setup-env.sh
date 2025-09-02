#!/bin/bash

# Setup Environment Variables for Execute Academy
# This script helps you set up the environment variables for different environments

set -e

echo "🚀 Execute Academy Environment Setup"
echo "=================================="

# Function to create .env file
create_env_file() {
    local env_file=$1
    local environment=$2
    
    echo "📝 Creating $env_file for $environment environment..."
    
    cat > "$env_file" << EOF
# Execute Academy - $environment Environment
# Generated on $(date)

# --- Database ---
DATABASE_URL=postgres://execute_academy:password@localhost:5432/execute_academy?sslmode=disable
DB_HOST=localhost
DB_PORT=5432
DB_USER=execute_academy
DB_PASSWORD=password
DB_NAME=execute_academy
DB_SSLMODE=disable

# --- System ---
APP_ENV=$environment
LOG_LEVEL=info
API_HOST=127.0.0.1
API_PORT=8080
GRPC_HOST=127.0.0.1
GRPC_PORT=50051
SHUTDOWN_GRACE_SECONDS=10

# --- Auth/JWT ---
JWT_SECRET=SECRRTT@$$$454^^!!!DF@@@222
JWT_ISSUER=execute_academy
JWT_ACCESS_TTL_SECONDS=900
JWT_REFRESH_TTL_SECONDS=2592000

# --- Redis ---
REDIS_URL=redis://127.0.0.1:6379/0
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_USERNAME=
REDIS_PASSWORD=
REDIS_DB=0
REDIS_TLS=false

# --- Kafka (Email Queue) ---
KAFKA_BROKERS=localhost:9094
KAFKA_EMAIL_TOPIC=emails
KAFKA_CLIENT_ID=execute_academy_api

# --- DigitalOcean Spaces (S3-compatible) ---
SPACES_ENDPOINT=https://sfo3.digitaloceanspaces.com
SPACES_REGION=sfo3
SPACES_ACCESS_KEY_ID=DO00VBT4UACL8XQHX9YU
SPACES_SECRET_ACCESS_KEY=MXLMXyf6uBUmsyPeJODggQlQ7pNPhAaQeZ8W7GENPp8
SPACES_BUCKET_NAME=prod-storage0
SPACES_PUBLIC_URL=https://prod-storage0.sfo3.digitaloceanspaces.com

# --- Vimeo ---
VIMEO_TOKEN=dummy-local-token

# --- Admin User ---
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@execute_academy.local
ADMIN_PASSWORD=admin123

# --- SMTP/Email ---
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=executesoft.info@gmail.com
SMTP_PASSWORD=xnfumntpcoxczsce
SMTP_STARTTLS=true
EMAIL_FROM=executesoft.info@gmail.com
EMAIL_FROM_NAME=Execute Academy
EOF

    echo "✅ Created $env_file"
}

# Function to setup development environment
setup_dev() {
    echo "🔧 Setting up development environment..."
    create_env_file "apis/.env" "development"
    create_env_file "web/.env" "development"
    echo "✅ Development environment setup complete!"
}

# Function to setup production environment
setup_prod() {
    echo "🔧 Setting up production environment..."
    create_env_file "apis/.env.prod" "production"
    create_env_file "web/.env.prod" "production"
    echo "✅ Production environment setup complete!"
}

# Function to validate environment
validate_env() {
    echo "🔍 Validating environment variables..."
    
    # Check if required variables are set
    required_vars=(
        "SPACES_ENDPOINT"
        "SPACES_REGION"
        "SPACES_ACCESS_KEY_ID"
        "SPACES_SECRET_ACCESS_KEY"
        "SPACES_BUCKET_NAME"
        "SPACES_PUBLIC_URL"
    )
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            echo "❌ Missing required environment variable: $var"
            exit 1
        fi
    done
    
    echo "✅ All required environment variables are set!"
}

# Function to show help
show_help() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev     Setup development environment"
    echo "  prod    Setup production environment"
    echo "  validate Validate current environment variables"
    echo "  help    Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev      # Setup development environment"
    echo "  $0 prod     # Setup production environment"
    echo "  $0 validate # Validate environment variables"
}

# Main script logic
case "${1:-help}" in
    "dev")
        setup_dev
        ;;
    "prod")
        setup_prod
        ;;
    "validate")
        validate_env
        ;;
    "help"|*)
        show_help
        ;;
esac
