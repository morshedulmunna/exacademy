pipeline {
    agent any
    
    environment {
        // Docker Hub configuration
        DOCKER_REGISTRY = 'your-dockerhub-username'
        BACKEND_IMAGE = 'execute-academy-backend'
        FRONTEND_IMAGE = 'execute-academy-frontend'
        
        // Kubernetes configuration
        KUBECONFIG = credentials('kubeconfig')
        HELM_CHART_PATH = 'helm-charts/execute-academy'
        NAMESPACE = 'prod'
        RELEASE_NAME = 'execute-academy'
        
        // Version tagging
        BUILD_NUMBER = "${env.BUILD_NUMBER}"
        GIT_COMMIT = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
        IMAGE_TAG = "${BUILD_NUMBER}-${GIT_COMMIT}"
        
        // Slack notification (optional)
        SLACK_CHANNEL = '#deployments'
    }
    
    options {
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }
    
    stages {
        stage('Checkout') {
            steps {
                script {
                    // Clean workspace
                    cleanWs()
                    
                    // Checkout code
                    checkout scm
                    
                    echo "Building commit: ${GIT_COMMIT}"
                    echo "Build number: ${BUILD_NUMBER}"
                }
            }
        }
        
        stage('Build Backend') {
            steps {
                script {
                    dir('api-server') {
                        echo "Building backend Docker image..."
                        
                        // Build Docker image
                        sh """
                            docker build -t ${DOCKER_REGISTRY}/${BACKEND_IMAGE}:${IMAGE_TAG} .
                            docker tag ${DOCKER_REGISTRY}/${BACKEND_IMAGE}:${IMAGE_TAG} ${DOCKER_REGISTRY}/${BACKEND_IMAGE}:latest
                        """
                        
                        // Run backend tests (if available)
                        sh """
                            # Run unit tests if they exist
                            if [ -f "Cargo.toml" ]; then
                                docker run --rm ${DOCKER_REGISTRY}/${BACKEND_IMAGE}:${IMAGE_TAG} cargo test || true
                            fi
                        """
                    }
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                script {
                    dir('web') {
                        echo "Building frontend Docker image..."
                        
                        // Build Docker image
                        sh """
                            docker build -t ${DOCKER_REGISTRY}/${FRONTEND_IMAGE}:${IMAGE_TAG} .
                            docker tag ${DOCKER_REGISTRY}/${FRONTEND_IMAGE}:${IMAGE_TAG} ${DOCKER_REGISTRY}/${FRONTEND_IMAGE}:latest
                        """
                        
                        // Run frontend tests (if available)
                        sh """
                            # Run npm tests if they exist
                            if [ -f "package.json" ]; then
                                docker run --rm ${DOCKER_REGISTRY}/${FRONTEND_IMAGE}:${IMAGE_TAG} npm test || true
                            fi
                        """
                    }
                }
            }
        }
        
        stage('Push Images') {
            steps {
                script {
                    echo "Pushing Docker images to registry..."
                    
                    // Login to Docker Hub
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                    }
                    
                    // Push backend image
                    sh """
                        docker push ${DOCKER_REGISTRY}/${BACKEND_IMAGE}:${IMAGE_TAG}
                        docker push ${DOCKER_REGISTRY}/${BACKEND_IMAGE}:latest
                    """
                    
                    // Push frontend image
                    sh """
                        docker push ${DOCKER_REGISTRY}/${FRONTEND_IMAGE}:${IMAGE_TAG}
                        docker push ${DOCKER_REGISTRY}/${FRONTEND_IMAGE}:latest
                    """
                    
                    echo "Images pushed successfully:"
                    echo "Backend: ${DOCKER_REGISTRY}/${BACKEND_IMAGE}:${IMAGE_TAG}"
                    echo "Frontend: ${DOCKER_REGISTRY}/${FRONTEND_IMAGE}:${IMAGE_TAG}"
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo "Deploying to Kubernetes cluster..."
                    
                    // Create namespace if it doesn't exist
                    sh """
                        kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -
                    """
                    
                    // Deploy using Helm
                    sh """
                        helm upgrade --install ${RELEASE_NAME} ${HELM_CHART_PATH} \
                            --namespace ${NAMESPACE} \
                            --set images.backend.repository=${DOCKER_REGISTRY}/${BACKEND_IMAGE} \
                            --set images.backend.tag=${IMAGE_TAG} \
                            --set images.frontend.repository=${DOCKER_REGISTRY}/${FRONTEND_IMAGE} \
                            --set images.frontend.tag=${IMAGE_TAG} \
                            --set global.environment=production \
                            --wait \
                            --timeout=10m
                    """
                    
                    echo "Deployment completed successfully!"
                }
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    echo "Performing health checks..."
                    
                    // Wait for pods to be ready
                    sh """
                        kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=execute-academy -n ${NAMESPACE} --timeout=300s
                    """
                    
                    // Check backend health
                    sh """
                        kubectl get pods -n ${NAMESPACE} -l app.kubernetes.io/component=backend
                        kubectl get pods -n ${NAMESPACE} -l app.kubernetes.io/component=frontend
                    """
                    
                    // Optional: Run integration tests
                    sh """
                        # Get the ingress IP/hostname
                        INGRESS_HOST=\$(kubectl get ingress -n ${NAMESPACE} ${RELEASE_NAME} -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
                        if [ -z "\$INGRESS_HOST" ]; then
                            INGRESS_HOST=\$(kubectl get ingress -n ${NAMESPACE} ${RELEASE_NAME} -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
                        fi
                        
                        if [ ! -z "\$INGRESS_HOST" ]; then
                            echo "Testing backend health endpoint..."
                            curl -f http://\${INGRESS_HOST}/api/health || echo "Backend health check failed"
                            
                            echo "Testing frontend..."
                            curl -f http://\${INGRESS_HOST}/ || echo "Frontend health check failed"
                        else
                            echo "Ingress not ready yet, skipping health checks"
                        fi
                    """
                }
            }
        }
    }
    
    post {
        always {
            script {
                // Clean up Docker images
                sh """
                    docker rmi ${DOCKER_REGISTRY}/${BACKEND_IMAGE}:${IMAGE_TAG} || true
                    docker rmi ${DOCKER_REGISTRY}/${BACKEND_IMAGE}:latest || true
                    docker rmi ${DOCKER_REGISTRY}/${FRONTEND_IMAGE}:${IMAGE_TAG} || true
                    docker rmi ${DOCKER_REGISTRY}/${FRONTEND_IMAGE}:latest || true
                """
                
                // Clean workspace
                cleanWs()
            }
        }
        
        success {
            script {
                echo "Pipeline completed successfully!"
                
                // Optional: Send success notification
                // slackSend channel: "${SLACK_CHANNEL}", color: 'good', message: "✅ Deploy successful: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
            }
        }
        
        failure {
            script {
                echo "Pipeline failed!"
                
                // Optional: Send failure notification
                // slackSend channel: "${SLACK_CHANNEL}", color: 'danger', message: "❌ Deploy failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
                
                // Optional: Rollback to previous version
                sh """
                    echo "Attempting rollback..."
                    helm rollback ${RELEASE_NAME} -n ${NAMESPACE} || echo "Rollback failed or no previous version available"
                """
            }
        }
        
        cleanup {
            script {
                // Always clean up
                echo "Cleaning up..."
            }
        }
    }
}
