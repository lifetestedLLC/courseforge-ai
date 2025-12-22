#!/usr/bin/env node

// Complete integration test for CourseForge AI
require('dotenv').config({ path: '.env.local' })

const fetch = require('node-fetch')

console.log('🧪 CourseForge AI - Complete Integration Test')
console.log('==============================================')

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

async function testCompleteFlow() {
  let testsPassed = 0
  let totalTests = 0

  function runTest(testName, testFn) {
    return new Promise(async (resolve) => {
      totalTests++
      try {
        console.log(`\n📋 Testing: ${testName}`)
        await testFn()
        console.log(`   ✅ PASSED`)
        testsPassed++
        resolve(true)
      } catch (error) {
        console.log(`   ❌ FAILED: ${error.message}`)
        resolve(false)
      }
    })
  }

  // Test 1: Check if the app is running
  await runTest('Application is accessible', async () => {
    const response = await fetch(BASE_URL)
    if (!response.ok) {
      throw new Error(`Application returned ${response.status}`)
    }
  })

  // Test 2: Test Stripe connection
  await runTest('Stripe connection', async () => {
    const Stripe = require('stripe')
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    })
    
    const balance = await stripe.balance.retrieve()
    if (!balance) {
      throw new Error('Could not retrieve Stripe balance')
    }
  })

  // Test 3: Validate price IDs exist
  await runTest('Stripe price IDs are valid', async () => {
    const Stripe = require('stripe')
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    })

    const priceIds = [
      process.env.STRIPE_STARTER_PRICE_ID,
      process.env.STRIPE_CREATOR_PRICE_ID,
      process.env.STRIPE_BUSINESS_PRICE_ID
    ]

    for (const priceId of priceIds) {
      try {
        const price = await stripe.prices.retrieve(priceId)
        if (!price.active) {
          throw new Error(`Price ${priceId} is not active`)
        }
      } catch (error) {
        throw new Error(`Price ID ${priceId} is invalid: ${error.message}`)
      }
    }
  })

  // Test 4: Test webhook endpoint is accessible
  await runTest('Webhook endpoint', async () => {
    const response = await fetch(`${BASE_URL}/api/stripe/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ test: true })
    })
    
    // Should return 400 (bad request) since we didn't send a valid webhook
    if (response.status !== 400) {
      throw new Error(`Expected 400, got ${response.status}`)
    }
  })

  // Test 5: Test checkout endpoint
  await runTest('Checkout endpoint', async () => {
    const response = await fetch(`${BASE_URL}/api/stripe/checkout?plan=STARTER`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    // Should return 401 since we're not authenticated
    if (response.status !== 401) {
      throw new Error(`Expected 401, got ${response.status}`)
    }
  })

  // Test 6: Test database connection
  await runTest('Database connection', async () => {
    try {
      const { PrismaClient } = require('@prisma/client')
      const prisma = new PrismaClient()
      
      await prisma.$queryRaw`SELECT 1`
      await prisma.$disconnect()
    } catch (error) {
      throw new Error(`Database connection failed: ${error.message}`)
    }
  })

  // Test 7: Test environment variables
  await runTest('Environment variables', async () => {
    const requiredVars = [
      'DATABASE_URL',
      'NEXTAUTH_URL',
      'NEXTAUTH_SECRET',
      'OPENAI_API_KEY',
      'STRIPE_SECRET_KEY',
      'STRIPE_WEBHOOK_SECRET',
      'NEXT_PUBLIC_APP_URL'
    ]

    const missing = requiredVars.filter(varName => !process.env[varName])
    if (missing.length > 0) {
      throw new Error(`Missing environment variables: ${missing.join(', ')}`)
    }
  })

  // Test 8: Test subscription API endpoints
  await runTest('Subscription API endpoints', async () => {
    // These should return 401 since we're not authenticated
    const endpoints = [
      '/api/user/subscription',
      '/api/user/stats'
    ]

    for (const endpoint of endpoints) {
      const response = await fetch(`${BASE_URL}${endpoint}`)
      if (response.status !== 401) {
        throw new Error(`Expected 401 for ${endpoint}, got ${response.status}`)
      }
    }
  })

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log(`📊 Test Results: ${testsPassed}/${totalTests} passed`)
  
  if (testsPassed === totalTests) {
    console.log('🎉 All tests passed! Your setup looks good.')
    console.log('\nNext steps:')
    console.log('1. Start your development server: npm run dev')
    console.log('2. Test the authentication flow')
    console.log('3. Test the subscription flow')
    console.log('4. Set up Stripe webhooks for production')
  } else {
    console.log(`❌ ${totalTests - testsPassed} test(s) failed. Please fix the issues above.`)
    process.exit(1)
  }
  console.log('='.repeat(50))
}

// Check if we should run the test
if (require.main === module) {
  // Check if the app is running first
  fetch(BASE_URL)
    .then(() => testCompleteFlow())
    .catch(error => {
      console.error(`❌ Cannot connect to ${BASE_URL}. Make sure your development server is running.`)
      console.error('Run: npm run dev')
      process.exit(1)
    })
}

module.exports = { testCompleteFlow }