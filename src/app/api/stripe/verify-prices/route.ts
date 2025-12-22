import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function GET(req: NextRequest) {
  try {
    const priceIds = [
      process.env.STRIPE_STARTER_PRICE_ID,
      process.env.STRIPE_CREATOR_PRICE_ID,
      process.env.STRIPE_BUSINESS_PRICE_ID,
    ].filter(Boolean) as string[]

    const results = {
      valid: [] as any[],
      invalid: [] as any[],
      validCount: 0,
      invalidCount: 0,
      allValid: false
    }

    for (const priceId of priceIds) {
      try {
        const price = await stripe.prices.retrieve(priceId)
        
        if (price.active) {
          results.valid.push({
            id: price.id,
            unit_amount: price.unit_amount,
            currency: price.currency,
            product: price.product,
            type: price.type,
            active: price.active
          })
        } else {
          results.invalid.push({
            id: price.id,
            reason: 'Price is not active',
            active: price.active
          })
        }
      } catch (error) {
        results.invalid.push({
          id: priceId,
          reason: 'Price not found or invalid',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    results.validCount = results.valid.length
    results.invalidCount = results.invalid.length
    results.allValid = results.invalidCount === 0

    return NextResponse.json({
      allValid: results.allValid,
      validCount: results.validCount,
      invalidCount: results.invalidCount,
      validPrices: results.valid,
      invalidPrices: results.invalid,
      message: results.allValid 
        ? `All ${results.validCount} price IDs are valid and active`
        : `${results.invalidCount} price IDs have issues`
    })
    
  } catch (error) {
    console.error('Error verifying price IDs:', error)
    
    return NextResponse.json({
      allValid: false,
      validCount: 0,
      invalidCount: 0,
      validPrices: [],
      invalidPrices: [],
      message: 'Failed to verify price IDs',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}