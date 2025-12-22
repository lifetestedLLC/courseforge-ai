# Vercel Environment Variables Setup Guide

## Overview
This guide walks you through setting up environment variables on Vercel for CourseForge AI production deployment.

## Prerequisites
- Vercel account (create at [vercel.com](https://vercel.com))
- Your project imported to Vercel
- Access to your production API keys

## Step-by-Step Setup

### 1. Access Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and log in
2. Select your CourseForge AI project from the dashboard
3. Click on the "Settings" tab at the top

### 2. Navigate to Environment Variables
1. In the left sidebar, click on "Environment Variables"
2. You'll see sections for:
   - Production
   - Preview
   - Development

### 3. Add Production Environment Variables

Copy and paste these variables with your actual values:

#### Core Application Variables
```bash
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secure-32-plus-character-production-secret
NODE_ENV=production
```

#### Database Configuration
```bash
DATABASE_URL=postgresql://username:password@host:port/database
```

#### Stripe Configuration
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
STRIPE_SECRET_KEY=sk_live_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

#### OpenAI Configuration
```bash
OPENAI_API_KEY=sk-your-openai-api-key
```

### 4. Variable-Specific Instructions

#### NEXTAUTH_URL
- **Production**: Use your actual domain (e.g., `https://courseforge-ai.vercel.app`)
- **Preview**: Use the preview URL (e.g., `https://courseforge-ai-git-develop-yourname.vercel.app`)
- **Development**: Leave empty or use `http://localhost:3000`

#### NEXTAUTH_SECRET
- Generate a secure 32+ character string
- Use this command: `openssl rand -base64 32`
- Keep this secret secure and never share it

#### DATABASE_URL
- Use a production PostgreSQL service like:
  - [Supabase](https://supabase.com/) (recommended)
  - [Neon](https://neon.tech/)
  - [Railway](https://railway.app/)
- Format: `postgresql://username:password@host:port/database`
- Enable SSL for production: `?sslmode=require`

#### Stripe Keys
- Use **live** keys for production (not test keys)
- `pk_live_*` for publishable key
- `sk_live_*` for secret key
- Set up webhooks in Stripe dashboard for your production URL

### 5. Vercel Interface Instructions

#### Adding Variables
1. Click "Add Environment Variable"
2. Enter the **Name** (e.g., `NEXTAUTH_URL`)
3. Enter the **Value**
4. Select the **Environment** (Production, Preview, Development)
5. Click "Add"

#### For Different Environments
Repeat the process for each environment:
- **Production**: Your live application
- **Preview**: Deploy previews from pull requests
- **Development**: Local development (optional, usually use `.env.local`)

### 6. Example Vercel Configuration

Here's what your Vercel environment variables should look like:

```bash
# Production Environment
NEXTAUTH_URL=https://courseforge-ai.vercel.app
NEXTAUTH_SECRET=your-generated-32-char-secret
DATABASE_URL=postgresql://user:pass@db.supabase.co:5432/courseforge
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51...
STRIPE_SECRET_KEY=sk_live_51...
STRIPE_WEBHOOK_SECRET=whsec_...
OPENAI_API_KEY=sk-proj-...
NODE_ENV=production

# Preview Environment (for PR previews)
NEXTAUTH_URL=https://courseforge-ai-git-preview-vercel.vercel.app
NEXTAUTH_SECRET=your-generated-32-char-secret
DATABASE_URL=postgresql://user:pass@db.supabase.co:5432/courseforge_staging
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
OPENAI_API_KEY=sk-proj-...
NODE_ENV=production
```

## Verification Steps

### 1. Test Local Build
```bash
# Pull environment variables from Vercel
vercel env pull .env.local

# Build locally
npm run build

# Test the build
npm start
```

### 2. Deploy to Vercel
1. Push your code to GitHub
2. Vercel will automatically deploy
3. Check the deployment logs for any errors

### 3. Verify Production Deployment
1. Visit your production URL
2. Test core functionality:
   - User authentication
   - Database connections
   - Stripe payments
   - OpenAI integration

## Troubleshooting

### Common Issues

1. **"Missing environment variable" errors**
   - Check spelling of variable names
   - Verify all required variables are added
   - Ensure correct environment (Production vs Preview)

2. **Database connection failures**
   - Verify DATABASE_URL format
   - Check if database allows connections from Vercel IPs
   - Ensure SSL is configured if required

3. **NextAuth errors**
   - Verify NEXTAUTH_URL matches your actual domain
   - Check NEXTAUTH_SECRET is set
   - Ensure cookies are properly configured

4. **Stripe webhook issues**
   - Verify webhook endpoint URL in Stripe dashboard
   - Check STRIPE_WEBHOOK_SECRET is correct
   - Ensure webhook is set up for production URL

### Debug Commands
```bash
# Check Vercel deployment logs
vercel logs

# Test environment variables
vercel env ls

# Redeploy with new variables
vercel --prod
```

## Security Considerations

### Production Environment
- Use **live** Stripe keys, not test keys
- Use strong, unique NEXTAUTH_SECRET
- Enable SSL on database connections
- Restrict database access to Vercel IPs only

### Key Management
- Rotate API keys regularly
- Use different keys for different environments
- Monitor API usage for anomalies
- Set up alerts for key expiration

### Access Control
- Limit who can access Vercel dashboard
- Use 2FA on all accounts
- Regular audit of team members
- Document key rotation procedures

## Additional Resources

- [Vercel Environment Variables Docs](https://vercel.com/docs/concepts/projects/environment-variables)
- [NextAuth.js Deployment Guide](https://next-auth.js.org/deployment)
- [Stripe Production Checklist](https://stripe.com/docs/checkout/quickstart)
- [Vercel PostgreSQL Guide](https://vercel.com/docs/storage/vercel-postgres)

## Next Steps

1. Set up your production database
2. Configure Stripe for production
3. Add environment variables to Vercel
4. Test your deployment
5. Set up monitoring and alerts

Need help with any of these steps? Check the [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) for detailed variable descriptions.