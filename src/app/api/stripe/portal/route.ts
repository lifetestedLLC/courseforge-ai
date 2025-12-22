import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { createCustomerPortalSession } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    
    // Get user with Stripe customer ID
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { 
        stripeCustomerId: true,
        email: true
      }
    })
    
    if (!user?.stripeCustomerId) {
      return new NextResponse('No Stripe customer found', { status: 400 })
    }
    
    // Create customer portal session
    const portalSession = await createCustomerPortalSession(user.stripeCustomerId)
    
    return NextResponse.json({ 
      url: portalSession.url 
    })
    
  } catch (error) {
    console.error('Error creating customer portal session:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}