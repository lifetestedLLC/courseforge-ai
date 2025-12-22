# Environment Variables Configuration Guide

## Overview
This guide explains how to properly manage environment variables for CourseForge AI across different environments (development, staging, production).

## Security Best Practices

### ✅ DO:
- Use environment variables for all sensitive data (API keys, database URLs, secrets)
- Use different values for development vs production
- Rotate keys regularly
- Use your hosting platform's built-in environment variable management
- Keep `.env` files out of version control

### ❌ DON'T:
- Commit `.env` files to git
- Share API keys between team members via files
- Use production keys in development
- Hardcode sensitive values in your code

## Required Environment Variables

### Core Application Variables
```bash
# Next.js Configuration
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-nextauth-secret-min-32-chars

# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OpenAI Configuration
OPENAI_API_KEY=sk-...
```

### Optional Variables
```bash
# Application Settings
NODE_ENV=production
PORT=3000

# Email Configuration (if using email features)
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=user@example.com
EMAIL_SERVER_PASSWORD=password
EMAIL_FROM=noreply@your-domain.com

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Error Tracking (optional)
SENTRY_DSN=https://...@sentry.io/...
```

## Environment-Specific Configuration

### Development (.env.local)
```bash
# Development values - safe to use locally
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=development-secret-min-32-characters-long
DATABASE_URL=postgresql://localhost:5432/courseforge_dev
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
OPENAI_API_KEY=sk-...
```

### Production (Environment Variables)
```bash
# Production values - set via hosting platform
NEXTAUTH_URL=https://courseforge-ai.com
NEXTAUTH_SECRET=your-secure-32-plus-character-production-secret
DATABASE_URL=postgresql://prod-user:prod-pass@prod-host:5432/courseforge_prod
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
OPENAI_API_KEY=sk-...
```

## Platform-Specific Setup

### Vercel Environment Variables
1. Go to your project dashboard
2. Click on "Settings" → "Environment Variables"
3. Add variables for each environment:
   - Production
   - Preview
   - Development

### GitHub Actions Secrets
1. Go to your repository settings
2. Click on "Secrets and variables" → "Actions"
3. Add repository secrets for:
   - `DATABASE_URL`
   - `STRIPE_SECRET_KEY`
   - `OPENAI_API_KEY`
   - `NEXTAUTH_SECRET`

### Local Development
1. Copy `.env.example` to `.env.local`
2. Fill in your development values
3. Never commit `.env.local` to git

## Variable Descriptions

### NEXTAUTH_URL
- **Description**: The canonical URL of your app
- **Development**: `http://localhost:3000`
- **Production**: `https://your-domain.com`
- **Required**: Yes

### NEXTAUTH_SECRET
- **Description**: Used to encrypt NextAuth.js tokens
- **Development**: Any 32+ character string
- **Production**: Use a secure random generator
- **Required**: Yes

### DATABASE_URL
- **Description**: PostgreSQL connection string
- **Development**: Local PostgreSQL instance
- **Production**: Managed PostgreSQL service (Supabase, Neon, etc.)
- **Required**: Yes

### Stripe Keys
- **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**: Client-side Stripe key (starts with `pk_`)
- **STRIPE_SECRET_KEY**: Server-side Stripe key (starts with `sk_`)
- **STRIPE_WEBHOOK_SECRET**: Used for webhook verification (starts with `whsec_`)
- **Required**: Yes (for payment features)

### OPENAI_API_KEY
- **Description**: API key for OpenAI services
- **Development**: Your development API key
- **Production**: Your production API key
- **Required**: Yes (for AI features)

## Migration Guide

### From Committed .env Files
1. Remove `.env` files from git: `git rm --cached .env.*`
2. Add to `.gitignore`
3. Set up environment variables on your hosting platform
4. Test deployment

### Rotating Secrets
1. Generate new keys in respective dashboards
2. Update environment variables on hosting platform
3. Redeploy application
4. Verify functionality
5. Revoke old keys

## Troubleshooting

### Common Issues

1. **"Missing environment variable" errors**
   - Check that all required variables are set
   - Verify variable names match exactly
   - Check for typos

2. **Database connection issues**
   - Verify DATABASE_URL format
   - Check network connectivity
   - Ensure database is running

3. **Stripe webhook failures**
   - Verify STRIPE_WEBHOOK_SECRET
   - Check webhook endpoint URL
   - Ensure proper webhook configuration

4. **NextAuth issues**
   - Verify NEXTAUTH_URL matches your domain
   - Check NEXTAUTH_SECRET is set
   - Ensure cookie settings are correct

### Debug Commands
```bash
# Check which variables are loaded (development)
node -e "console.log(process.env)"

# Verify database connection
npx prisma db push

# Test Stripe connection
npm run test:stripe

# Check NextAuth configuration
npm run dev
```

## Security Checklist

- [ ] All sensitive data is in environment variables
- [ ] No `.env` files are committed to git
- [ ] Production keys are different from development
- [ ] Keys are rotated regularly
- [ ] Access to production environment variables is restricted
- [ ] Environment variables are backed up securely
- [ ] Monitoring is set up for key usage

## Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Stripe Security Best Practices](https://stripe.com/docs/security)
- [NextAuth.js Configuration](https://next-auth.js.org/configuration/options)