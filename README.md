# Execute Academy - CI/CD Pipeline

A complete CI/CD pipeline for the Execute Academy application using Docker, Kubernetes, Helm, and Jenkins.

## 🚀 Quick Start

### Local Testing

```bash
# Test with Docker Compose
./scripts/local-test.sh docker-compose

# Test with k3d (Kubernetes)
./scripts/local-test.sh kubernetes

# Run full test suite
./scripts/local-test.sh full
```

### Production Deployment

```bash
# Deploy to production
helm upgrade --install execute-academy ./helm-charts/execute-academy \
  --namespace prod \
  --create-namespace \
  --set images.backend.repository=your-username/execute-academy-backend \
  --set images.frontend.repository=your-username/execute-academy-frontend
```

## 📁 Project Structure

```
execute-academy/
├── api-server/                 # Backend API (Rust)
├── web/                       # Frontend (Next.js)
├── nginex/                    # Nginx configuration
├── helm-charts/               # Helm charts
│   └── execute-academy/
│       ├── Chart.yaml
│       ├── values.yaml
│       ├── values-local.yaml
│       └── templates/
│           ├── backend-deployment.yaml
│           ├── frontend-deployment.yaml
│           ├── ingress.yaml
│           └── ...
├── scripts/
│   └── local-test.sh          # Local testing script
├── docs/
│   ├── SETUP.md              # Complete setup guide
│   └── QUICK_REFERENCE.md    # Quick reference commands
├── Jenkinsfile               # CI/CD pipeline
├── docker-compose.yml        # Local development
└── README.md
```

## 🏗️ Architecture

### Components

- **Backend API**: Rust application running on port 9098
- **Frontend**: Next.js application running on port 3000
- **Database**: PostgreSQL with persistent storage
- **Cache**: Redis with persistent storage
- **Ingress**: NGINX Ingress Controller for routing
- **CI/CD**: Jenkins pipeline with automated deployment

### Routing

- `/` → Frontend (Next.js)
- `/api/*` → Backend API (Rust)

## 🛠️ Technology Stack

- **Containerization**: Docker & Docker Compose
- **Orchestration**: Kubernetes (k3s for production, k3d for local)
- **Package Manager**: Helm
- **CI/CD**: Jenkins
- **Registry**: Docker Hub
- **Ingress**: NGINX Ingress Controller
- **Database**: PostgreSQL
- **Cache**: Redis

## 📋 Prerequisites

### Local Development

- Docker & Docker Compose
- kubectl
- Helm
- k3d

### Production Server

- Ubuntu 20.04+ or CentOS 8+
- 4GB+ RAM, 2+ CPU cores
- 50GB+ disk space
- Public IP address

## 🚀 Getting Started

### 1. Local Development

```bash
# Clone repository
git clone <your-repo-url>
cd execute-academy

# Test with Docker Compose
./scripts/local-test.sh docker-compose

# Test with Kubernetes (k3d)
./scripts/local-test.sh kubernetes
```

### 2. Server Setup

Follow the complete setup guide in [docs/SETUP.md](docs/SETUP.md) for:

- Server preparation
- Docker installation
- k3s (Kubernetes) setup
- Jenkins configuration
- GitHub webhook setup

### 3. Production Deployment

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

## 🔧 Configuration

### Helm Values

The application can be configured using Helm values:

```yaml
# values-production.yaml
global:
  environment: production

images:
  backend:
    repository: your-username/execute-academy-backend
    tag: "v1.0.0"
  frontend:
    repository: your-username/execute-academy-frontend
    tag: "v1.0.0"

backend:
  replicaCount: 3
  resources:
    limits:
      cpu: 1000m
      memory: 1Gi

frontend:
  replicaCount: 2
  resources:
    limits:
      cpu: 500m
      memory: 512Mi
```

### Environment Variables

Key environment variables for the backend:

```bash
API_HOST=0.0.0.0
API_PORT=9098
DATABASE_URL=postgres://execute_academy:password@postgres:5432/execute_academy?sslmode=disable
REDIS_URL=redis://redis:6379/0
```

## 🔄 CI/CD Pipeline

The Jenkins pipeline includes:

1. **Build Stage**: Build Docker images for backend and frontend
2. **Test Stage**: Run unit tests
3. **Push Stage**: Push images to Docker Hub
4. **Deploy Stage**: Deploy to Kubernetes using Helm
5. **Health Check Stage**: Verify deployment health
6. **Rollback Stage**: Automatic rollback on failure

### Pipeline Features

- ✅ Automated builds on Git push
- ✅ Docker image versioning
- ✅ Kubernetes deployment with Helm
- ✅ Health checks and monitoring
- ✅ Automatic rollback on failure
- ✅ Slack notifications (optional)

## 📊 Monitoring

### Health Checks

```bash
# Backend health
curl http://your-server/api/health

# Frontend health
curl http://your-server/

# Database health
kubectl exec -n prod deployment/execute-academy-postgres -- pg_isready

# Redis health
kubectl exec -n prod deployment/execute-academy-redis -- redis-cli ping
```

### Logs

```bash
# View backend logs
kubectl logs -f -n prod deployment/execute-academy-backend

# View frontend logs
kubectl logs -f -n prod deployment/execute-academy-frontend

# View all application logs
kubectl logs -f -l app.kubernetes.io/name=execute-academy -n prod
```

## 🔒 Security

### Best Practices

- ✅ Non-root containers
- ✅ Read-only root filesystems
- ✅ Resource limits
- ✅ Network policies
- ✅ RBAC enabled
- ✅ Secrets management

### Security Commands

```bash
# Create secrets
kubectl create secret generic app-secrets \
  --from-literal=db-password=secure-password \
  --from-literal=api-key=your-api-key \
  -n prod

# Apply network policies
kubectl apply -f network-policy.yaml
```

## 🔄 Rollback Strategy

### Automatic Rollback

The Jenkins pipeline includes automatic rollback on deployment failure.

### Manual Rollback

```bash
# Rollback to previous version
helm rollback execute-academy -n prod

# Rollback to specific revision
helm rollback execute-academy 2 -n prod

# Check rollback history
helm history execute-academy -n prod
```

## 🐛 Troubleshooting

### Common Issues

1. **Pods not starting**: Check resource limits and image pull secrets
2. **Ingress not working**: Verify NGINX Ingress Controller installation
3. **Database connection issues**: Check PostgreSQL pod status and credentials
4. **Image pull errors**: Verify Docker Hub credentials and image tags

### Debug Commands

```bash
# Check pod status
kubectl get pods -n prod

# Describe pod for details
kubectl describe pod <pod-name> -n prod

# Check events
kubectl get events -n prod --sort-by='.lastTimestamp'

# Port forward for debugging
kubectl port-forward -n prod service/execute-academy-backend 9098:8080
```

For detailed troubleshooting, see [docs/QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md).

## 📚 Documentation

- **[Complete Setup Guide](docs/SETUP.md)**: Step-by-step server and CI/CD setup
- **[Quick Reference](docs/QUICK_REFERENCE.md)**: Common commands and configurations
- **[Helm Chart Documentation](helm-charts/execute-academy/README.md)**: Helm chart details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally using the provided scripts
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

1. Check the [documentation](docs/)
2. Review [troubleshooting guide](docs/QUICK_REFERENCE.md)
3. Create an issue in the repository
4. Contact the development team

---

**Happy Deploying! 🚀**
