#!/bin/bash

# Execute Academy - Server Deployment Script
# This script deploys the application to your DigitalOcean droplet

set -e

# Configuration
SERVER_IP="167.71.82.117"
SERVER_USER="tutorsplan"
DEPLOY_DIR="/opt/execute-academy"
BACKUP_DIR="/opt/execute-academy/backups"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the project root
if [ ! -f "docker-compose.yml" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Starting deployment to server..."

# Create backup on server
print_status "Creating backup on server..."
ssh ${SERVER_USER}@${SERVER_IP} "mkdir -p ${BACKUP_DIR}"
ssh ${SERVER_USER}@${SERVER_IP} "if [ -f ${DEPLOY_DIR}/docker-compose.yml ]; then tar -czf ${BACKUP_DIR}/backup-$(date +%Y%m%d-%H%M%S).tar.gz -C ${DEPLOY_DIR} .; fi"

# Stop existing containers
print_status "Stopping existing containers..."
ssh ${SERVER_USER}@${SERVER_IP} "cd ${DEPLOY_DIR} && docker-compose -f docker-compose.yml -f docker-compose.prod.yml down || true"

# Copy files to server
print_status "Copying files to server..."
rsync -avz --exclude='node_modules' --exclude='target' --exclude='.git' \
    --exclude='uploads' --exclude='backups' \
    ./ ${SERVER_USER}@${SERVER_IP}:${DEPLOY_DIR}/

# Create .env.production if it doesn't exist
print_status "Checking environment configuration..."
ssh ${SERVER_USER}@${SERVER_IP} "if [ ! -f ${DEPLOY_DIR}/.env.production ]; then
    cat > ${DEPLOY_DIR}/.env.production << 'ENVEOF'
POSTGRES_PASSWORD=change_me_secure_password
JWT_SECRET=your-long-random-secret-key-here
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change_this_secure_password
PUBLIC_API_BASE_URL=https://your-domain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your@email.com
SMTP_PASSWORD=your-app-password
SMTP_STARTTLS=true
EMAIL_FROM=no-reply@your-domain.com
EMAIL_FROM_NAME=Execute Academy
VIMEO_TOKEN=your-vimeo-token
ENVEOF
    echo 'Please update .env.production with your actual values'
fi"

# Build and start containers
print_status "Building and starting containers..."
ssh ${SERVER_USER}@${SERVER_IP} "cd ${DEPLOY_DIR} && docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build"

# Wait for services to be healthy
print_status "Waiting for services to be healthy..."
sleep 30

# Check health
print_status "Checking service health..."
if ssh ${SERVER_USER}@${SERVER_IP} "curl -f http://localhost/api/health > /dev/null 2>&1"; then
    print_status "✅ Deployment successful! Services are healthy."
else
    print_warning "⚠️  Health check failed. Check logs with: ssh ${SERVER_USER}@${SERVER_IP} 'cd ${DEPLOY_DIR} && docker-compose logs'"
fi

# Show deployment status
print_status "Deployment completed!"
echo ""
echo "📋 Deployment Summary:"
echo "======================"
echo "✅ Application deployed to: ${SERVER_IP}"
echo "✅ Backup created in: ${BACKUP_DIR}"
echo "✅ Application accessible at: http://${SERVER_IP}"
echo "✅ API health check: http://${SERVER_IP}/api/health"
echo ""
echo "🔧 Useful commands:"
echo "- View logs: ssh ${SERVER_USER}@${SERVER_IP} 'cd ${DEPLOY_DIR} && docker-compose logs -f'"
echo "- Restart services: ssh ${SERVER_USER}@${SERVER_IP} 'cd ${DEPLOY_DIR} && docker-compose restart'"
echo "- Check status: ssh ${SERVER_USER}@${SERVER_IP} 'cd ${DEPLOY_DIR} && docker-compose ps'"
echo ""
print_warning "Remember to update .env.production with your actual configuration values!"
