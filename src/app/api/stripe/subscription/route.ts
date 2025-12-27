import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { stripe, cancelSubscription, reactivateSubscription, updateSubscriptionPlan, PLANS } from '@/lib/stripe'
import { z } from 'zod'

const cancelSchema = z.object({
  action: z.literal('cancel'),
  subscriptionId: z.string(),
})

const reactivateSchema = z.object({
  action: z.literal('reactivate'),
  subscriptionId: z.string(),
})

const updatePlanSchema = z.object({
  action: z.literal('update_plan'),
  subscriptionId: z.string(),
  newPlan: z.enum(['STARTER', 'CREATOR', 'BUSINESS']),
})

const subscriptionActionSchema = z.union([
  cancelSchema,
  reactivateSchema,
  updatePlanSchema,
])

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    
    const json = await req.json()
    const data = subscriptionActionSchema.parse(json)
    
    // Get user with Stripe details
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { 
        stripeCustomerId: true,
        stripeSubscriptionId: true
      }
    })
    
    if (!user?.stripeSubscriptionId) {
      return new NextResponse('No active subscription found', { status: 400 })
    }
    
    // Verify the subscription belongs to this user
    if (data.subscriptionId !== user.stripeSubscriptionId) {
      return new NextResponse('Subscription not found', { status: 404 })
    }
    
    let result
    
    switch (data.action) {
      case 'cancel':
        result = await cancelSubscription(data.subscriptionId)
        break
        
      case 'reactivate':
        result = await reactivateSubscription(data.subscriptionId)
        break
        
      case 'update_plan':
        const newPlan = PLANS[data.newPlan]
        if (!newPlan || newPlan.stripePriceId === 'contact_us') {
          return new NextResponse('Invalid plan selected', { status: 400 })
        }
        result = await updateSubscriptionPlan(data.subscriptionId, newPlan.stripePriceId)
        break
        
      default:
        return new NextResponse('Invalid action', { status: 400 })
    }
    
    return NextResponse.json({ 
      success: true,
      subscription: result 
    })
    
  } catch (error) {
    console.error('Error managing subscription:', error)
    
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }
    
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    
    // Get user with Stripe details
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { 
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        stripePriceId: true,
        stripeCurrentPeriodEnd: true
      }
    })
    
    if (!user?.stripeCustomerId) {
      return NextResponse.json({ 
        hasSubscription: false,
        customerId: null 
      })
    }
    
    // Get subscription details from Stripe
    let subscriptionDetails = null
    if (user.stripeSubscriptionId) {
      try {
        const subscription = await stripe.subscriptions.retrieve(
          user.stripeSubscriptionId
        )
        
        subscriptionDetails = {
          id: subscription.id,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          priceId: subscription.items.data[0]?.price?.id,
        }
      } catch (error) {
        console.error('Error fetching subscription:', error)
      }
    }
    
    return NextResponse.json({
      hasSubscription: !!user.stripeSubscriptionId,
      customerId: user.stripeCustomerId,
      subscription: subscriptionDetails,
      currentPeriodEnd: user.stripeCurrentPeriodEnd,
      priceId: user.stripePriceId,
    })
    
  } catch (error) {
    console.error('Error fetching subscription status:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}