#!/usr/bin/env node

// Simple Stripe connection test
require('dotenv').config()

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

console.log('🧪 CourseForge AI - Stripe Integration Test')
console.log('==========================================')

async function testStripeConnection() {
  try {
    if (!STRIPE_SECRET_KEY) {
      console.log('❌ STRIPE_SECRET_KEY not found in environment variables')
      console.log('Please add STRIPE_SECRET_KEY to your .env.local file')
      return false
    }

    console.log('✅ STRIPE_SECRET_KEY found')
    
    // Test if the key format is correct
    if (!STRIPE_SECRET_KEY.startsWith('sk_test_') && !STRIPE_SECRET_KEY.startsWith('sk_live_')) {
      console.log('⚠️  Warning: Stripe key doesn\'t start with expected prefix')
      console.log('   Test keys start with: sk_test_')
      console.log('   Live keys start with: sk_live_')
    }

    // Test basic Stripe connection
    const Stripe = require('stripe')
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    })

    console.log('🔄 Testing Stripe connection...')
    
    try {
      const balance = await stripe.balance.retrieve()
      console.log('✅ Stripe connection successful!')
      console.log('📊 Account Info:')
      console.log(`   - Live mode: ${balance.livemode ? 'Yes' : 'No (Test mode)'}`)
      console.log(`   - Available balance: ${balance.available[0]?.amount || 0} ${balance.available[0]?.currency || 'usd'}`)
      console.log(`   - Pending balance: ${balance.pending[0]?.amount || 0} ${balance.pending[0]?.currency || 'usd'}`)
      return true
    } catch (stripeError) {
      console.log('❌ Stripe connection failed:', stripeError.message)
      
      if (stripeError.message.includes('Invalid API Key')) {
        console.log('💡 Make sure your STRIPE_SECRET_KEY is correct')
        console.log('   Get your keys from: https://dashboard.stripe.com/apikeys')
      }
      
      return false
    }
    
  } catch (error) {
    console.log('❌ Error testing Stripe connection:', error.message)
    return false
  }
}

async function testEnvironmentVariables() {
  console.log('\n🔍 Checking environment variables...')
  
  const requiredVars = [
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'STRIPE_STARTER_PRICE_ID',
    'STRIPE_CREATOR_PRICE_ID',
    'STRIPE_BUSINESS_PRICE_ID',
    'NEXT_PUBLIC_APP_URL'
  ]
  
  const missing = requiredVars.filter(key => !process.env[key])
  const present = requiredVars.filter(key => process.env[key])
  
  console.log(`✅ Present: ${present.length}/${requiredVars.length}`)
  console.log(`❌ Missing: ${missing.length}/${requiredVars.length}`)
  
  if (missing.length > 0) {
    console.log('\n   Missing variables:')
    missing.forEach(key => console.log(`   - ${key}`))
  }
  
  if (present.length > 0) {
    console.log('\n   Present variables:')
    present.forEach(key => {
      const value = process.env[key]
      const masked = key.includes('SECRET') || key.includes('KEY') 
        ? value.substring(0, 10) + '...' 
        : value
      console.log(`   - ${key}: ${masked}`)
    })
  }
  
  return missing.length === 0
}

async function main() {
  console.log('\n1️⃣ Testing Environment Variables...')
  const envOk = await testEnvironmentVariables()
  
  console.log('\n2️⃣ Testing Stripe Connection...')
  const stripeOk = await testStripeConnection()
  
  console.log('\n📋 Test Results:')
  console.log(`   Environment: ${envOk ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`   Stripe Connection: ${stripeOk ? '✅ PASS' : '❌ FAIL'}`)
  
  if (envOk && stripeOk) {
    console.log('\n🎉 All tests passed! Your Stripe integration is ready.')
    console.log('\nNext steps:')
    console.log('1. Create your Stripe products and prices')
    console.log('2. Set up webhooks')
    console.log('3. Test the complete subscription flow')
    console.log('4. Visit http://localhost:3000/pricing')
  } else {
    console.log('\n❌ Some tests failed. Please fix the issues above.')
    console.log('\nTroubleshooting:')
    if (!envOk) {
      console.log('- Add missing environment variables to .env.local')
    }
    if (!stripeOk) {
      console.log('- Verify your Stripe secret key')
      console.log('- Check your internet connection')
      console.log('- Make sure Stripe is accessible')
    }
  }
}

// Check if we have the stripe package
main().catch(error => {
  if (error.code === 'MODULE_NOT_FOUND' && error.message.includes('stripe')) {
    console.log('❌ Stripe package not found')
    console.log('Please run: npm install stripe')
  } else {
    console.error('❌ Unexpected error:', error)
  }
  process.exit(1)
})