#!/usr/bin/env node

// Script to create Stripe products and prices for CourseForge AI
require('dotenv').config({ path: '.env.local' })

const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

async function createProducts() {
  console.log('🎯 Creating Stripe Products for CourseForge AI...')
  console.log('==============================================')

  try {
    // 1. Create Starter Plan Product
    console.log('\n1️⃣ Creating Starter Plan Product...')
    const starterProduct = await stripe.products.create({
      name: 'CourseForge AI - Starter',
      description: 'Perfect for individual creators getting started with AI-powered course creation',
      metadata: {
        plan_type: 'starter',
        features: '5 courses/month,Basic templates,Standard support,PDF export'
      }
    })
    console.log('✅ Starter product created:', starterProduct.id)

    // 2. Create Starter Plan Price
    console.log('\n2️⃣ Creating Starter Plan Price...')
    const starterPrice = await stripe.prices.create({
      product: starterProduct.id,
      unit_amount: 1500, // $15.00 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
        interval_count: 1
      },
      metadata: {
        plan_type: 'starter',
        display_name: 'Starter Plan'
      }
    })
    console.log('✅ Starter price created:', starterPrice.id)

    // 3. Create Pro Plan Product
    console.log('\n3️⃣ Creating Pro Plan Product...')
    const proProduct = await stripe.products.create({
      name: 'CourseForge AI - Pro',
      description: 'For serious course creators and small teams with advanced features',
      metadata: {
        plan_type: 'pro',
        features: 'Unlimited courses,Advanced templates,Priority support,All export formats,Custom branding,Analytics dashboard'
      }
    })
    console.log('✅ Pro product created:', proProduct.id)

    // 4. Create Pro Plan Price
    console.log('\n4️⃣ Creating Pro Plan Price...')
    const proPrice = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 4900, // $49.00 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
        interval_count: 1
      },
      metadata: {
        plan_type: 'pro',
        display_name: 'Pro Plan'
      }
    })
    console.log('✅ Pro price created:', proPrice.id)

    // 5. Create Business Plan Product
    console.log('\n5️⃣ Creating Business Plan Product...')
    const businessProduct = await stripe.products.create({
      name: 'CourseForge AI - Business',
      description: 'Full-featured solution for businesses with advanced needs',
      metadata: {
        plan_type: 'business',
        features: 'Everything in Pro,API access,White-label solution,Custom integrations,Dedicated support,Team collaboration'
      }
    })
    console.log('✅ Business product created:', businessProduct.id)

    // 6. Create Business Plan Price
    console.log('\n6️⃣ Creating Business Plan Price...')
    const businessPrice = await stripe.prices.create({
      product: businessProduct.id,
      unit_amount: 7900, // $79.00 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
        interval_count: 1
      },
      metadata: {
        plan_type: 'business',
        display_name: 'Business Plan'
      }
    })
    console.log('✅ Business price created:', businessPrice.id)

    // 7. Create Enterprise placeholder (contact us)
    console.log('\n7️⃣ Creating Enterprise Product (Contact Us)...')
    const enterpriseProduct = await stripe.products.create({
      name: 'CourseForge AI - Enterprise',
      description: 'Custom solution for enterprise clients with special requirements',
      metadata: {
        plan_type: 'enterprise',
        pricing: 'custom',
        features: 'Everything in Business,Custom AI model training,On-premise deployment option,Custom SLA & support,Multi-tenant architecture'
      }
    })
    console.log('✅ Enterprise product created:', enterpriseProduct.id)

    // Summary
    console.log('\n🎉 All products and prices created successfully!')
    console.log('\n📋 Summary:')
    console.log('==========================================')
    console.log(`Starter Product ID: ${starterProduct.id}`)
    console.log(`Starter Price ID: ${starterPrice.id}`)
    console.log(`Pro Product ID: ${proProduct.id}`)
    console.log(`Pro Price ID: ${proPrice.id}`)
    console.log(`Business Product ID: ${businessProduct.id}`)
    console.log(`Business Price ID: ${businessPrice.id}`)
    console.log(`Enterprise Product ID: ${enterpriseProduct.id}`)
    console.log('==========================================')

    // Return the IDs for updating .env.local
    return {
      starter: {
        productId: starterProduct.id,
        priceId: starterPrice.id
      },
      pro: {
        productId: proProduct.id,
        priceId: proPrice.id
      },
      business: {
        productId: businessProduct.id,
        priceId: businessPrice.id
      },
      enterprise: {
        productId: enterpriseProduct.id
      }
    }

  } catch (error) {
    console.error('❌ Error creating products:', error.message)
    throw error
  }
}

// Update the stripe.ts file with actual IDs
async function updateStripeConfig(products) {
  console.log('\n🔄 Updating stripe.ts with actual product IDs...')
  
  const stripeConfigContent = `import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const PLANS = {
  STARTER: {
    name: 'Starter',
    price: 15,
    stripePriceId: "${products.starter.priceId}",
    stripeProductId: "${products.starter.productId}",
    features: [
      '3 AI-generated courses per month',
      'Basic course templates',
      'Standard video & text lessons',
      'Quiz generation',
      'PDF export',
      'Email support',
      'Basic analytics'
    ],
    limits: {
      coursesPerMonth: 3,
      modulesPerCourse: 5,
      lessonsPerModule: 7,
      videoMinutes: 60,
      storageGB: 5
    }
  },
  CREATOR: {
    name: 'Creator',
    price: 39,
    stripePriceId: "${products.pro.priceId}",
    stripeProductId: "${products.pro.productId}",
    features: [
      '15 AI-generated courses per month',
      'Advanced course templates',
      'All content formats (video, text, interactive)',
      'Advanced quiz & assessment tools',
      'Custom branding & white-label',
      'Priority support',
      'Advanced analytics dashboard',
      'Course collaboration tools',
      'Multiple export formats',
      'API access (rate-limited)'
    ],
    limits: {
      coursesPerMonth: 15,
      modulesPerCourse: 12,
      lessonsPerModule: 10,
      videoMinutes: 300,
      storageGB: 50
    }
  },
  BUSINESS: {
    name: 'Business',
    price: 79,
    stripePriceId: "${products.business.priceId}",
    stripeProductId: "${products.business.productId}",
    features: [
      'Unlimited AI-generated courses',
      'Premium templates & AI models',
      'All content formats + live sessions',
      'Advanced assessments & certifications',
      'Full white-label solution',
      'Dedicated account manager',
      'Advanced analytics & insights',
      'Team collaboration & roles',
      'All export formats + LMS integration',
      'Full API access'
    ],
    limits: {
      coursesPerMonth: -1, // unlimited
      modulesPerCourse: -1,
      lessonsPerModule: -1,
      videoMinutes: -1,
      storageGB: 500
    }
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 0, // Contact us pricing
    stripePriceId: 'contact_us',
    stripeProductId: "${products.enterprise.productId}",
    features: [
      'Everything in Business',
      'Unlimited everything',
      'Custom AI model training',
      'On-premise deployment option',
      'Custom SLA & support',
      'Advanced security & compliance',
      'Custom feature development',
      'Multi-tenant architecture',
      'Advanced analytics & reporting',
      'Custom integrations & workflows',
      'White-glove onboarding',
      '24/7 premium support'
    ],
    limits: {
      coursesPerMonth: -1,
      modulesPerCourse: -1,
      lessonsPerModule: -1,
      videoMinutes: -1,
      storageGB: -1
    }
  }
}

export type PlanType = keyof typeof PLANS

export async function createCheckoutSession(
  priceId: string,
  customerId?: string,
  metadata?: Record<string, string>
): Promise<Stripe.Checkout.Session> {
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
    success_url: \`\${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}\`,
    cancel_url: \`\${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true\`,
    automatic_tax: { enabled: true },
    metadata: metadata || {},
    allow_promotion_codes: true,
  })
  
  return session
}

export async function createCustomerPortalSession(
  customerId: string
): Promise<Stripe.BillingPortal.Session> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: \`\${process.env.NEXT_PUBLIC_APP_URL}/dashboard/account\`,
    configuration: {
      features: {
        subscription_update: {
          enabled: true,
          default_allowed_updates: ['price'],
          products: [
            {
              product: process.env.STRIPE_STARTER_PRODUCT_ID || '',
              prices: [process.env.STRIPE_STARTER_PRICE_ID || ''],
            },
            {
              product: process.env.STRIPE_CREATOR_PRODUCT_ID || '',
              prices: [process.env.STRIPE_CREATOR_PRICE_ID || ''],
            },
            {
              product: process.env.STRIPE_BUSINESS_PRODUCT_ID || '',
              prices: [process.env.STRIPE_BUSINESS_PRICE_ID || ''],
            },
          ],
        },
        subscription_cancel: {
          enabled: true,
          mode: 'immediately',
        },
        payment_method_update: {
          enabled: true,
        },
      },
    },
  })
  
  return session
}

export async function getSubscriptionStatus(customerId: string) {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 10,
      expand: ['data.default_payment_method'],
    })

    const activeSubscription = subscriptions.data.find(
      sub => sub.status === 'active'
    )

    if (!activeSubscription) {
      return null
    }

    // Get the plan details
    const priceId = activeSubscription.items.data[0]?.price?.id
    let planType: PlanType | null = null

    for (const [key, plan] of Object.entries(PLANS)) {
      if (plan.stripePriceId === priceId) {
        planType = key as PlanType
        break
      }
    }

    return {
      subscription: activeSubscription,
      planType,
      currentPeriodEnd: activeSubscription.current_period_end,
      cancelAtPeriodEnd: activeSubscription.cancel_at_period_end,
    }
  } catch (error) {
    console.error('Error getting subscription status:', error)
    return null
  }
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })
    return subscription
  } catch (error) {
    console.error('Error canceling subscription:', error)
    throw error
  }
}

export async function reactivateSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    })
    return subscription
  } catch (error) {
    console.error('Error reactivating subscription:', error)
    throw error
  }
}

export async function updateSubscriptionPlan(
  subscriptionId: string,
  newPriceId: string
) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [{
        id: subscription.items.data[0].id,
        price: newPriceId,
      }],
      proration_behavior: 'create_prorations',
    })
    
    return updatedSubscription
  } catch (error) {
    console.error('Error updating subscription plan:', error)
    throw error
  }
}

export async function createOrUpdateCustomer(
  email: string,
  metadata?: Record<string, string>
): Promise<Stripe.Customer> {
  try {
    // Check if customer already exists
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    })

    if (existingCustomers.data.length > 0) {
      // Update existing customer
      const customer = await stripe.customers.update(
        existingCustomers.data[0].id,
        {
          metadata: metadata || {},
        }
      )
      return customer
    } else {
      // Create new customer
      const customer = await stripe.customers.create({
        email: email,
        metadata: metadata || {},
      })
      return customer
    }
  } catch (error) {
    console.error('Error creating/updating customer:', error)
    throw error
  }
}

export function getPlanByPriceId(priceId: string): typeof PLANS[PlanType] | null {
  for (const [key, plan] of Object.entries(PLANS)) {
    if (plan.stripePriceId === priceId) {
      return plan
    }
  }
  return null
}

export function canAccessFeature(
  planType: PlanType,
  feature: string
): boolean {
  const plan = PLANS[planType]
  if (!plan) return false

  // Check if feature is in plan features
  return plan.features.some(f => f.toLowerCase().includes(feature.toLowerCase()))
}

export function checkPlanLimits(
  planType: PlanType,
  currentUsage: {
    coursesThisMonth?: number
    totalCourses?: number
    videoMinutesUsed?: number
    storageUsedGB?: number
  }
): {
  canCreateCourse: boolean
  canUploadVideo: boolean
  canAddMoreContent: boolean
  limits: typeof PLANS[PlanType]['limits']
} {
  const plan = PLANS[planType]
  if (!plan) {
    return {
      canCreateCourse: false,
      canUploadVideo: false,
      canAddMoreContent: false,
      limits: PLANS.STARTER.limits
    }
  }

  const limits = plan.limits

  // Check course creation limits
  const canCreateCourse = limits.coursesPerMonth === -1 || 
    (currentUsage.coursesThisMonth || 0) < limits.coursesPerMonth

  // Check video upload limits
  const canUploadVideo = limits.videoMinutes === -1 || 
    (currentUsage.videoMinutesUsed || 0) < limits.videoMinutes

  // Check storage limits
  const canAddMoreContent = limits.storageGB === -1 || 
    (currentUsage.storageUsedGB || 0) < limits.storageGB

  return {
    canCreateCourse,
    canUploadVideo,
    canAddMoreContent,
    limits
  }
}
`

  console.log('✅ stripe.ts file updated with actual product IDs')
  
  // Write the updated config
  const fs = require('fs')
  const path = require('path')
  fs.writeFileSync(path.join(__dirname, 'src/lib/stripe.ts'), stripeConfigContent)
  
  console.log('✅ stripe.ts file saved with new configuration')
}

// Main function
async function main() {
  try {
    console.log('🚀 Starting Stripe product creation...')
    
    const products = await createProducts()
    await updateStripeConfig(products)
    
    console.log('\n🎉 All done! Your Stripe integration is now set up with actual products.')
    console.log('\nNext steps:')
    console.log('1. Update your .env.local file with the new price IDs')
    console.log('2. Run: npm run dev')
    console.log('3. Visit: http://localhost:3001/pricing')
    console.log('4. Test the complete subscription flow!')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

module.exports = { createProducts, updateStripeConfig }