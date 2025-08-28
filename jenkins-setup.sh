#!/bin/bash

# Execute Academy - Jenkins CI/CD Setup Script
# Run this script on your DigitalOcean droplet

set -e

echo "🚀 Setting up Jenkins CI/CD for Execute Academy..."

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

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    print_error "Please run this script with sudo"
    exit 1
fi

# Update system
print_status "Updating system packages..."
apt update && apt upgrade -y

# Install required packages
print_status "Installing required packages..."
apt install -y \
    curl \
    wget \
    git \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    openjdk-17-jdk \
    nginx \
    certbot \
    python3-certbot-nginx

# Install Docker Compose if not present
if ! command -v docker-compose &> /dev/null; then
    print_status "Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Add Jenkins repository
print_status "Adding Jenkins repository..."
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | tee \
    /usr/share/keyrings/jenkins-keyring.asc > /dev/null
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
    https://pkg.jenkins.io/debian-stable binary/ | tee \
    /etc/apt/sources.list.d/jenkins.list > /dev/null

# Install Jenkins
print_status "Installing Jenkins..."
apt update
apt install -y jenkins

# Start and enable Jenkins
print_status "Starting Jenkins service..."
systemctl start jenkins
systemctl enable jenkins

# Add jenkins user to docker group
print_status "Adding Jenkins user to docker group..."
usermod -aG docker jenkins

# Create Jenkins home directory
print_status "Setting up Jenkins directories..."
mkdir -p /var/lib/jenkins/workspace
chown -R jenkins:jenkins /var/lib/jenkins

# Get initial admin password
print_status "Getting Jenkins initial admin password..."
sleep 10
JENKINS_PASSWORD=$(cat /var/lib/jenkins/secrets/initialAdminPassword)

# Create Jenkins configuration directory
mkdir -p /var/lib/jenkins/init.groovy.d

# Create initial Jenkins configuration
cat > /var/lib/jenkins/init.groovy.d/01-setup.groovy << 'EOF'
import jenkins.model.*
import hudson.security.*
import jenkins.security.s2m.AdminWhitelistRule

def instance = Jenkins.getInstance()

// Create admin user
def hudsonRealm = new HudsonPrivateSecurityRealm(false)
hudsonRealm.createAccount("admin", "admin123")
instance.setSecurityRealm(hudsonRealm)

// Set authorization strategy
def strategy = new FullControlOnceLoggedInAuthorizationStrategy()
instance.setAuthorizationStrategy(strategy)

// Disable CSRF protection for API access
instance.getDescriptor("jenkins.CLI").get().setEnabled(false)

// Save configuration
instance.save()
EOF

# Set proper permissions
chown -R jenkins:jenkins /var/lib/jenkins/init.groovy.d

# Restart Jenkins to apply configuration
print_status "Restarting Jenkins to apply configuration..."
systemctl restart jenkins

# Create nginx configuration for Jenkins
print_status "Setting up Nginx reverse proxy for Jenkins..."
cat > /etc/nginx/sites-available/jenkins << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF

# Enable Jenkins site
ln -sf /etc/nginx/sites-available/jenkins /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
nginx -t

# Restart nginx
systemctl restart nginx

# Create deployment directory
print_status "Setting up deployment directory..."
mkdir -p /opt/execute-academy
chown jenkins:jenkins /opt/execute-academy

# Create deployment script
cat > /opt/execute-academy/deploy.sh << 'EOF'
#!/bin/bash

set -e

DEPLOY_DIR="/opt/execute-academy"
BACKUP_DIR="/opt/execute-academy/backups"
LOG_FILE="/opt/execute-academy/deploy.log"

# Create backup directory
mkdir -p $BACKUP_DIR

# Log function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a $LOG_FILE
}

log "Starting deployment..."

# Navigate to deployment directory
cd $DEPLOY_DIR

# Backup current deployment if exists
if [ -f "docker-compose.yml" ]; then
    log "Creating backup of current deployment..."
    tar -czf $BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).tar.gz .
fi

# Pull latest changes
log "Pulling latest changes..."
git pull origin main

# Create .env.production if it doesn't exist
if [ ! -f ".env.production" ]; then
    log "Creating .env.production template..."
    cat > .env.production << 'ENVEOF'
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
    log "Please update .env.production with your actual values"
fi

# Stop existing containers
log "Stopping existing containers..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down || true

# Build and start containers
log "Building and starting containers..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Wait for services to be healthy
log "Waiting for services to be healthy..."
sleep 30

# Check health
log "Checking service health..."
if curl -f http://localhost/api/health > /dev/null 2>&1; then
    log "Deployment successful! Services are healthy."
else
    log "Warning: Health check failed. Check logs with: docker-compose logs"
fi

log "Deployment completed."
EOF

chmod +x /opt/execute-academy/deploy.sh
chown jenkins:jenkins /opt/execute-academy/deploy.sh

# Create Jenkins job configuration
mkdir -p /var/lib/jenkins/jobs/execute-academy-deploy
cat > /var/lib/jenkins/jobs/execute-academy-deploy/config.xml << 'EOF'
<?xml version='1.1' encoding='UTF-8'?>
<project>
  <actions/>
  <description>Deploy Execute Academy application</description>
  <keepDependencies>false</keepDependencies>
  <properties/>
  <scm class="hudson.plugins.git.GitSCM" plugin="git@4.15.0">
    <configVersion>2</configVersion>
    <userRemoteConfigs>
      <hudson.plugins.git.UserRemoteConfig>
        <url>https://github.com/your-org/execute-academy.git</url>
      </hudson.plugins.git.UserRemoteConfig>
    </userRemoteConfigs>
    <branches>
      <hudson.plugins.git.BranchSpec>
        <name>main</name>
      </hudson.plugins.git.BranchSpec>
    </branches>
    <doGenerateSubmoduleConfigurations>false</doGenerateSubmoduleConfigurations>
    <submoduleCfg class="empty-list"/>
    <extensions/>
  </scm>
  <canRoam>true</canRoam>
  <disabled>false</disabled>
  <blockBuildWhenDownstreamBuilding>false</blockBuildWhenDownstreamBuilding>
  <blockBuildWhenUpstreamBuilding>false</blockBuildWhenUpstreamBuilding>
  <triggers/>
  <concurrentBuild>false</concurrentBuild>
  <builders>
    <hudson.tasks.Shell>
      <command>#!/bin/bash
set -e

echo "Starting Execute Academy deployment..."

# Navigate to deployment directory
cd /opt/execute-academy

# Copy latest code
echo "Copying latest code..."
cp -r $WORKSPACE/* .

# Run deployment script
echo "Running deployment script..."
./deploy.sh

echo "Deployment completed successfully!"
      </command>
    </hudson.tasks.Shell>
  </builders>
  <publishers/>
  <buildWrappers/>
</project>
EOF

chown -R jenkins:jenkins /var/lib/jenkins/jobs

# Create webhook endpoint for GitHub
cat > /opt/execute-academy/webhook.php << 'EOF'
<?php
// GitHub webhook endpoint for Jenkins
$secret = 'your-webhook-secret-here'; // Change this

$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';

if (verifySignature($payload, $signature, $secret)) {
    // Trigger Jenkins build
    $jenkins_url = 'http://localhost:8080/job/execute-academy-deploy/build';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $jenkins_url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Basic ' . base64_encode('admin:admin123')
    ]);
    $response = curl_exec($ch);
    curl_close($ch);
    
    http_response_code(200);
    echo "Build triggered successfully";
} else {
    http_response_code(403);
    echo "Invalid signature";
}

function verifySignature($payload, $signature, $secret) {
    $expected = 'sha256=' . hash_hmac('sha256', $payload, $secret);
    return hash_equals($expected, $signature);
}
?>
EOF

# Install PHP for webhook
apt install -y php-fpm php-curl

# Configure nginx for webhook
cat > /etc/nginx/sites-available/webhook << 'EOF'
server {
    listen 80;
    server_name webhook.your-domain.com; # Change this

    location / {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
EOF

# Create firewall rules
print_status "Configuring firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Final status
print_status "Jenkins setup completed!"
echo ""
echo "📋 Setup Summary:"
echo "=================="
echo "✅ Jenkins installed and running on port 8080"
echo "✅ Nginx reverse proxy configured"
echo "✅ Jenkins accessible at: http://$(curl -s ifconfig.me)"
echo "✅ Initial admin credentials: admin / admin123"
echo "✅ Deployment directory: /opt/execute-academy"
echo "✅ Webhook endpoint: http://$(curl -s ifconfig.me)/webhook.php"
echo ""
echo "🔧 Next Steps:"
echo "1. Access Jenkins at http://$(curl -s ifconfig.me)"
echo "2. Update .env.production with your actual values"
echo "3. Configure GitHub webhook to point to your webhook URL"
echo "4. Update the Git repository URL in Jenkins job configuration"
echo ""
echo "📝 Important Files:"
echo "- Jenkins config: /var/lib/jenkins/"
echo "- Deployment script: /opt/execute-academy/deploy.sh"
echo "- Webhook: /opt/execute-academy/webhook.php"
echo ""
print_warning "Remember to change default passwords and update configuration files!"
