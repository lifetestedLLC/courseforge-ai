import { PricingPage } from '@/components/pricing-page'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing - CourseForge AI',
  description: 'Choose the perfect plan for your course creation needs. Start with AI-powered course generation today.',
  keywords: 'course creation, AI courses, e-learning, pricing, subscription plans',
}

export default function PricingRoute() {
  return (
    <main className="min-h-screen">
      <PricingPage />
    </main>
  )
}