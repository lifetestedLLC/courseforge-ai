import { Suspense } from 'react'
import { SubscriptionManager } from '@/components/subscription-manager'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Settings, User, CreditCard, Bell } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Account Settings - CourseForge AI',
  description: 'Manage your account settings, subscription, and preferences.',
}

export default function AccountPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account, subscription, and preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subscription Management */}
          <Suspense fallback={<SubscriptionManagerSkeleton />}>
            <SubscriptionManager />
          </Suspense>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Account Preferences
              </CardTitle>
              <CardDescription>
                Manage your account settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about your courses and account
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Profile Information</p>
                  <p className="text-sm text-muted-foreground">
                    Update your name, email, and profile details
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.location.href = '/dashboard/courses'}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                My Courses
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.location.href = '/dashboard/analytics'}
              >
                <Settings className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.location.href = '/pricing'}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="ghost" className="w-full justify-start text-left">
                📚 Documentation
              </Button>
              <Button variant="ghost" className="w-full justify-start text-left">
                💬 Contact Support
              </Button>
              <Button variant="ghost" className="w-full justify-start text-left">
                🎥 Video Tutorials
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function SubscriptionManagerSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Management</CardTitle>
        <CardDescription>
          Loading your subscription details...
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </CardContent>
    </Card>
  )
}