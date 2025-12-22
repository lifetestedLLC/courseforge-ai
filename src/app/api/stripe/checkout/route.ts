import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { createCheckoutSession, createOrUpdateCustomer, PLANS } from '@/lib/stripe'
import { z } from 'zod'

const checkoutSchema = z.object({
  plan: z.enum(['STARTER', 'CREATOR', 'BUSINESS']),
  successUrl: z.string().optional(),
  cancelUrl: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    
    const searchParams = new URL(req.url).searchParams
    const plan = searchParams.get('plan') as keyof typeof PLANS
    
    if (!plan || !PLANS[plan]) {
      return new NextResponse('Invalid plan', { status: 400 })
    }
    
    const selectedPlan = PLANS[plan]
    if (selectedPlan.stripePriceId === 'contact_us') {
      return new NextResponse('Contact sales for Enterprise pricing', { status: 400 })
    }
    
    // Get user details
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { 
        email: true, 
        stripeCustomerId: true,
        stripeSubscriptionId: true 
      }
    })
    
    if (!user?.email) {
      return new NextResponse('User email not found', { status: 400 })
    }
    
    // Check if user already has an active subscription
    if (user.stripeSubscriptionId) {
      const existingSubscription = await db.user.findFirst({
        where: {
          id: session.user.id,
          stripeSubscriptionId: { not: null }
        },
        select: {
          stripeCustomerId: true,
          stripeSubscriptionId: true,
          stripeCurrentPeriodEnd: true
        }
      })
      
      if (existingSubscription && existingSubscription.stripeCurrentPeriodEnd && 
          existingSubscription.stripeCurrentPeriodEnd > new Date()) {
        return new NextResponse('You already have an active subscription', { status: 400 })
      }
    }
    
    // Get base URL from environment or request
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                   `${req.headers.get('x-forwarded-proto') || 'http'}://${req.headers.get('host')}`
    
    // Create or update Stripe customer
    const customer = await createOrUpdateCustomer(user.email, {
      userId: session.user.id,
      plan: plan,
    })
    
    // Create checkout session with proper URLs
    const checkoutSession = await createCheckoutSession(
      selectedPlan.stripePriceId,
      customer.id,
      {
        userId: session.user.id,
        plan: plan,
        successUrl: `${baseUrl}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${baseUrl}/pricing?canceled=true`,
      }
    )
    
    return NextResponse.json({ 
      sessionId: checkoutSession.id,
      url: checkoutSession.url 
    })
    
  } catch (error) {
    console.error('Error creating checkout session:', error)
    
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }
    
    // Don't expose internal error details
    return new NextResponse('Failed to create checkout session', { status: 500 })
  }
}