# 🚀 Live Deployment Checklist - CourseForge AI

## ✅ Pre-Deployment Setup

### 1. Stripe Live Configuration
- [ ] Switch to **LIVE mode** in Stripe Dashboard (top right)
- [ ] Create live products:
  - [ ] **Starter Plan** - $15/month
  - [ ] **Creator Plan** - $49/month  
  - [ ] **Business Plan** - $99/month
- [ ] Copy live price IDs to your production config
- [ ] Get live **secret key** (`sk_live_...`)
- [ ] Get live **webhook secret** (`whsec_...`)

### 2. Domain & Hosting Setup
- [ ] Purchase domain name (Namecheap, GoDaddy, Google Domains)
- [ ] Choose hosting platform (Vercel recommended)
- [ ] Set up production database (PostgreSQL recommended)

## 🎯 Quick Deploy to Vercel (10 minutes)

### Step 1: Prepare Production Environment

1. **Update your production config** (`.env.production`):
```bash
# Replace with your actual values:
STRIPE_SECRET_KEY="sk_live_your_actual_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_live_51SgF8K40xIY9uFpinQQHJnBrp4oBuqmuk3097UxNH6lJLTaixPIy6W7Xs4pofxayD8Dryhz62wkpCHRTfIeAEBOk009n0qW9m6"
STRIPE_WEBHOOK_SECRET="whsec_your_actual_webhook_secret"
NEXTAUTH_URL="https://yourdomain.com"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### Step 2: Deploy (5 minutes)

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up with GitHub**
3. **Import your CourseForge repository**
4. **Add Environment Variables** in Vercel dashboard:
```
DATABASE_URL=your_production_database_url
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_32_character_secret
STRIPE_SECRET_KEY=sk_live_your_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_51SgF8K40xIY9uFpinQQHJnBrp4oBuqmuk3097UxNH6lJLTaixPIy6W7Xs4pofxayD8Dryhz62wkpCHRTfIeAEBOk009n0qW9m6
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_STARTER_PRICE_ID=price_live_starter
STRIPE_CREATOR_PRICE_ID=price_live_creator
STRIPE_BUSINESS_PRICE_ID=price_live_business
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
OPENAI_API_KEY=sk_your_openai_key
```

5. **Click Deploy** → You'll get a URL like `courseforge-ai-xyz123.vercel.app`

### Step 3: Custom Domain (5 minutes)

1. **In Vercel**: Settings → Domains → Add your domain
2. **In your domain registrar**: Add CNAME record pointing to Vercel
3. **Wait for SSL** - Vercel automatically provisions certificate

## 🔧 Stripe Live Webhook Setup

1. **In Stripe Dashboard** (LIVE mode):
   - Developers → Webhooks → Add endpoint
   - Endpoint URL: `https://yourdomain.com/api/stripe/webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `invoice.payment_succeeded`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`

2. **Copy webhook secret** and add to environment variables

## 🧪 Post-Deployment Testing

### Critical Tests:
- [ ] **Homepage loads** with SSL (lock icon)
- [ ] **User registration** works
- [ ] **Login/logout** functions properly
- [ ] **Subscription flow** completes successfully
- [ ] **Payment processing** charges real money
- [ ] **Webhook events** are received
- [ ] **Dashboard** shows subscription status
- [ ] **Course creation** respects subscription limits
- [ ] **Mobile experience** is smooth
- [ ] **Error handling** works gracefully

### Test Payment Flow:
1. Use a real credit card (small amount like $15)
2. Verify you receive confirmation email
3. Check Stripe dashboard for successful payment
4. Verify subscription appears in dashboard
5. Test subscription management (upgrade/downgrade)

## 🚨 Common Live Deployment Issues

### Issue 1: "Test Key Still Being Used"
```bash
# Check your environment variables in Vercel
# Make sure you're using sk_live_ not sk_test_
# Restart deployment after changes
```

### Issue 2: "Webhook Not Working"
```bash
# Check webhook URL is correct (https://yourdomain.com/api/stripe/webhook)
# Verify webhook secret matches exactly
# Check webhook events are selected
# Look at webhook attempts in Stripe dashboard
```

### Issue 3: "Database Connection Failed"
```bash
# Verify DATABASE_URL is correct
# Check database is accessible from Vercel IPs
# Ensure firewall allows connections
```

### Issue 4: "Domain Not Working"
```bash
# Wait 5-10 minutes for DNS propagation
# Check CNAME record is set correctly
# Verify domain is added in Vercel dashboard
```

## 🛡️ Security Checklist

- [ ] **HTTPS enforced** (automatic with Vercel)
- [ ] **Environment variables** not in code
- [ ] **Database secured** with strong passwords
- [ ] **Stripe webhook** endpoint validates signatures
- [ ] **NextAuth secret** is strong (32+ characters)
- [ ] **Error messages** don't expose sensitive data
- [ ] **Rate limiting** configured (Vercel handles this)

## 📊 Monitoring Setup

### Add these after deployment:
- [ ] **Google Analytics** for traffic
- [ ] **Stripe Analytics** for revenue
- [ ] **Sentry** for error tracking
- [ ] **Uptime monitoring** (e.g., UptimeRobot)

## 🎯 Production Success Metrics

Track these after going live:
- [ ] **Page load time** < 3 seconds
- [ ] **Conversion rate** (visits → signups → purchases)
- [ ] **Error rate** < 1%
- [ ] **Uptime** > 99%
- [ ] **Customer satisfaction** (support tickets)

## 🚀 You're Live! What's Next?

### Immediate (First 24 hours):
1. **Monitor closely** - watch for any errors
2. **Test everything** - complete user journeys
3. **Check analytics** - verify tracking works
4. **Backup strategy** - ensure data is safe

### Short term (First week):
1. **Optimize performance** based on real usage
2. **Set up customer support** channels
3. **Create documentation** for users
4. **Plan marketing** strategy

### Long term (First month):
1. **Scale infrastructure** as needed
2. **Add new features** based on feedback
3. **Optimize conversion** funnel
4. **Expand to new markets**

---

## 🎉 **Ready to Launch?**

Your CourseForge AI is **production-ready**! Follow this checklist and you'll be processing real payments in under 10 minutes.

**Remember**: Start simple with Vercel, get live, then optimize. Perfect is the enemy of shipped!

**Go make that first dollar! 💰**