# GitHub Actions Secrets Setup Guide

## Overview
This guide explains how to set up GitHub Actions secrets for automated testing and deployment of CourseForge AI.

## Required Secrets for CI/CD

### Core Application Secrets
```bash
DATABASE_URL              # PostgreSQL connection string
NEXTAUTH_SECRET          # NextAuth encryption secret
OPENAI_API_KEY           # OpenAI API key
```

### Stripe Secrets
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  # Stripe publishable key
STRIPE_SECRET_KEY                    # Stripe secret key
STRIPE_WEBHOOK_SECRET               # Stripe webhook secret
```

### Deployment Secrets
```bash
VERCEL_TOKEN             # Vercel deployment token
VERCEL_ORG_ID           # Vercel organization ID
VERCEL_PROJECT_ID       # Vercel project ID
```

## Step-by-Step Setup

### 1. Access GitHub Repository Settings
1. Go to your repository: `https://github.com/lifetestedLLC/courseforge-ai`
2. Click on "Settings" tab
3. In the left sidebar, click on "Secrets and variables" → "Actions"
4. Click the "New repository secret" button

### 2. Add Core Application Secrets

#### DATABASE_URL
```bash
# For testing (use test database)
postgresql://test_user:test_pass@test_host:5432/courseforge_test

# Format: postgresql://username:password@host:port/database
```

#### NEXTAUTH_SECRET
```bash
# Generate with: openssl rand -base64 32
your-32-plus-character-secret-key-here
```

#### OPENAI_API_KEY
```bash
# Your OpenAI API key
sk-your-openai-api-key-here
```

### 3. Add Stripe Secrets

#### NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```bash
# Use test keys for CI/CD
pk_test_your_stripe_publishable_key_here
```

#### STRIPE_SECRET_KEY
```bash
# Use test keys for CI/CD
sk_test_your_stripe_secret_key_here
```

#### STRIPE_WEBHOOK_SECRET
```bash
# Test webhook secret
whsec_your_test_webhook_secret_here
```

### 4. Add Vercel Deployment Secrets

#### Get Vercel Token
1. Go to [Vercel Dashboard](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Name it "GitHub Actions CI/CD"
4. Copy the token and add as `VERCEL_TOKEN`

#### Get Vercel Organization ID
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Get your team/org ID
vercel teams list
```

#### Get Vercel Project ID
```bash
# In your project directory
vercel

# Or get it from Vercel dashboard URL
# https://vercel.com/[org]/[project]/settings
```

### 5. Complete Secret List

Add these secrets to your GitHub repository:

```bash
# Database
DATABASE_URL=postgresql://test_user:test_pass@test_host:5432/courseforge_test

# Authentication
NEXTAUTH_SECRET=your-generated-32-char-secret

# AI Integration
OPENAI_API_KEY=sk-your-openai-api-key

# Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# Deployment
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id
```

## Verification Steps

### 1. Test GitHub Actions Workflow
1. Go to "Actions" tab in your repository
2. Manually trigger a workflow run
3. Check the logs for any errors

### 2. Test Database Connection
The workflow should successfully:
- Connect to the test database
- Run migrations
- Execute tests

### 3. Test Stripe Integration
- Verify Stripe tests pass
- Check webhook handling
- Validate payment flows

### 4. Test Deployment
- Verify successful deployment to Vercel
- Check that environment variables are properly set
- Test production functionality

## Workflow Configuration

Your GitHub Actions workflows should reference these secrets like this:

```yaml
# Example from your CI workflow
- name: Run tests
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
    NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY }}
    STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
    STRIPE_WEBHOOK_SECRET: ${{ secrets.STRIPE_WEBHOOK_SECRET }}
  run: |
    npm run test
    npm run test:stripe
```

## Security Best Practices

### Secret Management
1. **Use test keys for CI/CD**: Always use test Stripe keys, not live keys
2. **Rotate secrets regularly**: Update secrets every 90 days
3. **Limit access**: Only give repository collaborators access to secrets
4. **Audit access**: Review who has access to secrets regularly

### Environment Separation
1. **Test Database**: Use a separate test database for CI/CD
2. **Test Keys**: Use test API keys for all services
3. **Isolated Testing**: Ensure tests don't affect production data

### Monitoring
1. **Check workflow logs**: Regularly review GitHub Actions logs
2. **Monitor API usage**: Keep track of API key usage
3. **Set up alerts**: Configure alerts for failed workflows

## Troubleshooting

### Common Issues

1. **"Secret not found" errors**
   - Verify secret names match exactly
   - Check that secrets are added to the correct repository
   - Ensure no typos in secret names

2. **Database connection failures**
   - Verify DATABASE_URL format
   - Check if test database is accessible from GitHub Actions
   - Ensure proper network configuration

3. **Stripe test failures**
   - Verify you're using test keys, not live keys
   - Check webhook configuration
   - Ensure proper test data setup

4. **Vercel deployment failures**
   - Verify VERCEL_TOKEN has proper permissions
   - Check VERCEL_ORG_ID and VERCEL_PROJECT_ID
   - Ensure Vercel project is properly configured

### Debug Steps

1. **Check workflow syntax**
   ```yaml
   - name: Debug secrets
     run: |
       echo "Checking if secrets are set"
       echo "DATABASE_URL: ${{ secrets.DATABASE_URL != '' }}"
       echo "NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET != '' }}"
   ```

2. **Test locally**
   ```bash
   # Set environment variables locally
   export DATABASE_URL="your-test-database-url"
   export NEXTAUTH_SECRET="your-test-secret"
   # ... other variables

   # Run tests
   npm test
   ```

3. **Check GitHub Actions logs**
   - Go to Actions tab in repository
   - Click on failed workflow run
   - Expand failed step to see detailed error

## Additional Resources

- [GitHub Actions Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Vercel GitHub Integration](https://vercel.com/docs/git/vercel-for-github)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [GitHub Actions Best Practices](https://docs.github.com/en/actions/learn-github-actions/security-hardening-for-github-actions)

## Next Steps

1. Add all required secrets to your repository
2. Test your workflows
3. Set up monitoring for failed runs
4. Document your secret rotation schedule
5. Train team members on secret management

For detailed environment variable descriptions, see [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md).
For Vercel-specific setup, see [VERCEL_ENV_SETUP.md](./VERCEL_ENV_SETUP.md).