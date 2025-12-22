'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/components/ui/use-toast'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Zap, 
  CreditCard, 
  Settings,
  TestTube,
  RefreshCw
} from 'lucide-react'

interface TestResult {
  name: string
  status: 'pass' | 'fail' | 'pending'
  message: string
  details?: any
}

export function StripeTestDashboard() {
  const { toast } = useToast()
  const [isTesting, setIsTesting] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [overallStatus, setOverallStatus] = useState<'pending' | 'pass' | 'fail'>('pending')

  const runTests = async () => {
    setIsTesting(true)
    setTestResults([])
    setOverallStatus('pending')

    const results: TestResult[] = []

    // Test 1: Environment Variables
    results.push(await testEnvironmentVariables())

    // Test 2: Stripe Connection
    results.push(await testStripeConnection())

    // Test 3: Price IDs
    results.push(await testPriceIds())

    // Test 4: API Endpoints
    results.push(await testAPIEndpoints())

    // Test 5: Current Subscription Status
    results.push(await testSubscriptionStatus())

    setTestResults(results)

    // Calculate overall status
    const hasFailures = results.some(r => r.status === 'fail')
    const allPassed = results.every(r => r.status === 'pass')
    
    if (hasFailures) {
      setOverallStatus('fail')
    } else if (allPassed) {
      setOverallStatus('pass')
    } else {
      setOverallStatus('pending')
    }

    setIsTesting(false)
  }

  const testEnvironmentVariables = async (): Promise<TestResult> => {
    try {
      const requiredEnvVars = [
        'STRIPE_SECRET_KEY',
        'STRIPE_WEBHOOK_SECRET',
        'STRIPE_STARTER_PRICE_ID',
        'STRIPE_CREATOR_PRICE_ID',
        'STRIPE_BUSINESS_PRICE_ID',
        'NEXT_PUBLIC_APP_URL'
      ]

      const missing = requiredEnvVars.filter(key => !process.env[key])

      if (missing.length > 0) {
        return {
          name: 'Environment Variables',
          status: 'fail',
          message: `Missing: ${missing.join(', ')}`,
          details: missing
        }
      }

      return {
        name: 'Environment Variables',
        status: 'pass',
        message: 'All required environment variables are set'
      }
    } catch (error) {
      return {
        name: 'Environment Variables',
        status: 'fail',
        message: 'Error checking environment variables',
        details: error
      }
    }
  }

  const testStripeConnection = async (): Promise<TestResult> => {
    try {
      const response = await fetch('/api/stripe/test-connection')
      const data = await response.json()

      if (data.connected) {
        return {
          name: 'Stripe Connection',
          status: 'pass',
          message: 'Successfully connected to Stripe',
          details: data.balance
        }
      } else {
        return {
          name: 'Stripe Connection',
          status: 'fail',
          message: data.error || 'Failed to connect to Stripe'
        }
      }
    } catch (error) {
      return {
        name: 'Stripe Connection',
        status: 'fail',
        message: 'Network error testing Stripe connection',
        details: error
      }
    }
  }

  const testPriceIds = async (): Promise<TestResult> => {
    try {
      const response = await fetch('/api/stripe/verify-prices')
      const data = await response.json()

      if (data.allValid) {
        return {
          name: 'Price IDs',
          status: 'pass',
          message: `All ${data.validCount} price IDs are valid`,
          details: data.validPrices
        }
      } else {
        return {
          name: 'Price IDs',
          status: 'fail',
          message: `${data.invalidCount} price IDs are invalid`,
          details: data.invalidPrices
        }
      }
    } catch (error) {
      return {
        name: 'Price IDs',
        status: 'fail',
        message: 'Network error verifying price IDs',
        details: error
      }
    }
  }

  const testAPIEndpoints = async (): Promise<TestResult> => {
    const endpoints = [
      '/api/stripe/checkout',
      '/api/stripe/portal',
      '/api/stripe/subscription',
      '/api/stripe/webhook'
    ]

    const results = await Promise.all(
      endpoints.map(async (endpoint) => {
        try {
          const response = await fetch(endpoint, { method: 'GET' })
          return {
            endpoint,
            status: response.status,
            ok: response.ok
          }
        } catch (error) {
          return {
            endpoint,
            status: 'error',
            ok: false,
            error
          }
        }
      })
    )

    const failed = results.filter(r => !r.ok)
    const passed = results.filter(r => r.ok)

    if (failed.length > 0) {
      return {
        name: 'API Endpoints',
        status: 'fail',
        message: `${failed.length} endpoints failed`,
        details: { failed, passed }
      }
    }

    return {
      name: 'API Endpoints',
      status: 'pass',
      message: `All ${endpoints.length} endpoints are accessible`,
      details: results
    }
  }

  const testSubscriptionStatus = async (): Promise<TestResult> => {
    try {
      const response = await fetch('/api/stripe/subscription')
      
      if (!response.ok) {
        return {
          name: 'Subscription Status',
          status: 'pending',
          message: 'No active subscription (this is normal for new users)'
        }
      }

      const data = await response.json()
      
      if (data.hasSubscription) {
        return {
          name: 'Subscription Status',
          status: 'pass',
          message: `Active subscription detected: ${data.subscription?.status}`,
          details: data
        }
      } else {
        return {
          name: 'Subscription Status',
          status: 'pending',
          message: 'No active subscription',
          details: data
        }
      }
    } catch (error) {
      return {
        name: 'Subscription Status',
        status: 'fail',
        message: 'Error checking subscription status',
        details: error
      }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'pending':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <TestTube className="h-5 w-5 text-gray-500" />
    }
  }

  const getOverallStatusMessage = () => {
    switch (overallStatus) {
      case 'pass':
        return { message: 'All systems operational!', color: 'text-green-600 bg-green-50' }
      case 'fail':
        return { message: 'Some issues detected', color: 'text-red-600 bg-red-50' }
      case 'pending':
        return { message: 'Run tests to check status', color: 'text-gray-600 bg-gray-50' }
      default:
        return { message: 'Ready to test', color: 'text-gray-600 bg-gray-50' }
    }
  }

  useEffect(() => {
    // Run initial test on component mount
    runTests()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
          <Zap className="h-8 w-8 text-blue-500" />
          Stripe Integration Test Dashboard
        </h1>
        <p className="text-muted-foreground">
          Test and verify your Stripe integration setup
        </p>
      </div>

      {/* Overall Status */}
      <Alert className={getOverallStatusMessage().color}>
        <div className="flex items-center gap-2">
          {overallStatus === 'pass' && <CheckCircle className="h-4 w-4" />}
          {overallStatus === 'fail' && <AlertTriangle className="h-4 w-4" />}
          {overallStatus === 'pending' && <TestTube className="h-4 w-4" />}
          <AlertDescription>
            {getOverallStatusMessage().message}
          </AlertDescription>
        </div>
      </Alert>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Run tests and manage your Stripe integration
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button 
            onClick={runTests} 
            disabled={isTesting}
            className="flex items-center gap-2"
          >
            {isTesting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Run All Tests
              </>
            )}
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => window.open('/pricing', '_blank')}
            className="flex items-center gap-2"
          >
            <CreditCard className="h-4 w-4" />
            View Pricing Page
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => window.open('/dashboard/account', '_blank')}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Account Settings
          </Button>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
          <CardDescription>
            Detailed results from the integration tests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {testResults.map((result, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
              {getStatusIcon(result.status)}
              <div className="flex-1 space-y-1">
                <h4 className="font-medium">{result.name}</h4>
                <p className="text-sm text-muted-foreground">{result.message}</p>
                
                {result.details && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                      View details
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-50 rounded overflow-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
              
              <Badge 
                variant={
                  result.status === 'pass' ? 'default' :
                  result.status === 'fail' ? 'destructive' :
                  'secondary'
                }
              >
                {result.status.toUpperCase()}
              </Badge>
            </div>
          ))}
          
          {testResults.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No test results yet. Click "Run All Tests" to start.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Troubleshooting Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting</CardTitle>
          <CardDescription>
            Common issues and solutions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h5 className="font-medium text-red-600">Common Issues:</h5>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• <strong>Missing environment variables:</strong> Check your .env.local file</li>
              <li>• <strong>Invalid price IDs:</strong> Verify prices in Stripe dashboard</li>
              <li>• <strong>Webhook failures:</strong> Check webhook URL and secret</li>
              <li>• <strong>API endpoint errors:</strong> Ensure all routes are properly set up</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h5 className="font-medium text-blue-600">Next Steps:</h5>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Test the complete subscription flow</li>
              <li>• Verify webhook events are being received</li>
              <li>• Check that database updates are working</li>
              <li>• Test customer portal functionality</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}