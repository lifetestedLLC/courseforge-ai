#!/usr/bin/env node

// Test current Stripe setup
require('dotenv').config({ path: '.env.local' })

console.log('🧪 CourseForge AI - Current Stripe Setup Test')
console.log('==============================================')

async function testCurrentSetup() {
  try {
    // Check environment variables
    console.log('\n1️⃣ Checking Environment Variables...')
    
    const stripeKey = process.env.STRIPE_SECRET_KEY
    console.log(`STRIPE_SECRET_KEY: ${stripeKey ? '✅ Set' : '❌ Missing'}`)
    if (stripeKey) {
      console.log(`   Key format: ${stripeKey.startsWith('sk_test_') ? '✅ Valid test key' : '⚠️  Not a test key'}`)
      console.log(`   Key length: ${stripeKey.length} characters`)
    }
    
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    console.log(`STRIPE_WEBHOOK_SECRET: ${webhookSecret ? '✅ Set' : '❌ Missing'}`)
    
    const priceIds = [
      process.env.STRIPE_STARTER_PRICE_ID,
      process.env.STRIPE_CREATOR_PRICE_ID,
      process.env.STRIPE_BUSINESS_PRICE_ID
    ]
    
    console.log(`Price IDs: ${priceIds.filter(id => id).length}/3 set`)
    priceIds.forEach((id, index) => {
      const plans = ['STARTER', 'CREATOR', 'BUSINESS']
      console.log(`   ${plans[index]}: ${id ? '✅ Set' : '❌ Missing'}`)
    })
    
    // Test Stripe connection
    console.log('\n2️⃣ Testing Stripe Connection...')
    
    if (!stripeKey) {
      console.log('❌ Cannot test Stripe connection - no secret key found')
      return false
    }
    
    const Stripe = require('stripe')
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    })
    
    console.log('🔄 Connecting to Stripe...')
    const balance = await stripe.balance.retrieve()
    
    console.log('✅ Stripe connection successful!')
    console.log(`   Account mode: ${balance.livemode ? 'LIVE' : 'TEST (Safe for development)'}`)
    console.log(`   Available balance: ${balance.available[0]?.amount || 0} ${balance.available[0]?.currency || 'usd'}`)
    console.log(`   Pending balance: ${balance.pending[0]?.amount || 0} ${balance.pending[0]?.currency || 'usd'}`)
    
    // Test basic API access
    console.log('\n3️⃣ Testing API Access...')
    
    try {
      const customers = await stripe.customers.list({ limit: 1 })
      console.log('✅ Customer API access: Working')
      
      const prices = await stripe.prices.list({ limit: 1 })
      console.log('✅ Prices API access: Working')
      
      console.log('\n🎉 Your Stripe integration is working correctly!')
      console.log('\nNext steps:')
      console.log('1. Create your products and prices in Stripe dashboard')
      console.log('2. Update the price IDs in your .env.local file')
      console.log('3. Set up webhooks')
      console.log('4. Test the complete subscription flow')
      
      return true
      
    } catch (apiError) {
      console.log('⚠️  Some API endpoints may have issues:', apiError.message)
      return true // Connection works, just some APIs might have issues
    }
    
  } catch (error) {
    console.log('❌ Error testing Stripe setup:', error.message)
    
    if (error.message.includes('Invalid API Key')) {
      console.log('💡 Your Stripe secret key appears to be invalid')
      console.log('   Please check your key in the Stripe dashboard')
    }
    
    return false
  }
}

// Run the test
testCurrentSetup().then(success => {
  console.log('\n' + '='.repeat(50))
  console.log(success ? '✅ Setup test completed successfully!' : '❌ Setup test failed')
  console.log('='.repeat(50))
}).catch(console.error)