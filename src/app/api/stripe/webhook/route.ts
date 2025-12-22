import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import Stripe from 'stripe'

// Validate webhook secret
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
if (!webhookSecret) {
  console.error('STRIPE_WEBHOOK_SECRET is not configured')
  // Don't throw here to allow the app to start, but webhook processing will fail
}

// Track processed events to prevent duplicate processing
const processedEvents = new Set<string>()

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')
  
  // Validate signature exists
  if (!signature) {
    console.error('Missing stripe-signature header')
    return new NextResponse('Missing signature', { status: 400 })
  }
  
  // Validate webhook secret is configured
  if (!webhookSecret) {
    console.error('Webhook secret not configured')
    return new NextResponse('Webhook not properly configured', { status: 500 })
  }
  
  let event: Stripe.Event
  
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return new NextResponse('Webhook signature verification failed', { status: 400 })
  }
  
  // Prevent duplicate event processing
  if (processedEvents.has(event.id)) {
    console.log(`Event ${event.id} already processed, skipping`)
    return NextResponse.json({ received: true })
  }
  
  try {
    // Add event to processed set
    processedEvents.add(event.id)
    
    // Clean up old events (keep last 1000)
    if (processedEvents.size > 1000) {
      const eventsToRemove = Array.from(processedEvents).slice(0, 500)
      eventsToRemove.forEach(id => processedEvents.delete(id))
    }
    
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.mode === 'subscription' && session.customer) {
          const customerId = typeof session.customer === 'string' 
            ? session.customer 
            : session.customer.id
          
          const subscriptionId = session.subscription as string
          
          try {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId)
            const priceId = subscription.items.data[0]?.price?.id
            
            if (!priceId) {
              console.error('No price ID found in subscription')
              break
            }
            
            // Update user with subscription details in a transaction
            const result = await db.user.updateMany({
              where: { stripeCustomerId: customerId },
              data: {
                stripeSubscriptionId: subscriptionId,
                stripePriceId: priceId,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
              }
            })
            
            if (result.count === 0) {
              console.error(`No user found with customer ID: ${customerId}`)
            } else {
              console.log(`✅ Subscription created for customer ${customerId}`)
            }
          } catch (error) {
            console.error(`Error processing checkout.session.completed:`, error)
            throw error // Re-throw to trigger retry
          }
        }
        break
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        
        if (invoice.subscription && invoice.customer) {
          const customerId = typeof invoice.customer === 'string' 
            ? invoice.customer 
            : invoice.customer.id
          
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          )
          
          // Update user's subscription period
          await db.user.updateMany({
            where: { stripeCustomerId: customerId },
            data: {
              stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            }
          })
          
          console.log(`✅ Payment succeeded for customer ${customerId}`)
        }
        break
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        
        if (subscription.customer) {
          const customerId = typeof subscription.customer === 'string' 
            ? subscription.customer 
            : subscription.customer.id
          
          const priceId = subscription.items.data[0]?.price?.id
          
          // Update user's subscription details
          await db.user.updateMany({
            where: { stripeCustomerId: customerId },
            data: {
              stripeSubscriptionId: subscription.id,
              stripePriceId: priceId,
              stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            }
          })
          
          console.log(`✅ Subscription updated for customer ${customerId}`)
        }
        break
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        if (subscription.customer) {
          const customerId = typeof subscription.customer === 'string' 
            ? subscription.customer 
            : subscription.customer.id
          
          // Remove subscription from user
          await db.user.updateMany({
            where: { stripeCustomerId: customerId },
            data: {
              stripeSubscriptionId: null,
              stripePriceId: null,
              stripeCurrentPeriodEnd: null,
            }
          })
          
          console.log(`✅ Subscription cancelled for customer ${customerId}`)
        }
        break
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        
        if (invoice.customer) {
          const customerId = typeof invoice.customer === 'string' 
            ? invoice.customer 
            : invoice.customer.id
          
          console.log(`❌ Payment failed for customer ${customerId}`)
          
          // You could send email notification here
          // await sendPaymentFailedEmail(customerId)
        }
        break
      }
      
      case 'customer.subscription.trial_will_end': {
        const subscription = event.data.object as Stripe.Subscription
        
        if (subscription.customer) {
          const customerId = typeof subscription.customer === 'string' 
            ? subscription.customer 
            : subscription.customer.id
          
          console.log(`⏰ Trial ending soon for customer ${customerId}`)
          
          // You could send trial ending email here
          // await sendTrialEndingEmail(customerId)
        }
        break
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
    
    return NextResponse.json({ received: true })
    
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new NextResponse('Webhook processing failed', { status: 500 })
  }
}