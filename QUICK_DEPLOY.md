# 🚀 Quick Deploy Guide - Get Live in 10 Minutes!

## ⚡ Easiest Path: Vercel (Recommended)

### Step 1: Prepare Production Environment

1. **Create production environment file**:
```bash
cp .env.local .env.production
```

2. **Update with LIVE Stripe keys** (NOT test keys!):
```bash
# Edit .env.production
STRIPE_SECRET_KEY="sk_live_your_actual_live_key"
STRIPE_PUBLISHABLE_KEY="pk_live_your_actual_live_key"
STRIPE_WEBHOOK_SECRET="whsec_your_actual_live_webhook_secret"

# Update URLs for production
NEXTAUTH_URL="https://yourdomain.com"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### Step 2: Deploy to Vercel (5 minutes)

1. **Go to [vercel.com](https://vercel.com)** and sign up with GitHub

2. **Click "New Project"** → Import your CourseForge repository

3. **Add Environment Variables** in Vercel dashboard:
```
DATABASE_URL="file:./dev.db" (or your production DB)
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-super-long-production-secret"
STRIPE_SECRET_KEY="sk_live_your_stripe_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
STRIPE_STARTER_PRICE_ID="price_your_starter_price"
STRIPE_CREATOR_PRICE_ID="price_your_creator_price"
STRIPE_BUSINESS_PRICE_ID="price_your_business_price"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NODE_ENV="production"
```

4. **Click "Deploy"** - You'll get a URL like `https://courseforge-ai-xyz123.vercel.app`

### Step 3: Add Custom Domain (5 minutes)

1. **In Vercel Dashboard**: Settings → Domains → Add Domain

2. **In your domain registrar** (GoDaddy, Namecheap, etc.):
   - Add CNAME record: `yourdomain.com` → `cname.vercel-dns.com`
   - Or update nameservers to Vercel's if you prefer

3. **Wait for SSL** - Vercel automatically provisions SSL certificate

## 🎯 Alternative: Netlify (Also 10 minutes)

1. **Go to [netlify.com](https://netlify.com)**
2. **Drag & drop your project folder** or connect GitHub
3. **Add environment variables** in Site Settings
4. **Deploy automatically**
5. **Add custom domain** in Domain Settings

## 📋 Before You Deploy - Quick Checklist

- [ ] **Domain purchased** (e.g., GoDaddy, Namecheap)
- [ ] **Live Stripe account** (not test mode)
- [ ] **Products created in live Stripe dashboard**
- [ ] **Webhook endpoint configured** (https://yourdomain.com/api/stripe/webhook)
- [ ] **Environment variables updated** with live keys

## 🚨 Common Gotchas

### 1. **Still using test Stripe keys?**
```bash
# BAD - Test keys
STRIPE_SECRET_KEY="sk_test_..."

# GOOD - Live keys  
STRIPE_SECRET_KEY="sk_live_..."
```

### 2. **Wrong webhook secret?**
- Live webhook secret is different from test webhook secret
- Get it from live Stripe dashboard → Developers → Webhooks

### 3. **Database not production-ready?**
- SQLite works but PostgreSQL is recommended for production
- Railway.app gives you free PostgreSQL database

### 4. **Environment variables not set?**
- Must set them in Vercel dashboard, not just in files
- Vercel doesn't read .env files for security

## 🎉 You're Live! Now What?

### Immediate Actions:
1. **Test the complete flow** - signup → subscribe → create course
2. **Verify Stripe webhooks** are working
3. **Check SSL certificate** is active (lock icon in browser)
4. **Test on mobile** devices

### Next Steps:
1. **Set up monitoring** (Sentry, Google Analytics)
2. **Configure email** (SendGrid, Mailgun)
3. **Add customer support** (chat widget, help docs)
4. **Optimize for SEO** (meta tags, sitemap)

## 🆘 Need Help?

### Quick Fixes:
- **Build fails?** → Clear cache and rebuild in Vercel dashboard
- **Domain not working?** → Check DNS propagation (wait 5-10 minutes)
- **Stripe issues?** → Verify live keys and webhook setup
- **Database errors?** → Check connection string and credentials

### Support Resources:
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Stripe Deploy Guide: [stripe.com/docs/deployments](https://stripe.com/docs/deployments)
- Your deployment guide: `DEPLOYMENT_GUIDE.md`

---

**🎯 Pro Tip**: Start with Vercel, get live in 10 minutes, then optimize later. Perfect is the enemy of shipped!

**Ready to go live? Let's do this! 🚀**