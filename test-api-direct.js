#!/usr/bin/env node

// Direct API test without UI components
require('dotenv').config({ path: '.env.local' })

const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

async function testAPIFunctions() {
  console.log('🧪 Testing Stripe API Functions Directly...')
  console.log('==============================================')

  try {
    // Test 1: Verify our actual price IDs
    console.log('\n1️⃣ Testing our actual price IDs...')
    
    const priceIds = [
      process.env.STRIPE_STARTER_PRICE_ID,
      process.env.STRIPE_CREATOR_PRICE_ID,
      process.env.STRIPE_BUSINESS_PRICE_ID
    ]
    
    console.log('Price IDs to test:')
    priceIds.forEach((id, index) => {
      console.log(`   ${['STARTER', 'CREATOR', 'BUSINESS'][index]}: ${id}`)
    })
    
    for (const priceId of priceIds) {
      try {
        const price = await stripe.prices.retrieve(priceId)
        console.log(`✅ ${priceId}: Valid and active`)
        console.log(`   Amount: $${(price.unit_amount / 100).toFixed(2)} ${price.currency.toUpperCase()}`)
        console.log(`   Product: ${price.product}`)
        console.log(`   Active: ${price.active}`)
      } catch (error) {
        console.log(`❌ ${priceId}: ${error.message}`)
      }
    }

    // Test 2: Create a test checkout session
    console.log('\n2️⃣ Testing checkout session creation...')
    
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: process.env.STRIPE_STARTER_PRICE_ID,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: 'http://localhost:3001/test-success',
        cancel_url: 'http://localhost:3001/test-cancel',
        customer_email: 'test@example.com',
        metadata: {
          test: 'true',
          userId: 'test-user-123'
        }
      })
      
      console.log('✅ Checkout session created successfully!')
      console.log(`   Session ID: ${session.id}`)
      console.log(`   Checkout URL: ${session.url}`)
      console.log(`   Status: ${session.status}`)
      
    } catch (error) {
      console.log('❌ Checkout session creation failed:', error.message)
    }

    // Test 3: Test customer creation
    console.log('\n3️⃣ Testing customer creation...')
    
    try {
      const customer = await stripe.customers.create({
        email: 'test-customer@example.com',
        metadata: {
          test: 'true',
          source: 'api-test'
        }
      })
      
      console.log('✅ Customer created successfully!')
      console.log(`   Customer ID: ${customer.id}`)
      console.log(`   Email: ${customer.email}`)
      
      // Clean up test customer
      await stripe.customers.del(customer.id)
      console.log('✅ Test customer cleaned up')
      
    } catch (error) {
      console.log('❌ Customer creation failed:', error.message)
    }

    // Test 4: Test subscription status function
    console.log('\n4️⃣ Testing subscription status function...')
    
    try {
      const { getSubscriptionStatus } = require('./src/lib/stripe')
      const status = await getSubscriptionStatus('cus_test123')
      
      if (status) {
        console.log('✅ Subscription status function working')
        console.log(`   Status: ${status.subscription.status}`)
      } else {
        console.log('✅ Subscription status function working (no active subscriptions)')
      }
      
    } catch (error) {
      console.log('❌ Subscription status function failed:', error.message)
    }

    console.log('\n🎉 All API tests completed!')
    
  } catch (error) {
    console.error('❌ API test failed:', error)
  }
}

// Test the pricing configuration
testAPIFunctions().then(() => {
  console.log('\n' + '='.repeat(60))
  console.log('🏁 API Test Complete!')
  console.log('='.repeat(60))
}).catch(console.error)