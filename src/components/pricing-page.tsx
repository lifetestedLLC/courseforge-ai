'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, X, Loader2, Sparkles } from 'lucide-react'
import { PLANS, PlanType } from '@/lib/stripe'
import { useSession } from 'next-auth/react'
import { useToast } from '@/components/ui/use-toast'

interface PricingPageProps {
  onPlanSelect?: (plan: PlanType) => void
}

export function PricingPage({ onPlanSelect }: PricingPageProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  
  const [isLoading, setIsLoading] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<PlanType | null>(null)
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null)

  useEffect(() => {
    if (session?.user?.id) {
      fetchSubscriptionStatus()
    }
  }, [session])

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/stripe/subscription')
      if (response.ok) {
        const data = await response.json()
        setSubscriptionStatus(data)
        if (data.subscription) {
          // Determine current plan from price ID
          for (const [key, plan] of Object.entries(PLANS)) {
            if (plan.stripePriceId === data.priceId) {
              setCurrentPlan(key as PlanType)
              break
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error)
    }
  }

  const handlePlanSelection = async (planType: PlanType) => {
    if (!session) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to subscribe to a plan.',
        variant: 'destructive'
      })
      return
    }

    if (planType === 'ENTERPRISE') {
      // Handle enterprise contact
      toast({
        title: 'Contact Sales',
        description: 'Please contact our sales team for Enterprise pricing.',
      })
      return
    }

    if (currentPlan === planType) {
      toast({
        title: 'Current Plan',
        description: 'You are already subscribed to this plan.',
      })
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: planType,
          successUrl: `${window.location.origin}/dashboard?upgrade=success`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`,
        })
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      const { url } = await response.json()
      
      if (url) {
        window.location.href = url
      }
      
    } catch (error) {
      console.error('Error creating checkout session:', error)
      toast({
        title: 'Error',
        description: 'There was an error processing your subscription. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getButtonText = (planType: PlanType) => {
    if (!session) return 'Sign in to Subscribe'
    if (currentPlan === planType) return 'Current Plan'
    if (subscriptionStatus?.subscription?.cancelAtPeriodEnd && currentPlan === planType) {
      return 'Reactivate Plan'
    }
    if (planType === 'ENTERPRISE') return 'Contact Sales'
    return `Subscribe to ${PLANS[planType].name}`
  }

  const getButtonVariant = (planType: PlanType) => {
    if (currentPlan === planType) return 'secondary'
    if (planType === 'BUSINESS') return 'default'
    return 'outline'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock the full potential of AI-powered course creation. Start with a free trial, 
            then upgrade as you grow.
          </p>
          
          {subscriptionStatus?.subscription && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800">
                <strong>Current Plan:</strong> {PLANS[currentPlan || 'STARTER']?.name} - 
                {subscriptionStatus.subscription.cancelAtPeriodEnd 
                  ? ' Cancelling at period end' 
                  : ` Next billing: ${new Date(subscriptionStatus.currentPeriodEnd!).toLocaleDateString()}`
                }
              </p>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {Object.entries(PLANS).map(([planType, plan]) => (
            <PricingCard
              key={planType}
              planType={planType as PlanType}
              plan={plan}
              isCurrentPlan={currentPlan === planType}
              isLoading={isLoading}
              onSelect={() => handlePlanSelection(planType as PlanType)}
              buttonText={getButtonText(planType as PlanType)}
              buttonVariant={getButtonVariant(planType as PlanType)}
            />
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <FAQItem
              question="Can I change my plan later?"
              answer="Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated."
            />
            <FAQItem
              question="Is there a free trial?"
              answer="Yes! All paid plans come with a 14-day free trial. You can cancel anytime during the trial period and won't be charged."
            />
            <FAQItem
              question="What happens if I exceed my course limits?"
              answer="We'll notify you when you approach your limits. You can upgrade your plan or wait until your monthly limit resets."
            />
            <FAQItem
              question="Can I cancel my subscription?"
              answer="Yes, you can cancel your subscription at any time. You'll retain access until the end of your current billing period."
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Course Creation?
          </h3>
          <p className="text-gray-600 mb-8">
            Join thousands of creators who are already using CourseForge AI
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={() => handlePlanSelection('STARTER')}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Start Free Trial
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

interface PricingCardProps {
  planType: PlanType
  plan: typeof PLANS[PlanType]
  isCurrentPlan: boolean
  isLoading: boolean
  onSelect: () => void
  buttonText: string
  buttonVariant: 'default' | 'secondary' | 'outline' | 'destructive' | 'ghost' | 'link'
}

function PricingCard({ 
  planType, 
  plan, 
  isCurrentPlan, 
  isLoading, 
  onSelect, 
  buttonText, 
  buttonVariant 
}: PricingCardProps) {
  const isPopular = planType === 'BUSINESS'
  const isEnterprise = planType === 'ENTERPRISE'

  return (
    <Card className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg ${
      isPopular ? 'ring-2 ring-blue-500 shadow-xl' : ''
    } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}>
      
      {isPopular && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
          Most Popular
        </div>
      )}
      
      {isCurrentPlan && (
        <div className="absolute top-0 left-0 bg-green-500 text-white px-3 py-1 text-xs font-semibold rounded-br-lg">
          Current Plan
        </div>
      )}

      <CardHeader className="text-center pb-8 pt-10">
        <CardTitle className="text-2xl font-bold text-gray-900">
          {plan.name}
        </CardTitle>
        <div className="mt-4">
          <span className="text-4xl font-bold text-gray-900">
            {isEnterprise ? 'Custom' : `$${plan.price}`}
          </span>
          {!isEnterprise && (
            <span className="text-gray-600 ml-1">/month</span>
          )}
        </div>
        <CardDescription className="mt-2">
          {isEnterprise ? 'Contact us for pricing' : 'Billed monthly'}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-8">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <Button
            onClick={onSelect}
            disabled={isLoading || isCurrentPlan}
            variant={buttonVariant as any}
            className="w-full"
            size="lg"
          >
            {isLoading && !isCurrentPlan ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              buttonText
            )}
          </Button>
        </div>

        {/* Plan Limits */}
        {!isEnterprise && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Usage Limits</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {plan.limits.coursesPerMonth === -1 ? (
                <li>• Unlimited courses</li>
              ) : (
                <li>• {plan.limits.coursesPerMonth} courses/month</li>
              )}
              {plan.limits.videoMinutes === -1 ? (
                <li>• Unlimited video minutes</li>
              ) : (
                <li>• {plan.limits.videoMinutes} video minutes</li>
              )}
              <li>• {plan.limits.storageGB === -1 ? 'Unlimited' : plan.limits.storageGB + 'GB'} storage</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-gray-200 pb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {question}
      </h3>
      <p className="text-gray-600">
        {answer}
      </p>
    </div>
  )
}