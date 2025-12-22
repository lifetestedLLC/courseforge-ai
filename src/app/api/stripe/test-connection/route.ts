import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function GET(req: NextRequest) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
    })

    // Test connection by retrieving balance
    const balance = await stripe.balance.retrieve()
    
    return NextResponse.json({
      connected: true,
      balance: {
        available: balance.available,
        pending: balance.pending,
        livemode: balance.livemode
      },
      message: 'Successfully connected to Stripe'
    })
    
  } catch (error) {
    console.error('Stripe connection test failed:', error)
    
    return NextResponse.json({
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to connect to Stripe'
    }, { status: 500 })
  }
}