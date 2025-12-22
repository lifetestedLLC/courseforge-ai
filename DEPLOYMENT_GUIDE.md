# 🚀 CourseForge AI - Deployment Guide

This guide covers multiple ways to deploy your CourseForge AI application to a custom domain, from simple to advanced options.

## 📋 Deployment Checklist

Before deploying, make sure you have:

- [ ] Custom domain purchased (e.g., Namecheap, GoDaddy, Google Domains)
- [ ] Production environment variables configured
- [ ] Live Stripe API keys (not test keys)
- [ ] Database ready for production
- [ ] SSL certificate planned

## 🎯 Option 1: Vercel (Recommended - Easiest)

### Step 1: Prepare for Production

1. **Update Environment Variables** (`.env.production`):
```bash
# Production Database (PostgreSQL recommended)
DATABASE_URL="postgresql://user:password@host:5432/courseforge"

# Production URLs
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-super-long-secure-production-secret-key"

# Live Stripe Keys (NOT test keys!)
STRIPE_SECRET_KEY="sk_live_your_actual_live_key"
STRIPE_PUBLISHABLE_KEY="pk_live_your_actual_live_key"
STRIPE_WEBHOOK_SECRET="whsec_your_actual_webhook_secret"

# Live Price IDs (create in live Stripe dashboard)
STRIPE_STARTER_PRICE_ID="price_live_starter_price_id"
STRIPE_CREATOR_PRICE_ID="price_live_creator_price_id"
STRIPE_BUSINESS_PRICE_ID="price_live_business_price_id"

# Production App URL
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NODE_ENV="production"
```

2. **Create Production Build**:
```bash
npm run build
```

### Step 2: Deploy to Vercel

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel --prod
```

4. **Follow prompts**:
- Link to your GitHub repo (or create new)
- Set environment variables in Vercel dashboard
- Choose your domain or use Vercel subdomain

### Step 3: Configure Custom Domain

1. **In Vercel Dashboard**:
- Go to your project settings
- Add custom domain
- Follow DNS instructions provided

2. **In Domain Registrar**:
- Add CNAME record pointing to Vercel
- Or use nameservers if transferring DNS

## 🎯 Option 2: Netlify

### Step 1: Prepare Build Settings

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 2: Deploy

1. **Connect GitHub Repo** to Netlify
2. **Set Environment Variables** in Netlify dashboard
3. **Trigger Deploy** automatically on push

## 🎯 Option 3: Railway (Great for Full-Stack)

Railway provides database + hosting in one platform.

### Step 1: Prepare Railway

1. **Install Railway CLI**:
```bash
npm i -g @railway/cli
```

2. **Login**:
```bash
railway login
```

3. **Initialize Project**:
```bash
railway init
```

### Step 2: Deploy

```bash
railway up
```

Railway will automatically:
- Detect your Next.js app
- Provision PostgreSQL database
- Set up SSL
- Provide custom domain options

## 🎯 Option 4: Digital Ocean (Advanced)

For more control and lower costs at scale.

### Step 1: Create Droplet

1. **Create Ubuntu 20.04+ Droplet**
2. **SSH into your server**:
```bash
ssh root@your-server-ip
```

### Step 2: Install Dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Install Nginx
apt install nginx -y

# Install PostgreSQL
apt install postgresql postgresql-contrib -y
```

### Step 3: Setup Database

```bash
# Create database and user
sudo -u postgres psql

CREATE DATABASE courseforge;
CREATE USER courseforge WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE courseforge TO courseforge;
\q
```

### Step 4: Deploy Application

```bash
# Create app directory
mkdir -p /var/www/courseforge
cd /var/www/courseforge

# Clone your repository
git clone your-repo-url .

# Install dependencies
npm install

# Build the application
npm run build

# Create PM2 ecosystem file
echo 'module.exports = {
  apps: [{
    name: "courseforge",
    script: "npm",
    args: "start",
    env: {
      NODE_ENV: "production",
      PORT: 3000,
      DATABASE_URL: "postgresql://courseforge:password@localhost:5432/courseforge",
      # Add other production env vars
    }
  }]
}' > ecosystem.config.js

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 5: Configure Nginx

Create `/etc/nginx/sites-available/courseforge`:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
ln -s /etc/nginx/sites-available/courseforge /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Step 6: SSL with Let's Encrypt

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
certbot renew --dry-run
```

## 🎯 Option 5: AWS (Enterprise Level)

For maximum scalability and enterprise features.

### Architecture:
- **EC2**: Application server
- **RDS**: PostgreSQL database
- **S3**: Static assets
- **CloudFront**: CDN
- **ALB**: Load balancer
- **Route 53**: DNS
- **Certificate Manager**: SSL

### Quick Deploy with AWS Amplify:
1. Connect GitHub repo to AWS Amplify
2. Configure build settings
3. Set environment variables
4. Connect custom domain

## 🔧 Essential Production Setup

### 1. Stripe Live Configuration

```bash
# Create live products in Stripe Dashboard
# Copy live price IDs to your production environment
# Set up live webhook endpoint: https://yourdomain.com/api/stripe/webhook
# Update webhook secret
```

### 2. Database Migration

```bash
# For SQLite to PostgreSQL migration:
# 1. Export SQLite data
# 2. Import to PostgreSQL
# 3. Update DATABASE_URL
# 4. Run: npm run db:push
```

### 3. Environment Variables Security

- Never commit `.env.production` to git
- Use platform's secret management
- Rotate keys regularly
- Use different keys for different environments

### 4. Monitoring Setup

Add these to your production dependencies:
```bash
npm install @sentry/nextjs winston @vercel/analytics
```

### 5. Performance Optimization

Create `next.config.js`:
```javascript
module.exports = {
  images: {
    domains: ['your-cdn-domain.com'],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
}
```

## 🚨 Common Deployment Issues & Solutions

### Issue 1: Build Fails
```bash
# Solution: Clear cache and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Issue 2: Database Connection Fails
```bash
# Solution: Check connection string and firewall
# Ensure database is accessible from your server
# Check if IP is whitelisted
```

### Issue 3: Stripe Webhooks Not Working
```bash
# Solution: Verify webhook URL is accessible
# Check webhook secret is correct
# Ensure endpoint returns 200 status
```

### Issue 4: Environment Variables Not Loading
```bash
# Solution: Check platform-specific env var setup
# Verify variable names match exactly
# Restart deployment after changes
```

## 📊 Post-Deployment Checklist

- [ ] SSL certificate installed and working
- [ ] Custom domain pointing correctly
- [ ] All environment variables set
- [ ] Database accessible and migrated
- [ ] Stripe webhooks configured and tested
- [ ] Error monitoring active (Sentry)
- [ ] Analytics tracking (Google Analytics)
- [ ] Performance monitoring
- [ ] Backup strategy in place
- [ ] Security headers configured

## 🎯 Recommended Path

For most users, I recommend this order:

1. **Start with Vercel** (fastest to deploy)
2. **Test thoroughly** with your domain
3. **Scale to Railway** if you need more control
4. **Move to Digital Ocean/AWS** when you have significant traffic

## 🚀 Quick Start (Vercel - 5 minutes)

```bash
# 1. Push your code to GitHub
# 2. Go to vercel.com and connect your GitHub
# 3. Import your CourseForge repository
# 4. Add environment variables in Vercel dashboard
# 5. Deploy - you'll get a URL instantly
# 6. Add your custom domain in Vercel settings
# 7. Update DNS in your domain registrar
# 8. Done! 🎉
```

Choose your deployment method based on your needs, budget, and technical comfort level. Start simple and scale up as your platform grows!