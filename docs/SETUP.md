# Execute Academy - CI/CD Setup Guide

This guide provides step-by-step instructions for setting up a complete CI/CD pipeline for the Execute Academy application using Docker, Kubernetes, Helm, and Jenkins.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Server Setup](#server-setup)
4. [Jenkins Configuration](#jenkins-configuration)
5. [GitHub Webhook Setup](#github-webhook-setup)
6. [Deployment Process](#deployment-process)
7. [Rollback Strategy](#rollback-strategy)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### Local Development Tools

Install the following tools on your local machine:

```bash
# Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# k3d (for local Kubernetes testing)
curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash
```

### Server Requirements

- Ubuntu 20.04+ or CentOS 8+
- Minimum 4GB RAM, 2 CPU cores
- 50GB+ disk space
- Public IP address
- Domain name (optional but recommended)

## Local Development Setup

### 1. Test with Docker Compose

```bash
# Clone the repository
git clone <your-repo-url>
cd execute-academy

# Test with Docker Compose
./scripts/local-test.sh docker-compose
```

### 2. Test with k3d (Local Kubernetes)

```bash
# Run full local test suite
./scripts/local-test.sh full

# Or test only Kubernetes
./scripts/local-test.sh kubernetes
```

### 3. Manual Testing Commands

```bash
# Build and run with Docker Compose
docker-compose up --build -d

# Check service health
curl http://localhost:9098/api/health
curl http://localhost:8080/

# View logs
docker-compose logs -f api
docker-compose logs -f web

# Stop services
docker-compose down --volumes
```

## Server Setup

### 1. Initial Server Configuration

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git vim htop ufw

# Configure firewall
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8080/tcp
sudo ufw enable
```

### 2. Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Verify installation
docker --version
```

### 3. Install k3s (Lightweight Kubernetes)

```bash
# Install k3s
curl -sfL https://get.k3s.io | sh -

# Get kubeconfig
sudo cat /etc/rancher/k3s/k3s.yaml

# Copy kubeconfig to user directory
mkdir -p ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $USER:$USER ~/.kube/config

# Verify installation
kubectl get nodes
```

### 4. Install Helm

```bash
# Install Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Verify installation
helm version
```

### 5. Install NGINX Ingress Controller

```bash
# Install NGINX Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/baremetal/deploy.yaml

# Wait for installation
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=300s
```

### 6. Install Jenkins

```bash
# Add Jenkins repository
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee \
  /usr/share/keyrings/jenkins-keyring.asc > /dev/null

echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null

# Install Jenkins
sudo apt update
sudo apt install -y jenkins

# Start and enable Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Get initial admin password
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

## Jenkins Configuration

### 1. Initial Jenkins Setup

1. Access Jenkins at `http://your-server-ip:8080`
2. Install suggested plugins
3. Create admin user
4. Configure Jenkins URL

### 2. Install Required Jenkins Plugins

Go to **Manage Jenkins > Manage Plugins > Available** and install:

- Docker Pipeline
- Kubernetes CLI
- Helm
- Git Integration
- Pipeline
- Credentials Binding
- SSH Agent

### 3. Configure Jenkins Credentials

Go to **Manage Jenkins > Manage Credentials > System > Global credentials** and add:

#### Docker Hub Credentials

- Kind: Username with password
- ID: `dockerhub-credentials`
- Username: Your Docker Hub username
- Password: Your Docker Hub password/token

#### Kubernetes Configuration

- Kind: Secret file
- ID: `kubeconfig`
- File: Upload your kubeconfig file

### 4. Create Jenkins Pipeline

1. Go to **New Item**
2. Select **Pipeline**
3. Name: `execute-academy-pipeline`
4. Configure pipeline:
   - Definition: Pipeline script from SCM
   - SCM: Git
   - Repository URL: Your GitHub repository URL
   - Credentials: Add your GitHub credentials
   - Branch: `main`
   - Script Path: `Jenkinsfile`

## GitHub Webhook Setup

### 1. Configure GitHub Webhook

1. Go to your GitHub repository
2. Settings > Webhooks > Add webhook
3. Configure:
   - Payload URL: `http://your-server-ip:8080/github-webhook/`
   - Content type: `application/json`
   - Events: Just the push event
   - Active: ✓

### 2. Configure Jenkins for Webhooks

1. Go to **Manage Jenkins > Configure System**
2. Find **GitHub** section
3. Add GitHub Server:
   - Name: `GitHub`
   - API URL: `https://api.github.com`
   - Credentials: Add your GitHub personal access token

## Deployment Process

### 1. Manual Deployment

```bash
# Build and push images
docker build -t your-username/execute-academy-backend:latest ./api-server
docker build -t your-username/execute-academy-frontend:latest ./web
docker push your-username/execute-academy-backend:latest
docker push your-username/execute-academy-frontend:latest

# Deploy to Kubernetes
helm upgrade --install execute-academy ./helm-charts/execute-academy \
  --namespace prod \
  --create-namespace \
  --set images.backend.repository=your-username/execute-academy-backend \
  --set images.frontend.repository=your-username/execute-academy-frontend \
  --wait
```

### 2. Automated Deployment

The Jenkins pipeline will automatically:

1. Build Docker images
2. Run tests
3. Push images to Docker Hub
4. Deploy to Kubernetes using Helm
5. Perform health checks

### 3. Verify Deployment

```bash
# Check pods
kubectl get pods -n prod

# Check services
kubectl get services -n prod

# Check ingress
kubectl get ingress -n prod

# Test endpoints
curl http://your-server-ip/api/health
curl http://your-server-ip/
```

## Rollback Strategy

### 1. Helm Rollback

```bash
# List releases
helm list -n prod

# Rollback to previous version
helm rollback execute-academy -n prod

# Rollback to specific revision
helm rollback execute-academy 2 -n prod
```

### 2. Jenkins Rollback

The Jenkins pipeline includes automatic rollback on failure:

```groovy
post {
    failure {
        sh """
            echo "Attempting rollback..."
            helm rollback ${RELEASE_NAME} -n ${NAMESPACE} || echo "Rollback failed"
        """
    }
}
```

### 3. Manual Rollback Steps

1. **Identify the issue**:

   ```bash
   kubectl get pods -n prod
   kubectl logs -n prod deployment/execute-academy-backend
   ```

2. **Rollback to previous version**:

   ```bash
   helm rollback execute-academy -n prod
   ```

3. **Verify rollback**:
   ```bash
   kubectl get pods -n prod
   curl http://your-server-ip/api/health
   ```

## Troubleshooting

### Common Issues

#### 1. Pods Not Starting

```bash
# Check pod status
kubectl get pods -n prod

# Check pod events
kubectl describe pod <pod-name> -n prod

# Check pod logs
kubectl logs <pod-name> -n prod
```

#### 2. Images Not Pulling

```bash
# Check image pull secrets
kubectl get secrets -n prod

# Create image pull secret if needed
kubectl create secret docker-registry dockerhub-secret \
  --docker-server=https://index.docker.io/v1/ \
  --docker-username=<your-username> \
  --docker-password=<your-password> \
  --docker-email=<your-email> \
  -n prod
```

#### 3. Ingress Not Working

```bash
# Check ingress controller
kubectl get pods -n ingress-nginx

# Check ingress status
kubectl describe ingress execute-academy -n prod

# Check ingress controller logs
kubectl logs -n ingress-nginx deployment/ingress-nginx-controller
```

#### 4. Database Connection Issues

```bash
# Check database pod
kubectl get pods -n prod -l app.kubernetes.io/component=postgres

# Check database logs
kubectl logs -n prod deployment/execute-academy-postgres

# Test database connection
kubectl exec -n prod deployment/execute-academy-backend -- pg_isready -h postgres -p 5432
```

### Useful Commands

```bash
# Get all resources in namespace
kubectl get all -n prod

# Port forward for debugging
kubectl port-forward -n prod service/execute-academy-backend 9098:8080

# Execute command in pod
kubectl exec -it -n prod deployment/execute-academy-backend -- /bin/sh

# View real-time logs
kubectl logs -f -n prod deployment/execute-academy-backend

# Check resource usage
kubectl top pods -n prod
```

### Performance Monitoring

```bash
# Install metrics server
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Check resource usage
kubectl top nodes
kubectl top pods -n prod
```

## Security Considerations

1. **Use secrets for sensitive data**:

   ```bash
   kubectl create secret generic app-secrets \
     --from-literal=db-password=secure-password \
     --from-literal=api-key=your-api-key \
     -n prod
   ```

2. **Enable RBAC**:

   ```bash
   # Create service account with minimal permissions
   kubectl create serviceaccount execute-academy -n prod
   ```

3. **Network policies**:
   ```yaml
   apiVersion: networking.k8s.io/v1
   kind: NetworkPolicy
   metadata:
     name: execute-academy-network-policy
     namespace: prod
   spec:
     podSelector: {}
     policyTypes:
       - Ingress
       - Egress
     ingress:
       - from:
           - namespaceSelector:
               matchLabels:
                 name: ingress-nginx
         ports:
           - protocol: TCP
             port: 8080
   ```

## Next Steps

1. Set up monitoring with Prometheus and Grafana
2. Configure SSL/TLS certificates with Let's Encrypt
3. Set up backup strategies for databases
4. Implement blue-green deployments
5. Add automated testing in the pipeline
6. Set up alerting and notifications

For additional support, refer to the Kubernetes and Helm documentation or create an issue in the project repository.
