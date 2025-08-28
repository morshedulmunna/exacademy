#!/bin/bash

# Local testing script for Execute Academy
# This script helps you test the application locally using Docker Compose and k3d

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CLUSTER_NAME="execute-academy-local"
NAMESPACE="local"
RELEASE_NAME="execute-academy"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    local missing_tools=()
    
    if ! command_exists docker; then
        missing_tools+=("docker")
    fi
    
    if ! command_exists docker-compose; then
        missing_tools+=("docker-compose")
    fi
    
    if ! command_exists kubectl; then
        missing_tools+=("kubectl")
    fi
    
    if ! command_exists helm; then
        missing_tools+=("helm")
    fi
    
    if ! command_exists k3d; then
        missing_tools+=("k3d")
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        print_error "Missing required tools: ${missing_tools[*]}"
        print_status "Please install the missing tools and try again."
        exit 1
    fi
    
    print_success "All prerequisites are installed!"
}

# Function to test with Docker Compose
test_docker_compose() {
    print_status "Testing with Docker Compose..."
    
    # Stop any existing containers
    docker-compose down --volumes --remove-orphans
    
    # Build and start services
    print_status "Building and starting services..."
    docker-compose up --build -d
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 30
    
    # Check service health
    print_status "Checking service health..."
    
    # Check backend health
    if curl -f http://localhost:9098/api/health >/dev/null 2>&1; then
        print_success "Backend is healthy!"
    else
        print_error "Backend health check failed!"
        docker-compose logs api
        return 1
    fi
    
    # Check frontend (through nginx)
    if curl -f http://localhost:8080/ >/dev/null 2>&1; then
        print_success "Frontend is accessible!"
    else
        print_error "Frontend health check failed!"
        docker-compose logs web
        return 1
    fi
    
    print_success "Docker Compose test completed successfully!"
    
    # Show service URLs
    echo ""
    print_status "Service URLs:"
    echo "  Frontend: http://localhost:8080"
    echo "  Backend API: http://localhost:9098"
    echo "  PostgreSQL: localhost:5432"
    echo "  Redis: localhost:6379"
    echo ""
    
    read -p "Press Enter to stop Docker Compose services..."
    docker-compose down --volumes
}

# Function to setup k3d cluster
setup_k3d_cluster() {
    print_status "Setting up k3d cluster..."
    
    # Check if cluster already exists
    if k3d cluster list | grep -q "$CLUSTER_NAME"; then
        print_warning "Cluster $CLUSTER_NAME already exists. Deleting..."
        k3d cluster delete "$CLUSTER_NAME"
    fi
    
    # Create new cluster
    print_status "Creating k3d cluster: $CLUSTER_NAME"
    k3d cluster create "$CLUSTER_NAME" \
        --servers 1 \
        --agents 2 \
        --port "8080:30000@loadbalancer" \
        --port "9098:30001@loadbalancer" \
        --k3s-arg "--disable=traefik@server:0" \
        --wait
    
    # Configure kubectl
    k3d kubeconfig merge "$CLUSTER_NAME" --kubeconfig-switch-context
    
    print_success "k3d cluster created successfully!"
}

# Function to install NGINX Ingress Controller
install_ingress_controller() {
    print_status "Installing NGINX Ingress Controller..."
    
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/baremetal/deploy.yaml
    
    # Wait for ingress controller to be ready
    print_status "Waiting for NGINX Ingress Controller to be ready..."
    kubectl wait --namespace ingress-nginx \
        --for=condition=ready pod \
        --selector=app.kubernetes.io/component=controller \
        --timeout=300s
    
    print_success "NGINX Ingress Controller installed!"
}

# Function to build and load Docker images
build_and_load_images() {
    print_status "Building and loading Docker images to k3d..."
    
    # Build backend image
    print_status "Building backend image..."
    docker build -t execute-academy-backend:local ./api-server
    
    # Build frontend image
    print_status "Building frontend image..."
    docker build -t execute-academy-frontend:local ./web
    
    # Load images into k3d cluster
    print_status "Loading images into k3d cluster..."
    k3d image import execute-academy-backend:local -c "$CLUSTER_NAME"
    k3d image import execute-academy-frontend:local -c "$CLUSTER_NAME"
    
    print_success "Images loaded successfully!"
}

# Function to deploy to Kubernetes
deploy_to_kubernetes() {
    print_status "Deploying to Kubernetes..."
    
    # Create namespace
    kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -
    
    # Deploy using Helm
    print_status "Deploying with Helm..."
    helm upgrade --install "$RELEASE_NAME" ./helm-charts/execute-academy \
        --namespace "$NAMESPACE" \
        --values ./helm-charts/execute-academy/values-local.yaml \
        --wait \
        --timeout=10m
    
    print_success "Deployment completed!"
}

# Function to test Kubernetes deployment
test_kubernetes_deployment() {
    print_status "Testing Kubernetes deployment..."
    
    # Wait for pods to be ready
    print_status "Waiting for pods to be ready..."
    kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=execute-academy -n "$NAMESPACE" --timeout=300s
    
    # Check pod status
    print_status "Pod status:"
    kubectl get pods -n "$NAMESPACE"
    
    # Check services
    print_status "Service status:"
    kubectl get services -n "$NAMESPACE"
    
    # Check ingress
    print_status "Ingress status:"
    kubectl get ingress -n "$NAMESPACE"
    
    # Test endpoints
    print_status "Testing endpoints..."
    
    # Test backend health
    if kubectl exec -n "$NAMESPACE" deployment/"$RELEASE_NAME"-backend -- wget -qO- http://localhost:9098/api/health >/dev/null 2>&1; then
        print_success "Backend health check passed!"
    else
        print_error "Backend health check failed!"
        kubectl logs -n "$NAMESPACE" deployment/"$RELEASE_NAME"-backend
        return 1
    fi
    
    # Test frontend
    if kubectl exec -n "$NAMESPACE" deployment/"$RELEASE_NAME"-frontend -- wget -qO- http://localhost:3000/ >/dev/null 2>&1; then
        print_success "Frontend health check passed!"
    else
        print_error "Frontend health check failed!"
        kubectl logs -n "$NAMESPACE" deployment/"$RELEASE_NAME"-frontend
        return 1
    fi
    
    print_success "Kubernetes deployment test completed successfully!"
    
    # Show access information
    echo ""
    print_status "Access Information:"
    echo "  Frontend: http://localhost:8080"
    echo "  Backend API: http://localhost:9098"
    echo ""
    print_status "To view logs:"
    echo "  Backend: kubectl logs -n $NAMESPACE deployment/$RELEASE_NAME-backend"
    echo "  Frontend: kubectl logs -n $NAMESPACE deployment/$RELEASE_NAME-frontend"
    echo ""
}

# Function to cleanup
cleanup() {
    print_status "Cleaning up..."
    
    # Delete Helm release
    helm uninstall "$RELEASE_NAME" -n "$NAMESPACE" 2>/dev/null || true
    
    # Delete namespace
    kubectl delete namespace "$NAMESPACE" 2>/dev/null || true
    
    # Delete k3d cluster
    k3d cluster delete "$CLUSTER_NAME" 2>/dev/null || true
    
    print_success "Cleanup completed!"
}

# Function to show help
show_help() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  docker-compose    Test with Docker Compose"
    echo "  kubernetes        Test with k3d and Kubernetes"
    echo "  full              Run both Docker Compose and Kubernetes tests"
    echo "  cleanup           Clean up all resources"
    echo "  help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 docker-compose"
    echo "  $0 kubernetes"
    echo "  $0 full"
    echo "  $0 cleanup"
}

# Main script logic
case "${1:-help}" in
    "docker-compose")
        check_prerequisites
        test_docker_compose
        ;;
    "kubernetes")
        check_prerequisites
        setup_k3d_cluster
        install_ingress_controller
        build_and_load_images
        deploy_to_kubernetes
        test_kubernetes_deployment
        ;;
    "full")
        check_prerequisites
        print_status "Running full test suite..."
        test_docker_compose
        echo ""
        print_status "Docker Compose test completed. Starting Kubernetes test..."
        echo ""
        setup_k3d_cluster
        install_ingress_controller
        build_and_load_images
        deploy_to_kubernetes
        test_kubernetes_deployment
        ;;
    "cleanup")
        cleanup
        ;;
    "help"|*)
        show_help
        ;;
esac
