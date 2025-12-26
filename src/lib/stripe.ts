import Stripe from 'stripe'
import { StripeError, ValidationError, Logger } from './errors'

// Validate Stripe secret key
// In production, throw an error if not configured
// In development/build, use placeholder to allow build to succeed
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const isProduction = process.env.NODE_ENV === 'production'

if (!stripeSecretKey) {
  if (isProduction && typeof window === 'undefined') {
    throw new Error('STRIPE_SECRET_KEY must be configured in production environment')
  }
  if (typeof window === 'undefined') {
    Logger.warn('STRIPE_SECRET_KEY is not configured - Stripe functionality will be limited')
  }
}

export const stripe = new Stripe(stripeSecretKey || 'sk_test_placeholder', {
  apiVersion: '2023-10-16',
  typescript: true,
  maxNetworkRetries: 3, // Add retry logic for network failures
})

// Validate required environment variables
const requiredEnvVars = [
  'STRIPE_STARTER_PRICE_ID',
  'STRIPE_CREATOR_PRICE_ID', 
  'STRIPE_BUSINESS_PRICE_ID',
  'STRIPE_STARTER_PRODUCT_ID',
  'STRIPE_CREATOR_PRODUCT_ID',
  'STRIPE_BUSINESS_PRODUCT_ID',
] as const

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    Logger.warn(`Missing environment variable: ${varName}`)
  }
})

export const PLANS = {
  STARTER: {
    name: 'Starter',
    price: 15,
    stripePriceId: "price_1SgcE7KP7GHTwvjSYuNuC9gw",
    stripeProductId: "prod_Tdu2vhhHTCqNbi",
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
    stripePriceId: "price_1SgcE8KP7GHTwvjS6KWJ7CGv",
    stripeProductId: "prod_Tdu2gihEKGs5xS",
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
    stripePriceId: "price_1SgcE9KP7GHTwvjSnHQgGptY",
    stripeProductId: "prod_Tdu22UPBiSxnat",
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
    stripeProductId: "prod_Tdu2LnPA46kQqZ",
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
  try {
    if (!priceId) {
      throw new ValidationError('Price ID is required')
    }

    // Validate price ID format
    if (!priceId.startsWith('price_')) {
      Logger.warn(`Invalid price ID format: ${priceId}`)
    }

    const sessionData: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      automatic_tax: { enabled: true },
      metadata: metadata || {},
      allow_promotion_codes: true,
    }

    if (customerId) {
      sessionData.customer = customerId
    }

    Logger.info('Creating checkout session', { priceId, customerId: customerId || 'new' })
    
    const session = await stripe.checkout.sessions.create(sessionData)
    
    Logger.info('Checkout session created', { sessionId: session.id, customerId: session.customer })
    
    return session
  } catch (error) {
    Logger.error('Failed to create checkout session', error, { priceId, customerId })
    
    if (error instanceof Stripe.errors.StripeError) {
      throw new StripeError(`Stripe error: ${error.message}`, error.code)
    }
    
    throw error
  }
}

export async function createCustomerPortalSession(
  customerId: string
): Promise<Stripe.BillingPortal.Session> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/account`,
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
