import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleError, Logger } from '@/lib/errors'
import { PLANS } from '@/lib/stripe'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get user with subscription details
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        stripeSubscriptionId: true,
        stripePriceId: true,
        stripeCurrentPeriodEnd: true,
      }
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    // Determine subscription status
    const isActive = Boolean(
      user.stripeSubscriptionId && 
      user.stripeCurrentPeriodEnd && 
      new Date(user.stripeCurrentPeriodEnd) > new Date()
    )

    // Find plan based on price ID
    let plan = 'Free'
    let planKey = null
    
    for (const [key, planData] of Object.entries(PLANS)) {
      if (planData.stripePriceId === user.stripePriceId) {
        plan = planData.name
        planKey = key
        break
      }
    }

    // Calculate usage (simplified - in real app, you'd track actual usage)
    let coursesRemaining = 0
    let totalCourses = 0

    if (planKey && PLANS[planKey as keyof typeof PLANS]) {
      const planData = PLANS[planKey as keyof typeof PLANS]
      totalCourses = planData.limits.coursesPerMonth
      
      if (totalCourses > 0) {
        // Get courses created this month
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        const coursesThisMonth = await db.course.count({
          where: {
            userId: session.user.id,
            createdAt: {
              gte: startOfMonth
            }
          }
        })
        
        coursesRemaining = Math.max(0, totalCourses - coursesThisMonth)
      } else {
        // Unlimited plan
        coursesRemaining = -1 // indicates unlimited
      }
    }

    const subscriptionData = {
      isActive,
      plan,
      currentPeriodEnd: user.stripeCurrentPeriodEnd,
      coursesRemaining,
      totalCourses,
      subscriptionId: user.stripeSubscriptionId,
    }

    Logger.info('Subscription status retrieved', { 
      userId: session.user.id, 
      isActive, 
      plan 
    })

    return NextResponse.json(subscriptionData)
    
  } catch (error) {
    Logger.error('Error fetching subscription status', error)
    const errorResponse = handleError(error)
    return new NextResponse(errorResponse.message, { status: errorResponse.status })
  }
}