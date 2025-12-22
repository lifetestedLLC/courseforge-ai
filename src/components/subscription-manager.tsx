'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, CreditCard, Settings, AlertCircle, CheckCircle } from 'lucide-react'
import { PLANS, PlanType, checkPlanLimits } from '@/lib/stripe'

interface UsageData {
  coursesThisMonth: number
  totalCourses: number
  videoMinutesUsed: number
  storageUsedGB: number
}

interface SubscriptionManagerProps {
  onPlanChange?: (newPlan: PlanType) => void
}

export function SubscriptionManager({ onPlanChange }: SubscriptionManagerProps) {
  const { toast } = useToast()
  
  const [isLoading, setIsLoading] = useState(true)
  const [subscriptionData, setSubscriptionData] = useState<any>(null)
  const [usageData, setUsageData] = useState<UsageData>({
    coursesThisMonth: 0,
    totalCourses: 0,
    videoMinutesUsed: 0,
    storageUsedGB: 0
  })
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    fetchSubscriptionData()
  }, [])

  const fetchSubscriptionData = async () => {
    try {
      const [subscriptionRes, usageRes] = await Promise.all([
        fetch('/api/stripe/subscription'),
        fetch('/api/user/usage') // You'll need to create this endpoint
      ])

      if (subscriptionRes.ok) {
        const data = await subscriptionRes.json()
        setSubscriptionData(data)
      }

      if (usageRes.ok) {
        const usage = await usageRes.json()
        setUsageData(usage)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleManageBilling = async () => {
    setIsProcessing(true)
    
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to create portal session')
      }

      const { url } = await response.json()
      
      if (url) {
        window.location.href = url
      }
      
    } catch (error) {
      console.error('Error creating portal session:', error)
      toast({
        title: 'Error',
        description: 'Failed to open billing portal. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!subscriptionData?.subscription?.id) return

    setIsProcessing(true)
    
    try {
      const response = await fetch('/api/stripe/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'cancel',
          subscriptionId: subscriptionData.subscription.id
        })
      })

      if (!response.ok) {
        throw new Error('Failed to cancel subscription')
      }

      toast({
        title: 'Subscription Cancelled',
        description: 'Your subscription will end at the end of the current billing period.',
      })

      // Refresh data
      await fetchSubscriptionData()
      
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      toast({
        title: 'Error',
        description: 'Failed to cancel subscription. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReactivateSubscription = async () => {
    if (!subscriptionData?.subscription?.id) return

    setIsProcessing(true)
    
    try {
      const response = await fetch('/api/stripe/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reactivate',
          subscriptionId: subscriptionData.subscription.id
        })
      })

      if (!response.ok) {
        throw new Error('Failed to reactivate subscription')
      }

      toast({
        title: 'Subscription Reactivated',
        description: 'Your subscription has been reactivated.',
      })

      // Refresh data
      await fetchSubscriptionData()
      
    } catch (error) {
      console.error('Error reactivating subscription:', error)
      toast({
        title: 'Error',
        description: 'Failed to reactivate subscription. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </CardContent>
      </Card>
    )
  }

  if (!subscriptionData?.hasSubscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Subscription</CardTitle>
          <CardDescription>
            You don't have an active subscription. Choose a plan to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => window.location.href = '/pricing'}
            className="w-full"
          >
            View Pricing Plans
          </Button>
        </CardContent>
      </Card>
    )
  }

  const currentPlanType = Object.keys(PLANS).find(
    key => PLANS[key as PlanType].stripePriceId === subscriptionData.priceId
  ) as PlanType

  const currentPlan = currentPlanType ? PLANS[currentPlanType] : null
  const planLimits = currentPlan ? checkPlanLimits(currentPlanType, usageData) : null

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Current Subscription
          </CardTitle>
          <CardDescription>
            Manage your subscription and billing preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">{currentPlan?.name || 'Unknown Plan'}</h3>
              <p className="text-sm text-gray-600">
                {subscriptionData.subscription?.status === 'active' ? (
                  subscriptionData.subscription.cancelAtPeriodEnd ? (
                    <span className="text-orange-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      Cancels on {new Date(subscriptionData.currentPeriodEnd).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Active until {new Date(subscriptionData.currentPeriodEnd).toLocaleDateString()}
                    </span>
                  )
                ) : (
                  <span className="text-red-600">Inactive</span>
                )}
              </p>
            </div>
            <Badge variant={subscriptionData.subscription?.status === 'active' ? 'default' : 'destructive'}>
              {subscriptionData.subscription?.status}
            </Badge>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleManageBilling}
              disabled={isProcessing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Manage Billing
            </Button>
            
            {subscriptionData.subscription?.cancelAtPeriodEnd ? (
              <Button
                onClick={handleReactivateSubscription}
                disabled={isProcessing}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Reactivate
              </Button>
            ) : (
              <Button
                onClick={handleCancelSubscription}
                disabled={isProcessing}
                variant="destructive"
                className="flex items-center gap-2"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
                Cancel Subscription
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      {planLimits && (
        <Card>
          <CardHeader>
            <CardTitle>Usage This Month</CardTitle>
            <CardDescription>
              Track your usage against your plan limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Courses */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Courses Created</span>
                <span className="text-sm text-gray-600">
                  {usageData.coursesThisMonth} / {planLimits.limits.coursesPerMonth === -1 ? '∞' : planLimits.limits.coursesPerMonth}
                </span>
              </div>
              <Progress 
                value={planLimits.limits.coursesPerMonth === -1 ? 0 : (usageData.coursesThisMonth / planLimits.limits.coursesPerMonth) * 100} 
                className="h-2"
              />
            </div>

            {/* Video Minutes */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Video Minutes</span>
                <span className="text-sm text-gray-600">
                  {usageData.videoMinutesUsed} / {planLimits.limits.videoMinutes === -1 ? '∞' : planLimits.limits.videoMinutes}
                </span>
              </div>
              <Progress 
                value={planLimits.limits.videoMinutes === -1 ? 0 : (usageData.videoMinutesUsed / planLimits.limits.videoMinutes) * 100} 
                className="h-2"
              />
            </div>

            {/* Storage */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Storage Used</span>
                <span className="text-sm text-gray-600">
                  {usageData.storageUsedGB} GB / {planLimits.limits.storageGB === -1 ? '∞' : planLimits.limits.storageGB + ' GB'}
                </span>
              </div>
              <Progress 
                value={planLimits.limits.storageGB === -1 ? 0 : (usageData.storageUsedGB / planLimits.limits.storageGB) * 100} 
                className="h-2"
              />
            </div>

            {/* Usage Warnings */}
            {!planLimits.canCreateCourse && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <AlertCircle className="inline h-4 w-4 mr-1" />
                  You've reached your monthly course limit. Consider upgrading your plan.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Plan Features */}
      {currentPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Your Plan Features</CardTitle>
            <CardDescription>
              Everything included in your {currentPlan.name} plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {currentPlan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}