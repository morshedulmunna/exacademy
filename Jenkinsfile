pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'your-registry.com' // Change this to your registry
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        DEPLOY_DIR = '/opt/execute-academy'
        BACKUP_DIR = '/opt/execute-academy/backups'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "Checked out code from ${env.GIT_BRANCH}"
            }
        }
        
        stage('Validate') {
            parallel {
                stage('Validate API') {
                    steps {
                        dir('api-server') {
                            script {
                                // Check if Rust code compiles
                                sh 'cargo check --verbose'
                                echo "✅ Rust API validation passed"
                            }
                        }
                    }
                }
                
                stage('Validate Web') {
                    steps {
                        dir('web') {
                            script {
                                // Check if Node.js dependencies are valid
                                sh 'npm ci --only=production'
                                sh 'npm run build'
                                echo "✅ Next.js web validation passed"
                            }
                        }
                    }
                }
            }
        }
        
        stage('Test') {
            parallel {
                stage('Test API') {
                    steps {
                        dir('api-server') {
                            script {
                                // Run Rust tests
                                sh 'cargo test --verbose'
                                echo "✅ API tests passed"
                            }
                        }
                    }
                }
                
                stage('Test Web') {
                    steps {
                        dir('web') {
                            script {
                                // Run Next.js tests
                                sh 'npm test -- --passWithNoTests'
                                echo "✅ Web tests passed"
                            }
                        }
                    }
                }
            }
        }
        
        stage('Build Docker Images') {
            steps {
                script {
                    // Build API image
                    dir('api-server') {
                        sh "docker build -t execute-academy-api:${IMAGE_TAG} ."
                        sh "docker tag execute-academy-api:${IMAGE_TAG} execute-academy-api:latest"
                    }
                    
                    // Build Web image
                    dir('web') {
                        sh "docker build -t execute-academy-web:${IMAGE_TAG} ."
                        sh "docker tag execute-academy-web:${IMAGE_TAG} execute-academy-web:latest"
                    }
                    
                    // Build Nginx image
                    dir('nginex') {
                        sh "docker build -t execute-academy-nginx:${IMAGE_TAG} ."
                        sh "docker tag execute-academy-nginx:${IMAGE_TAG} execute-academy-nginx:latest"
                    }
                    
                    echo "✅ All Docker images built successfully"
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                script {
                    // Run security scans on Docker images
                    sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image execute-academy-api:${IMAGE_TAG}"
                    sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image execute-academy-web:${IMAGE_TAG}"
                    echo "✅ Security scans completed"
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                script {
                    // Deploy to staging environment
                    sh "echo 'Deploying to staging...'"
                    // Add staging deployment logic here
                }
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // Create backup
                    sh "mkdir -p ${BACKUP_DIR}"
                    sh "if [ -f ${DEPLOY_DIR}/docker-compose.yml ]; then tar -czf ${BACKUP_DIR}/backup-$(date +%Y%m%d-%H%M%S).tar.gz -C ${DEPLOY_DIR} .; fi"
                    
                    // Copy new code to deployment directory
                    sh "cp -r . ${DEPLOY_DIR}/"
                    
                    // Deploy using docker-compose
                    dir(DEPLOY_DIR) {
                        sh "docker-compose -f docker-compose.yml -f docker-compose.prod.yml down || true"
                        sh "docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build"
                        
                        // Wait for services to be healthy
                        sh "sleep 30"
                        
                        // Health check
                        sh "curl -f http://localhost/api/health || exit 1"
                    }
                    
                    echo "✅ Production deployment completed successfully"
                }
            }
        }
        
        stage('Post-Deployment') {
            steps {
                script {
                    // Clean up old images
                    sh "docker image prune -f"
                    
                    // Send notification
                    echo "🎉 Deployment completed successfully!"
                    
                    // Log deployment
                    sh "echo '$(date): Deployment ${env.BUILD_NUMBER} completed successfully' >> ${DEPLOY_DIR}/deploy.log"
                }
            }
        }
    }
    
    post {
        always {
            // Clean workspace
            cleanWs()
        }
        
        success {
            echo "✅ Pipeline completed successfully!"
        }
        
        failure {
            echo "❌ Pipeline failed!"
            
            // Send failure notification
            script {
                // Add notification logic here (email, Slack, etc.)
                echo "Deployment failed at stage: ${currentBuild.description}"
            }
        }
        
        cleanup {
            // Cleanup Docker images
            sh "docker image prune -f || true"
        }
    }
}
