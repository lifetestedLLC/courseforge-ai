#!/usr/bin/env node

// Simple Stripe integration test script
require('dotenv').config()

const { runFullStripeTest } = require('./src/lib/stripe-test')

console.log('🧪 CourseForge AI - Stripe Integration Test')
console.log('==========================================')

async function main() {
  try {
    // Check if Stripe secret key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY not found in environment variables')
      console.log('Please add your Stripe secret key to .env.local')
      process.exit(1)
    }

    console.log('✅ Stripe secret key found')
    
    // Run the full test suite
    await runFullStripeTest()
    
    console.log('\n🎉 Stripe integration test completed successfully!')
    console.log('\nNext steps:')
    console.log('1. Check the test results above')
    console.log('2. Fix any issues that were reported')
    console.log('3. Test the actual subscription flow in your app')
    console.log('4. Go to http://localhost:3000/pricing to test the UI')
    
  } catch (error) {
    console.error('\n❌ Test failed:', error)
    process.exit(1)
  }
}

main().catch(console.error)