# Stripe Setup Guide for CourseForge AI

## 🎯 Overview
This guide will walk you through setting up Stripe products, prices, and webhooks for your CourseForge AI application.

## 📋 Prerequisites
- Stripe account (https://dashboard.stripe.com/register)
- Your application running locally or deployed
- Environment variables configured

## 🔧 Step 1: Create Stripe Products

### 1.1 Log into Stripe Dashboard
1. Go to https://dashboard.stripe.com
2. Sign in to your account

### 1.2 Create Products
Navigate to **Products** → **Add product** and create these products:

#### **Starter Plan**
- **Name**: CourseForge AI - Starter
- **Description**: Perfect for individual creators getting started
- **Product type**: Service
- **Save** the product

#### **Creator Plan**
- **Name**: CourseForge AI - Creator  
- **Description**: For serious course creators and small teams
- **Product type**: Service
- **Save** the product

#### **Business Plan**
- **Name**: CourseForge AI - Business
- **Description**: Full-featured solution for businesses
- **Product type**: Service
- **Save** the product

## 💰 Step 2: Create Prices for Each Product

### 2.1 Add Prices to Products
For each product, click **Add price** and configure:

#### **Starter Plan Price**
- **Pricing model**: Standard pricing
- **Price**: $15.00
- **Billing period**: Monthly
- **Currency**: USD (or your preferred currency)
- Click **Save price**

#### **Creator Plan Price**
- **Pricing model**: Standard pricing
- **Price**: $39.00
- **Billing period**: Monthly
- **Currency**: USD
- Click **Save price**

#### **Business Plan Price**
- **Pricing model**: Standard pricing
- **Price**: $79.00
- **Billing period**: Monthly
- **Currency**: USD
- Click **Save price**

### 2.2 Copy Price IDs
After creating each price, you'll see a price ID that looks like:
```
price_1ABC123DEF456GHI789JKL012
```

Copy these IDs - you'll need them for your environment variables.

## 🔐 Step 3: Get Your API Keys

### 3.1 Find Your Keys
1. Go to **Developers** → **API keys**
2. Copy your **Secret key** (starts with `sk_test_` for test mode)
3. Copy your **Publishable key** (starts with `pk_test_`)

### 3.2 Update Environment Variables
Update your `.env.local` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_your_secret_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"  # We'll get this in step 5

# Stripe Price IDs
STRIPE_STARTER_PRICE_ID="price_your_starter_price_id"
STRIPE_CREATOR_PRICE_ID="price_your_creator_price_id"
STRIPE_BUSINESS_PRICE_ID="price_your_business_price_id"

# Stripe Product IDs (found in product details)
STRIPE_STARTER_PRODUCT_ID="prod_your_starter_product_id"
STRIPE_CREATOR_PRODUCT_ID="prod_your_creator_product_id"
STRIPE_BUSINESS_PRODUCT_ID="prod_your_business_product_id"
```

## 🪝 Step 4: Set Up Stripe Webhooks

### 4.1 Create Webhook Endpoint
1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. **Endpoint URL**: `https://your-domain.com/api/stripe/webhook`
   - For local development, use ngrok: `https://your-ngrok-url.ngrok.io/api/stripe/webhook`
4. **Events to send**: Select these events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
   - `customer.subscription.trial_will_end`

### 4.2 Get Webhook Secret
After creating the endpoint, you'll get a webhook secret that looks like:
```
whsec_1234567890abcdef1234567890abcdef1234567890abcdef
```
Add this to your environment variables.

## 🧪 Step 5: Test Webhooks Locally

### 5.1 Install Stripe CLI
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Linux
sudo apt install stripe

# Or download from: https://stripe.com/docs/stripe-cli
```

### 5.2 Login to Stripe CLI
```bash
stripe login
```

### 5.3 Forward Webhooks to Local Server
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

This will give you a webhook secret for local testing. Copy it and update your `.env.local`:
```bash
STRIPE_WEBHOOK_SECRET="whsec_your_local_webhook_secret"
```

## 🚀 Step 6: Test the Complete Flow

### 6.1 Start Your Application
```bash
npm run dev
```

### 6.2 Test Subscription Flow
1. Go to `http://localhost:3000/pricing`
2. Sign in to your application
3. Click "Subscribe to Starter" 
4. You'll be redirected to Stripe Checkout
5. Use test card: `4242 4242 4242 4242`
6. Any future date for expiry, any CVC
7. Complete the purchase

### 6.3 Verify in Dashboard
1. Go to your account dashboard
2. Check subscription status
3. Verify usage tracking works
4. Test customer portal access

## 🧪 Test Card Numbers
Use these Stripe test card numbers:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`
- **Insufficient Funds**: `4000 0000 0000 9995`

## 🛠️ Troubleshooting

### Common Issues:

1. **"Invalid price ID" error**
   - Verify price IDs match exactly what's in Stripe
   - Ensure prices are active, not archived

2. **Webhook not receiving events**
   - Check webhook URL is correct
   - Verify webhook secret is properly set
   - Use Stripe CLI to test webhook forwarding

3. **Subscription not updating in database**
   - Check webhook signature verification
   - Verify database connection
   - Check webhook event logs in Stripe dashboard

4. **Customer portal not working**
   - Ensure customer has Stripe customer ID
   - Verify customer portal configuration
   - Check if subscription is active

## 📊 Monitoring

### Stripe Dashboard
- Monitor real-time events in **Developers** → **Logs**
- Track subscription metrics in **Billing** → **Subscriptions**
- View payment success rates in **Payments**

### Application Monitoring
- Check console logs for webhook processing
- Monitor database subscription updates
- Track user subscription status changes

## 🔄 Next Steps

1. **Set up email notifications** for subscription events
2. **Implement usage limit warnings** when users approach limits
3. **Add subscription analytics** to track conversion rates
4. **Create upgrade/downgrade flows** for existing subscribers
5. **Set up proper error handling** and user notifications

## 📞 Need Help?

- **Stripe Support**: https://support.stripe.com
- **Stripe Documentation**: https://stripe.com/docs
- **Stripe Developer Discord**: https://stripe.com/docs/discord

---

Once you've completed these steps, your Stripe integration will be fully functional! Test thoroughly before going live.