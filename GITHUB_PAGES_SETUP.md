# GitHub Pages Setup Guide for CourseForge AI

## Overview
This guide will help you switch from Stellar hosting to GitHub Pages hosting for your CourseForge AI application.

## Important Note About GitHub Pages
GitHub Pages is designed for static sites (HTML, CSS, JavaScript). Since CourseForge AI is a Next.js application with a backend, you'll need to use **GitHub Pages with Next.js static export** or continue using **Vercel** (which is recommended for Next.js apps).

## Option 1: GitHub Pages (Static Export) - Limited Functionality
This will work but you'll lose dynamic features like:
- Database functionality
- User authentication
- Stripe payments
- Server-side API endpoints

## Option 2: Continue with Vercel (Recommended)
Keep using Vercel for full functionality but point your domain there properly.

## Option 3: Hybrid Approach
- Use GitHub Pages for landing/marketing pages
- Use Vercel for the actual application

---

## Option 1: GitHub Pages Setup (Static Only)

### Step 1: Configure Next.js for Static Export

First, modify your `next.config.js` to enable static export:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  // Remove any API routes or database connections
  // These won't work on GitHub Pages
}

module.exports = nextConfig
```

### Step 2: Create GitHub Pages Workflow

Create `.github/workflows/github-pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build static site
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### Step 3: Update package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "build": "next build",
    "export": "next export",
    "deploy": "next build && next export && touch dist/.nojekyll"
  }
}
```

### Step 4: Enable GitHub Pages

1. Go to your repository settings on GitHub
2. Scroll down to "Pages" section
3. Select "GitHub Actions" as source
4. Save the settings

---

## Option 2: Keep Vercel but Fix Domain (Recommended)

### Step 1: Update DNS to Point to Vercel

Since you already have Vercel configured, let's properly point your domain there:

**Get your Vercel DNS records:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your CourseForge AI project
3. Go to Settings → Domains
4. Add `courseforgeai.org` as a domain
5. Copy the DNS records Vercel provides

**Typical Vercel DNS records:**
```
A record: @ → 76.76.19.61
CNAME: www → cname.vercel-dns.com
```

### Step 2: Update Domain DNS

**Option A: Update DNS Records (Keep Stellar as registrar)**
1. Log into Stellar client area
2. Find DNS management for courseforgeai.org
3. Update A record to point to Vercel IP
4. Update CNAME for www to point to Vercel

**Option B: Transfer Nameservers to Vercel (Easier)**
1. Change nameservers to:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
2. Vercel will handle all DNS automatically

### Step 3: Verify Configuration

```bash
# Check DNS propagation
nslookup courseforgeai.org

# Should show Vercel IP (76.76.19.61) instead of Stellar IP
```

---

## Option 3: Hybrid Approach

### Landing Page on GitHub Pages
- Create a simple marketing/landing page
- Host on GitHub Pages at `courseforgeai.org`

### Application on Vercel
- Keep full CourseForge app on Vercel
- Use subdomain like `app.courseforgeai.org`
- Link from landing page to application

---

## Clearing Current DNS Configuration

### Step 1: Remove Stellar Hosting
1. Log into Stellar client area
2. Cancel hosting service (keep domain registration)
3. Or ask support to "park" the domain

### Step 2: Reset DNS Records
1. Find DNS management in Stellar
2. Remove all current A records
3. Remove CNAME records
4. Reset to default/nameserver mode

### Step 3: Choose Your New Setup
Decide between GitHub Pages (static only) or Vercel (full functionality)

---

## Domain Configuration Steps

### For GitHub Pages:
1. **Repository Settings** → Pages → Enable GitHub Actions
2. **Custom Domain**: Add `courseforgeai.org` in Pages settings
3. **DNS Records**: Point domain to GitHub Pages IPs:
   ```
   A record: @ → 185.199.108.153
   A record: @ → 185.199.109.153
   A record: @ → 185.199.110.153
   A record: @ → 185.199.111.153
   CNAME: www → yourusername.github.io
   ```

### For Vercel:
1. **Vercel Dashboard** → Add domain
2. **DNS**: Point to Vercel nameservers or A records
3. **SSL**: Automatically configured

---

## Testing Your Setup

### DNS Propagation Check
```bash
# Check if DNS has updated
nslookup courseforgeai.org
dig courseforgeai.org

# Check from different locations
https://www.whatsmydns.net/#A/courseforgeai.org
```

### Website Verification
- Visit `https://courseforgeai.org`
- Check SSL certificate
- Test all functionality

---

## Troubleshooting

### Common Issues

1. **"Site not found" after DNS change**
   - Wait 15-30 minutes for propagation
   - Clear browser cache
   - Check DNS from different location

2. **SSL certificate issues**
   - Vercel: Auto-SSL takes a few minutes
   - GitHub Pages: May take up to an hour

3. **Domain not working**
   - Verify DNS records are correct
   - Check domain registration status
   - Test with `nslookup`

### Support Contacts
- **Domain Issues**: Contact Stellar (your registrar)
- **Vercel Issues**: Vercel support
- **GitHub Pages**: GitHub support

---

## Migration Timeline

1. **Planning**: 15 minutes (choose your approach)
2. **DNS Changes**: 5 minutes
3. **Propagation**: 15-30 minutes
4. **Verification**: 10 minutes
5. **Total**: Less than 1 hour

---

## Next Steps

1. **Choose your hosting approach** (GitHub Pages vs Vercel)
2. **Clear current Stellar DNS configuration**
3. **Set up new hosting**
4. **Configure domain DNS**
5. **Test and verify**

**Which approach do you want to take?**
- GitHub Pages (static only, limited functionality)
- Vercel (full Next.js functionality, recommended)
- Hybrid (landing page on GitHub Pages, app on Vercel)