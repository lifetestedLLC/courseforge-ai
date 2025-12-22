import Stripe from 'stripe'

// Test utility for Stripe integration
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function testStripeConnection(): Promise<boolean> {
  try {
    const balance = await stripe.balance.retrieve()
    console.log('✅ Stripe connection successful')
    console.log('Available balance:', balance.available)
    return true
  } catch (error) {
    console.error('❌ Stripe connection failed:', error)
    return false
  }
}

export async function verifyPriceIds(): Promise<{
  valid: string[]
  invalid: string[]
}> {
  const priceIds = [
    process.env.STRIPE_STARTER_PRICE_ID,
    process.env.STRIPE_CREATOR_PRICE_ID,
    process.env.STRIPE_BUSINESS_PRICE_ID,
  ].filter(Boolean) as string[]

  const results = {
    valid: [] as string[],
    invalid: [] as string[],
  }

  for (const priceId of priceIds) {
    try {
      const price = await stripe.prices.retrieve(priceId)
      if (price.active) {
        console.log(`✅ Price ID ${priceId} is valid and active`)
        results.valid.push(priceId)
      } else {
        console.log(`⚠️ Price ID ${priceId} exists but is not active`)
        results.invalid.push(priceId)
      }
    } catch (error) {
      console.error(`❌ Price ID ${priceId} is invalid:`, error)
      results.invalid.push(priceId)
    }
  }

  return results
}

export async function createTestCustomer(email: string): Promise<string | null> {
  try {
    const customer = await stripe.customers.create({
      email,
      description: 'Test customer for CourseForge AI',
      metadata: {
        testCustomer: 'true',
        createdAt: new Date().toISOString(),
      },
    })
    
    console.log(`✅ Test customer created: ${customer.id}`)
    return customer.id
  } catch (error) {
    console.error('❌ Failed to create test customer:', error)
    return null
  }
}

export async function createTestCheckoutSession(
  priceId: string,
  customerEmail: string
): Promise<string | null> {
  try {
    // First create or get customer
    let customerId: string
    const existingCustomers = await stripe.customers.list({
      email: customerEmail,
      limit: 1,
    })

    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id
    } else {
      const customer = await stripe.customers.create({
        email: customerEmail,
      })
      customerId = customer.id
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: 'http://localhost:3000/test-success',
      cancel_url: 'http://localhost:3000/test-cancel',
      metadata: {
        testSession: 'true',
      },
    })

    console.log(`✅ Test checkout session created: ${session.id}`)
    console.log(`🔗 Checkout URL: ${session.url}`)
    return session.url
  } catch (error) {
    console.error('❌ Failed to create test checkout session:', error)
    return null
  }
}

export async function getTestWebhookEvents(limit: number = 10): Promise<void> {
  try {
    const events = await stripe.events.list({
      limit,
      types: [
        'checkout.session.completed',
        'customer.subscription.created',
        'customer.subscription.updated',
        'invoice.payment_succeeded',
      ],
    })

    console.log(`📊 Last ${limit} webhook events:`)
    events.data.forEach((event, index) => {
      console.log(`${index + 1}. ${event.type} - ${new Date(event.created * 1000).toLocaleString()}`)
    })
  } catch (error) {
    console.error('❌ Failed to fetch webhook events:', error)
  }
}

export async function cleanupTestData(): Promise<void> {
  try {
    // Find test customers
    const testCustomers = await stripe.customers.list({
      limit: 100,
    })

    let deletedCount = 0
    for (const customer of testCustomers.data) {
      if (customer.metadata?.testCustomer === 'true') {
        try {
          await stripe.customers.del(customer.id)
          deletedCount++
        } catch (error) {
          console.error(`Failed to delete customer ${customer.id}:`, error)
        }
      }
    }

    console.log(`🧹 Cleaned up ${deletedCount} test customers`)
  } catch (error) {
    console.error('❌ Failed to cleanup test data:', error)
  }
}

export async function runFullStripeTest(): Promise<void> {
  console.log('🚀 Running full Stripe integration test...')
  
  // Test 1: Connection
  console.log('\n1️⃣ Testing Stripe connection...')
  const isConnected = await testStripeConnection()
  if (!isConnected) {
    console.log('❌ Stripe connection test failed. Stopping further tests.')
    return
  }
  
  // Test 2: Price IDs
  console.log('\n2️⃣ Verifying price IDs...')
  const priceVerification = await verifyPriceIds()
  console.log(`Valid prices: ${priceVerification.valid.length}`)
  console.log(`Invalid prices: ${priceVerification.invalid.length}`)
  
  // Test 3: Create test customer
  console.log('\n3️⃣ Creating test customer...')
  const testEmail = 'test@courseforge-ai.com'
  const customerId = await createTestCustomer(testEmail)
  
  // Test 4: Create test checkout session
  if (customerId && priceVerification.valid.length > 0) {
    console.log('\n4️⃣ Creating test checkout session...')
    const checkoutUrl = await createTestCheckoutSession(
      priceVerification.valid[0],
      testEmail
    )
    
    if (checkoutUrl) {
      console.log(`✅ Test checkout session ready! Visit: ${checkoutUrl}`)
    }
  }
  
  // Test 5: Get recent webhook events
  console.log('\n5️⃣ Fetching recent webhook events...')
  await getTestWebhookEvents(5)
  
  console.log('\n✅ Full Stripe test completed!')
}

// Simple CLI interface
if (require.main === module) {
  (async () => {
    const command = process.argv[2]
    
    switch (command) {
      case 'test':
        await runFullStripeTest()
        break
      case 'connection':
        await testStripeConnection()
        break
      case 'prices':
        await verifyPriceIds()
        break
      case 'customer':
        const email = process.argv[3] || 'test@example.com'
        await createTestCustomer(email)
        break
      case 'checkout':
        const priceId = process.argv[3]
        const customerEmail = process.argv[4] || 'test@example.com'
        if (priceId) {
          await createTestCheckoutSession(priceId, customerEmail)
        } else {
          console.log('Usage: npm run stripe:checkout <price-id> [email]')
        }
        break
      case 'webhooks':
        await getTestWebhookEvents()
        break
      case 'cleanup':
        await cleanupTestData()
        break
      default:
        console.log(`
Usage: npm run stripe:<command>

Commands:
  test         - Run full Stripe integration test
  connection   - Test Stripe connection
  prices       - Verify all price IDs
  customer     - Create test customer
  checkout     - Create test checkout session
  webhooks     - Show recent webhook events
  cleanup      - Clean up test data
        `)
    }
    
    process.exit(0)
  })()
}