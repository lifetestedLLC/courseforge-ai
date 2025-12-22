# 🚀 Stripe Quick Start Guide

## What You Need Right Now

### 1. Get Your Stripe API Keys
1. **Go to**: https://dashboard.stripe.com/apikeys
2. **Sign in** to your Stripe account (or create one)
3. **Copy your test secret key** (starts with `sk_test_`)
4. **Copy your publishable key** (starts with `pk_test_`)

### 2. Update Your .env.local File
Replace the placeholder values in your `.env.local` file:

```bash
# Replace these values:
STRIPE_SECRET_KEY="sk_test_your_actual_secret_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"  # We'll get this later

# Keep these as placeholders for now:
STRIPE_STARTER_PRICE_ID="price_your_starter_price_id"
STRIPE_CREATOR_PRICE_ID="price_your_creator_price_id" 
STRIPE_BUSINESS_PRICE_ID="price_your_business_price_id"
```

### 3. Test Your Connection
Run this test to verify everything is working:

```bash
node test-stripe-simple.js
```

## 🎯 Next Steps (After You Have Your API Keys)

### Step 1: Create Your Products
1. **Go to**: Stripe Dashboard → Products
2. **Click**: "Add product"
3. **Create these products**:

#### Starter Plan
- **Name**: CourseForge AI - Starter
- **Description**: Perfect for individual creators getting started
- **Type**: Service

#### Creator Plan  
- **Name**: CourseForge AI - Creator
- **Description**: For serious course creators and small teams
- **Type**: Service

#### Business Plan
- **Name**: CourseForge AI - Business
- **Description**: Full-featured solution for businesses
- **Type**: Service

### Step 2: Create Prices
For each product, click "Add price":

#### Starter Plan Price
- **Price**: $15
- **Billing period**: Monthly
- **Currency**: USD

#### Creator Plan Price
- **Price**: $39
- **Billing period**: Monthly
- **Currency**: USD

#### Business Plan Price
- **Price**: $79
- **Billing period**: Monthly
- **Currency**: USD

### Step 3: Copy Price IDs
After creating each price, you'll see a Price ID like `price_abc123xyz789`.
Copy these and update your `.env.local`:

```bash
STRIPE_STARTER_PRICE_ID="price_your_actual_starter_price_id"
STRIPE_CREATOR_PRICE_ID="price_your_actual_creator_price_id"
STRIPE_BUSINESS_PRICE_ID="price_your_actual_business_price_id"
```

### Step 4: Set Up Webhooks
1. **Go to**: Stripe Dashboard → Developers → Webhooks
2. **Click**: "Add endpoint"
3. **Endpoint URL**: `http://localhost:3000/api/stripe/webhook`
   - For production: `https://yourdomain.com/api/stripe/webhook`
4. **Events to listen for**:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. **Copy the webhook secret** (starts with `whsec_`)
6. **Update your .env.local**:

```bash
STRIPE_WEBHOOK_SECRET="whsec_your_actual_webhook_secret"
```

### Step 5: Test Webhooks Locally
In a separate terminal, run:
```bash
npm run stripe:webhooks
```

## 🧪 Testing Your Integration

### Run the Test Suite
```bash
node test-stripe-simple.js
```

### Test the Complete Flow
1. **Go to**: http://localhost:3000/pricing
2. **Sign in** to your app
3. **Click** "Subscribe to Starter"
4. **Use test card**: `4242 4242 4242 4242`
5. **Any future date** for expiry
6. **Any 3-digit** CVC
7. **Complete** the purchase

### Verify Everything Works
- Check your account dashboard shows the subscription
- Verify webhook events are being received
- Test customer portal access

## 🎉 You're Done!

Once all tests pass and you can complete a test subscription, your Stripe integration is ready!

## 📞 Need Help?

### Common Issues:
1. **"Invalid API Key"** → Check your Stripe dashboard for correct keys
2. **"Price not found"** → Make sure prices are active, not archived
3. **Webhook not working** → Check the webhook URL and secret
4. **Test card declined** → Use the test cards provided above

### Useful Commands:
```bash
npm run stripe:test           # Run full test suite
npm run stripe:connection     # Test Stripe connection only
npm run stripe:prices         # Verify price IDs
npm run stripe:webhooks       # Start webhook forwarding
```

### Stripe Test Resources:
- **Test cards**: https://stripe.com/docs/testing#cards
- **Dashboard**: https://dashboard.stripe.com/test/dashboard
- **API keys**: https://dashboard.stripe.com/test/apikeys
- **Webhooks**: https://dashboard.stripe.com/test/webhooks

---

**Ready to start?** Get your Stripe API keys first, then run the test to verify everything works!