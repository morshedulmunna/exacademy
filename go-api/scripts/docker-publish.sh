#!/bin/bash

# Docker Hub publish script for Skoolz Go API
# Usage: ./scripts/docker-publish.sh [version] [username]

set -e

# Default values
VERSION=${1:-latest}
DOCKER_USERNAME=${2:-""}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if user is logged into Docker Hub
if ! docker info | grep -q "Username"; then
    print_warning "You are not logged into Docker Hub. Please run 'docker login' first."
    read -p "Do you want to continue with building the image locally? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Get Docker username if not provided
if [ -z "$DOCKER_USERNAME" ]; then
    if docker info | grep -q "Username"; then
        DOCKER_USERNAME=$(docker info | grep "Username" | awk '{print $2}')
        print_status "Using Docker Hub username: $DOCKER_USERNAME"
    else
        read -p "Enter your Docker Hub username: " DOCKER_USERNAME
        if [ -z "$DOCKER_USERNAME" ]; then
            print_error "Docker Hub username is required."
            exit 1
        fi
    fi
fi

# Image name
IMAGE_NAME="skoolz-go-api"
FULL_IMAGE_NAME="$DOCKER_USERNAME/$IMAGE_NAME:$VERSION"
LATEST_IMAGE_NAME="$DOCKER_USERNAME/$IMAGE_NAME:latest"

print_status "Building Docker image: $FULL_IMAGE_NAME"

# Build the image
docker build -t "$FULL_IMAGE_NAME" .

if [ $? -eq 0 ]; then
    print_status "Image built successfully!"
    
    # Tag as latest if this is not the latest tag
    if [ "$VERSION" != "latest" ]; then
        print_status "Tagging as latest..."
        docker tag "$FULL_IMAGE_NAME" "$LATEST_IMAGE_NAME"
    fi
    
    # Ask if user wants to push to Docker Hub
    read -p "Do you want to push the image to Docker Hub? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Pushing image to Docker Hub..."
        
        # Push the versioned image
        docker push "$FULL_IMAGE_NAME"
        
        # Push latest if this is not the latest tag
        if [ "$VERSION" != "latest" ]; then
            print_status "Pushing latest tag..."
            docker push "$LATEST_IMAGE_NAME"
        fi
        
        print_status "Image published successfully to Docker Hub!"
        print_status "Image: $FULL_IMAGE_NAME"
        if [ "$VERSION" != "latest" ]; then
            print_status "Latest: $LATEST_IMAGE_NAME"
        fi
    else
        print_warning "Image built but not pushed to Docker Hub."
        print_status "To push later, run: docker push $FULL_IMAGE_NAME"
    fi
else
    print_error "Failed to build Docker image."
    exit 1
fi
