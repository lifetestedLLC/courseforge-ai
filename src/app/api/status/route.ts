import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleError, Logger } from '@/lib/errors'
import { PLANS } from '@/lib/stripe'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Basic system status (always available)
    const systemStatus = {
      online: true,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    }
    
    // If no user session, return basic status
    if (!session?.user?.id) {
      return NextResponse.json({
        system: systemStatus,
        authenticated: false,
        message: 'Not authenticated',
      })
    }

    // Get user with subscription details
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
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

    // Get course statistics
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    
    const [
      totalCourses,
      publishedCourses,
      coursesThisMonth,
      draftCourses,
    ] = await Promise.all([
      db.course.count({
        where: { userId: session.user.id }
      }),
      db.course.count({
        where: { 
          userId: session.user.id,
          status: 'published'
        }
      }),
      db.course.count({
        where: {
          userId: session.user.id,
          createdAt: {
            gte: startOfMonth
          }
        }
      }),
      db.course.count({
        where: { 
          userId: session.user.id,
          status: 'draft'
        }
      }),
    ])

    // Calculate usage limits
    let coursesRemaining = 0
    let coursesLimit = 0

    if (planKey && PLANS[planKey as keyof typeof PLANS]) {
      const planData = PLANS[planKey as keyof typeof PLANS]
      coursesLimit = planData.limits.coursesPerMonth
      
      if (coursesLimit > 0) {
        coursesRemaining = Math.max(0, coursesLimit - coursesThisMonth)
      } else {
        // Unlimited plan
        coursesRemaining = -1 // indicates unlimited
      }
    }

    // Build comprehensive status response
    const status = {
      system: systemStatus,
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      subscription: {
        active: isActive,
        plan: plan,
        planKey: planKey,
        currentPeriodEnd: user.stripeCurrentPeriodEnd,
        subscriptionId: user.stripeSubscriptionId,
      },
      usage: {
        courses: {
          total: totalCourses,
          published: publishedCourses,
          draft: draftCourses,
          thisMonth: coursesThisMonth,
          remaining: coursesRemaining,
          limit: coursesLimit,
        },
      },
      limits: planKey && PLANS[planKey as keyof typeof PLANS] 
        ? PLANS[planKey as keyof typeof PLANS].limits 
        : null,
    }

    Logger.info('Status retrieved', { 
      userId: session.user.id, 
      plan,
      totalCourses,
    })

    return NextResponse.json(status)
    
  } catch (error) {
    Logger.error('Error fetching status', error)
    const errorResponse = handleError(error)
    return new NextResponse(errorResponse.message, { status: errorResponse.status })
  }
}
