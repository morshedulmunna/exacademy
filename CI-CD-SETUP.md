# Execute Academy - CI/CD Setup Guide

This guide provides comprehensive instructions for setting up Continuous Integration and Continuous Deployment (CI/CD) for the Execute Academy project using Jenkins on your DigitalOcean droplet.

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

1. **Upload the setup script to your server:**
   ```bash
   scp jenkins-setup.sh tutorsplan@167.71.82.117:~/
   ```

2. **Run the setup script on your server:**
   ```bash
   ssh tutorsplan@167.71.82.117
   chmod +x jenkins-setup.sh
   sudo ./jenkins-setup.sh
   ```

3. **Access Jenkins:**
   - Open your browser and go to: `http://167.71.82.117`
   - Login with: `admin` / `admin123`

### Option 2: Manual Setup

Follow the detailed steps below if you prefer manual installation.

## 📋 Prerequisites

- DigitalOcean droplet with Ubuntu 22.04+
- SSH access to the server
- Domain name (optional but recommended)
- Git repository with your code

## 🔧 Manual Installation Steps

### 1. Connect to Your Server

```bash
ssh tutorsplan@167.71.82.117
```

### 2. Update System and Install Dependencies

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y \
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
```

### 3. Install Docker Compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 4. Install Jenkins

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

# Add jenkins user to docker group
sudo usermod -aG docker jenkins
```

### 5. Configure Jenkins

```bash
# Create initial configuration
sudo mkdir -p /var/lib/jenkins/init.groovy.d

sudo cat > /var/lib/jenkins/init.groovy.d/01-setup.groovy << 'EOF'
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

sudo chown -R jenkins:jenkins /var/lib/jenkins/init.groovy.d
sudo systemctl restart jenkins
```

### 6. Configure Nginx Reverse Proxy

```bash
# Create nginx configuration
sudo cat > /etc/nginx/sites-available/jenkins << 'EOF'
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

# Enable the site
sudo ln -sf /etc/nginx/sites-available/jenkins /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### 7. Set Up Deployment Directory

```bash
# Create deployment directory
sudo mkdir -p /opt/execute-academy
sudo chown jenkins:jenkins /opt/execute-academy

# Clone your repository
cd /opt/execute-academy
sudo -u jenkins git clone https://github.com/your-org/execute-academy.git .
```

### 8. Configure Firewall

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

## 🎯 Jenkins Pipeline Configuration

### 1. Access Jenkins

- Open your browser and go to: `http://167.71.82.117`
- Login with: `admin` / `admin123`

### 2. Install Required Plugins

1. Go to **Manage Jenkins** > **Manage Plugins**
2. Install the following plugins:
   - Git plugin
   - Docker plugin
   - Pipeline plugin
   - Blue Ocean plugin
   - Credentials plugin

### 3. Create Pipeline Job

1. Click **New Item**
2. Enter name: `execute-academy-deploy`
3. Select **Pipeline**
4. Click **OK**

### 4. Configure Pipeline

In the pipeline configuration:

1. **Pipeline Definition**: Select **Pipeline script from SCM**
2. **SCM**: Select **Git**
3. **Repository URL**: Enter your Git repository URL
4. **Branch**: `main`
5. **Script Path**: `Jenkinsfile`

### 5. Configure Credentials

1. Go to **Manage Jenkins** > **Manage Credentials**
2. Add your Git repository credentials if needed
3. Add Docker registry credentials if using private registry

## 🔄 GitHub Webhook Setup

### 1. Create Webhook Endpoint

```bash
# Install PHP for webhook
sudo apt install -y php-fpm php-curl

# Create webhook file
sudo cat > /opt/execute-academy/webhook.php << 'EOF'
<?php
$secret = 'your-webhook-secret-here'; // Change this

$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';

if (verifySignature($payload, $signature, $secret)) {
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
```

### 2. Configure Nginx for Webhook

```bash
sudo cat > /etc/nginx/sites-available/webhook << 'EOF'
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

sudo ln -sf /etc/nginx/sites-available/webhook /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3. Configure GitHub Webhook

1. Go to your GitHub repository
2. Go to **Settings** > **Webhooks**
3. Click **Add webhook**
4. **Payload URL**: `http://167.71.82.117/webhook.php`
5. **Content type**: `application/json`
6. **Secret**: Enter the same secret you used in the webhook.php file
7. **Events**: Select **Just the push event**
8. Click **Add webhook**

## 🚀 Deployment Process

### Manual Deployment

```bash
# On your local machine
chmod +x deploy-to-server.sh
./deploy-to-server.sh
```

### Automated Deployment via Jenkins

1. Push changes to your `main` branch
2. GitHub webhook triggers Jenkins build
3. Jenkins runs the pipeline defined in `Jenkinsfile`
4. Application is automatically deployed

## 📊 Monitoring and Logs

### View Jenkins Logs

```bash
sudo journalctl -u jenkins -f
```

### View Application Logs

```bash
cd /opt/execute-academy
docker-compose logs -f
```

### View Nginx Logs

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🔒 Security Considerations

### 1. Change Default Passwords

```bash
# Change Jenkins admin password
# Access Jenkins UI and go to Manage Jenkins > Manage Users > admin > Configure
```

### 2. Enable HTTPS

```bash
# Install SSL certificate
sudo certbot --nginx -d your-domain.com
```

### 3. Secure Jenkins

1. Go to **Manage Jenkins** > **Configure Global Security**
2. Enable **CSRF Protection**
3. Configure **Authorization** as needed
4. Set up **User Management**

### 4. Regular Updates

```bash
# Update Jenkins
sudo apt update && sudo apt upgrade jenkins

# Update Docker images
cd /opt/execute-academy
docker-compose pull
docker-compose up -d
```

## 🛠 Troubleshooting

### Common Issues

1. **Jenkins not accessible**
   ```bash
   sudo systemctl status jenkins
   sudo journalctl -u jenkins -f
   ```

2. **Docker permission issues**
   ```bash
   sudo usermod -aG docker jenkins
   sudo systemctl restart jenkins
   ```

3. **Nginx configuration errors**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

4. **Application not starting**
   ```bash
   cd /opt/execute-academy
   docker-compose logs
   docker-compose ps
   ```

### Health Checks

```bash
# Check Jenkins
curl -I http://localhost:8080

# Check application
curl -I http://localhost/api/health

# Check nginx
curl -I http://localhost
```

## 📚 Additional Resources

- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [GitHub Webhooks](https://docs.github.com/en/developers/webhooks-and-events/webhooks)

## 🔄 Backup and Recovery

### Backup Jenkins Configuration

```bash
sudo tar -czf jenkins-backup-$(date +%Y%m%d).tar.gz /var/lib/jenkins
```

### Backup Application Data

```bash
cd /opt/execute-academy
docker-compose exec postgres pg_dump -U execute_academy -d execute_academy > backup-$(date +%Y%m%d).sql
```

### Restore from Backup

```bash
# Restore Jenkins
sudo tar -xzf jenkins-backup-YYYYMMDD.tar.gz -C /

# Restore database
cd /opt/execute-academy
docker-compose exec -T postgres psql -U execute_academy -d execute_academy < backup-YYYYMMDD.sql
```

---

## 🎉 Congratulations!

You now have a fully functional CI/CD pipeline for your Execute Academy application. The setup includes:

- ✅ Jenkins for CI/CD orchestration
- ✅ Automated testing and building
- ✅ Docker containerization
- ✅ Nginx reverse proxy
- ✅ GitHub webhook integration
- ✅ Automated deployment
- ✅ Health monitoring
- ✅ Backup and recovery procedures

Your application will now automatically deploy whenever you push changes to the main branch!
