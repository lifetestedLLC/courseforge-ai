#!/usr/bin/env node

// Setup validation script for CourseForge AI
require('dotenv').config({ path: '.env.local' })

console.log('🧪 CourseForge AI - Setup Validation')
console.log('=====================================')

async function validateSetup() {
  let allGood = true
  
  // 1. Check environment variables
  console.log('\n1️⃣ Checking Environment Variables...')
  
  const requiredVars = [
    'DATABASE_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'OPENAI_API_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'NEXT_PUBLIC_APP_URL'
  ]
  
  requiredVars.forEach(varName => {
    const value = process.env[varName]
    console.log(`   ${varName}: ${value ? '✅ Set' : '❌ Missing'}`)
    if (!value) allGood = false
  })
  
  // 2. Validate Stripe configuration
  console.log('\n2️⃣ Validating Stripe Configuration...')
  
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (stripeKey) {
    if (!stripeKey.startsWith('sk_')) {
      console.log('   ❌ STRIPE_SECRET_KEY must start with "sk_"')
      allGood = false
    } else {
      console.log('   ✅ STRIPE_SECRET_KEY format is valid')
    }
  }
  
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (webhookSecret && webhookSecret === 'whsec_your_webhook_secret_here') {
    console.log('   ❌ STRIPE_WEBHOOK_SECRET is using placeholder value')
    allGood = false
  } else if (webhookSecret) {
    console.log('   ✅ STRIPE_WEBHOOK_SECRET is configured')
  }
  
  // 3. Test Stripe connection
  console.log('\n3️⃣ Testing Stripe Connection...')
  
  if (stripeKey) {
    try {
      const Stripe = require('stripe')
      const stripe = new Stripe(stripeKey, {
        apiVersion: '2024-12-18.acacia',
      })
      
      const balance = await stripe.balance.retrieve()
      console.log(`   ✅ Stripe connection successful (${balance.livemode ? 'LIVE' : 'TEST'} mode)`)
      console.log(`   💰 Available balance: ${balance.available[0]?.amount || 0} ${balance.available[0]?.currency || 'usd'}`)
    } catch (error) {
      console.log(`   ❌ Stripe connection failed: ${error.message}`)
      allGood = false
    }
  } else {
    console.log('   ⚠️  Cannot test Stripe connection - no secret key')
  }
  
  // 4. Check price IDs
  console.log('\n4️⃣ Checking Stripe Price IDs...')
  
  const priceIds = [
    'STRIPE_STARTER_PRICE_ID',
    'STRIPE_CREATOR_PRICE_ID',
    'STRIPE_BUSINESS_PRICE_ID'
  ]
  
  priceIds.forEach(varName => {
    const value = process.env[varName]
    console.log(`   ${varName}: ${value ? '✅ Set' : '❌ Missing'}`)
    if (value && !value.startsWith('price_')) {
      console.log(`   ⚠️  Warning: ${varName} should start with "price_"`)
    }
  })
  
  // 5. Check NextAuth configuration
  console.log('\n5️⃣ Checking NextAuth Configuration...')
  
  const nextAuthSecret = process.env.NEXTAUTH_SECRET
  if (nextAuthSecret) {
    if (nextAuthSecret.length < 32) {
      console.log('   ⚠️  Warning: NEXTAUTH_SECRET should be at least 32 characters for security')
    } else if (nextAuthSecret === 'your-nextauth-secret-here') {
      console.log('   ❌ NEXTAUTH_SECRET is using default value - please change it')
      allGood = false
    } else {
      console.log('   ✅ NEXTAUTH_SECRET is properly configured')
    }
  }
  
  const nextAuthUrl = process.env.NEXTAUTH_URL
  if (nextAuthUrl) {
    try {
      new URL(nextAuthUrl)
      console.log('   ✅ NEXTAUTH_URL is valid')
    } catch {
      console.log('   ❌ NEXTAUTH_URL is not a valid URL')
      allGood = false
    }
  }
  
  // 6. Check OpenAI API key
  console.log('\n6️⃣ Checking OpenAI Configuration...')
  
  const openaiKey = process.env.OPENAI_API_KEY
  if (openaiKey) {
    if (openaiKey.startsWith('sk-')) {
      console.log('   ✅ OpenAI API key format is valid')
    } else {
      console.log('   ⚠️  Warning: OpenAI API key should start with "sk-"')
    }
  } else {
    console.log('   ❌ OpenAI API key is missing')
  }
  
  // 7. Final summary
  console.log('\n' + '='.repeat(50))
  if (allGood) {
    console.log('🎉 Setup validation completed successfully!')
    console.log('\nNext steps:')
    console.log('1. Create your Stripe products and prices in the Stripe Dashboard')
    console.log('2. Set up webhook endpoints in Stripe')
    console.log('3. Run: npm run dev')
    console.log('4. Test the complete user flow')
  } else {
    console.log('❌ Setup validation failed. Please fix the issues above.')
    process.exit(1)
  }
  console.log('='.repeat(50))
}

// Run validation
validateSetup().catch(console.error)