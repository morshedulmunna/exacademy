# Quick Reference Guide

This guide provides quick access to common commands and configurations for the Execute Academy CI/CD pipeline.

## Local Development

### Docker Compose Commands

```bash
# Start all services
docker-compose up -d

# Start with rebuild
docker-compose up --build -d

# View logs
docker-compose logs -f api
docker-compose logs -f web

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down --volumes

# Check service status
docker-compose ps

# Execute command in container
docker-compose exec api sh
docker-compose exec web sh
```

### k3d Commands

```bash
# Create cluster
k3d cluster create execute-academy-local \
  --servers 1 \
  --agents 2 \
  --port "8080:30000@loadbalancer" \
  --port "9098:30001@loadbalancer"

# List clusters
k3d cluster list

# Delete cluster
k3d cluster delete execute-academy-local

# Load image into cluster
k3d image import my-image:tag -c execute-academy-local
```

### Helm Commands

```bash
# Install chart
helm install execute-academy ./helm-charts/execute-academy \
  --namespace prod \
  --create-namespace

# Upgrade chart
helm upgrade execute-academy ./helm-charts/execute-academy \
  --namespace prod

# List releases
helm list -n prod

# Rollback
helm rollback execute-academy -n prod

# Uninstall
helm uninstall execute-academy -n prod

# Get values
helm get values execute-academy -n prod

# Template (dry run)
helm template execute-academy ./helm-charts/execute-academy \
  --namespace prod
```

## Kubernetes Commands

### Pod Management

```bash
# Get pods
kubectl get pods -n prod

# Get pods with labels
kubectl get pods -n prod -l app.kubernetes.io/name=execute-academy

# Describe pod
kubectl describe pod <pod-name> -n prod

# View logs
kubectl logs <pod-name> -n prod
kubectl logs -f <pod-name> -n prod

# Execute command in pod
kubectl exec -it <pod-name> -n prod -- sh

# Port forward
kubectl port-forward -n prod service/execute-academy-backend 9098:8080
```

### Service Management

```bash
# Get services
kubectl get services -n prod

# Describe service
kubectl describe service <service-name> -n prod

# Get endpoints
kubectl get endpoints -n prod
```

### Ingress Management

```bash
# Get ingress
kubectl get ingress -n prod

# Describe ingress
kubectl describe ingress execute-academy -n prod

# Check ingress controller
kubectl get pods -n ingress-nginx
```

### Resource Management

```bash
# Get all resources
kubectl get all -n prod

# Get resource usage
kubectl top pods -n prod
kubectl top nodes

# Get events
kubectl get events -n prod --sort-by='.lastTimestamp'
```

## Docker Commands

### Image Management

```bash
# Build images
docker build -t execute-academy-backend:latest ./api-server
docker build -t execute-academy-frontend:latest ./web

# Tag images
docker tag execute-academy-backend:latest your-username/execute-academy-backend:latest

# Push images
docker push your-username/execute-academy-backend:latest
docker push your-username/execute-academy-frontend:latest

# List images
docker images

# Remove images
docker rmi execute-academy-backend:latest
```

### Container Management

```bash
# Run container
docker run -d -p 8080:8080 execute-academy-backend:latest

# List containers
docker ps
docker ps -a

# Stop container
docker stop <container-id>

# Remove container
docker rm <container-id>

# View logs
docker logs <container-id>
docker logs -f <container-id>
```

## Jenkins Commands

### Pipeline Management

```bash
# Trigger build via CLI
curl -X POST http://jenkins:8080/job/execute-academy-pipeline/build

# Get build status
curl http://jenkins:8080/job/execute-academy-pipeline/lastBuild/api/json

# Stop build
curl -X POST http://jenkins:8080/job/execute-academy-pipeline/lastBuild/stop
```

## Configuration Files

### Helm Values Override

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

ingress:
  hosts:
    - host: your-domain.com
      paths:
        - path: /
          pathType: Prefix
          serviceName: frontend
          servicePort: 3000
        - path: /api
          pathType: Prefix
          serviceName: backend
          servicePort: 8080
```

### Kubernetes Secrets

```bash
# Create secret for database
kubectl create secret generic db-secret \
  --from-literal=username=execute_academy \
  --from-literal=password=secure-password \
  -n prod

# Create secret for Docker registry
kubectl create secret docker-registry dockerhub-secret \
  --docker-server=https://index.docker.io/v1/ \
  --docker-username=your-username \
  --docker-password=your-password \
  --docker-email=your-email \
  -n prod
```

### ConfigMap

```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: prod
data:
  API_HOST: "0.0.0.0"
  API_PORT: "9098"
  NODE_ENV: "production"
```

## Monitoring and Debugging

### Health Checks

```bash
# Check backend health
curl http://localhost:9098/api/health

# Check frontend
curl http://localhost:8080/

# Check database
kubectl exec -n prod deployment/execute-academy-postgres -- pg_isready

# Check Redis
kubectl exec -n prod deployment/execute-academy-redis -- redis-cli ping
```

### Log Analysis

```bash
# Follow logs for all pods
kubectl logs -f -l app.kubernetes.io/name=execute-academy -n prod

# Get logs from specific time
kubectl logs --since=1h <pod-name> -n prod

# Get logs with timestamps
kubectl logs --timestamps <pod-name> -n prod
```

### Resource Monitoring

```bash
# Install metrics server
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Check resource usage
kubectl top pods -n prod
kubectl top nodes

# Get resource requests/limits
kubectl describe pods -n prod | grep -A 5 "Limits:"
```

## Troubleshooting Commands

### Common Issues

```bash
# Pod stuck in pending
kubectl describe pod <pod-name> -n prod

# Image pull errors
kubectl get events -n prod | grep -i "pull"

# Service not accessible
kubectl get endpoints -n prod
kubectl describe service <service-name> -n prod

# Ingress not working
kubectl get ingress -n prod
kubectl describe ingress execute-academy -n prod
```

### Debugging Commands

```bash
# Check cluster info
kubectl cluster-info

# Check node status
kubectl get nodes
kubectl describe node <node-name>

# Check namespace
kubectl get namespace prod

# Check RBAC
kubectl get serviceaccount -n prod
kubectl get rolebinding -n prod
```

## Performance Tuning

### Resource Optimization

```yaml
# Optimized resource requests
resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 500m
    memory: 512Mi
```

### Scaling Commands

```bash
# Scale deployments
kubectl scale deployment execute-academy-backend --replicas=3 -n prod
kubectl scale deployment execute-academy-frontend --replicas=2 -n prod

# Auto-scaling
kubectl autoscale deployment execute-academy-backend \
  --cpu-percent=70 \
  --min=2 \
  --max=10 \
  -n prod
```

## Security Commands

### Network Policies

```bash
# Apply network policy
kubectl apply -f network-policy.yaml

# Check network policies
kubectl get networkpolicy -n prod
```

### RBAC

```bash
# Create service account
kubectl create serviceaccount execute-academy -n prod

# Create role
kubectl create role execute-academy-role \
  --verb=get,list,watch \
  --resource=pods,services \
  -n prod

# Bind role
kubectl create rolebinding execute-academy-binding \
  --role=execute-academy-role \
  --serviceaccount=prod:execute-academy \
  -n prod
```

## Backup and Restore

### Database Backup

```bash
# Backup PostgreSQL
kubectl exec -n prod deployment/execute-academy-postgres -- \
  pg_dump -U execute_academy execute_academy > backup.sql

# Restore PostgreSQL
kubectl exec -i -n prod deployment/execute-academy-postgres -- \
  psql -U execute_academy execute_academy < backup.sql
```

### Helm Backup

```bash
# Export values
helm get values execute-academy -n prod > values-backup.yaml

# Export release
helm get manifest execute-academy -n prod > manifest-backup.yaml
```

This quick reference guide covers the most commonly used commands and configurations. For more detailed information, refer to the main setup documentation.
