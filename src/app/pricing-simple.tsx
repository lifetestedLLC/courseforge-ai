export default function PricingSimple() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Choose Your Plan
          </h1>
          <p className="mt-5 text-xl text-gray-500">
            Start creating AI-powered courses today
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Starter Plan */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8 bg-blue-50">
              <h3 className="text-2xl font-bold text-blue-900">Starter</h3>
              <p className="mt-2 text-blue-700">$15/month</p>
            </div>
            <div className="px-6 py-6">
              <ul className="space-y-3 text-sm">
                <li>✅ 3 AI-generated courses per month</li>
                <li>✅ Basic course templates</li>
                <li>✅ Standard video & text lessons</li>
                <li>✅ Quiz generation</li>
                <li>✅ PDF export</li>
                <li>✅ Email support</li>
                <li>✅ Basic analytics</li>
              </ul>
              <button 
                onClick={() => window.location.href = '/api/stripe/checkout?plan=STARTER'}
                className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700"
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-green-500">
            <div className="px-6 py-8 bg-green-50">
              <h3 className="text-2xl font-bold text-green-900">Creator</h3>
              <p className="mt-2 text-green-700">$49/month</p>
              <div className="mt-2">
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Most Popular</span>
              </div>
            </div>
            <div className="px-6 py-6">
              <ul className="space-y-3 text-sm">
                <li>✅ 15 AI-generated courses per month</li>
                <li>✅ Advanced course templates</li>
                <li>✅ All content formats</li>
                <li>✅ Advanced quiz & assessment tools</li>
                <li>✅ Custom branding & white-label</li>
                <li>✅ Priority support</li>
                <li>✅ Advanced analytics dashboard</li>
              </ul>
              <button 
                onClick={() => window.location.href = '/api/stripe/checkout?plan=CREATOR'}
                className="mt-6 w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700"
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Business Plan */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8 bg-purple-50">
              <h3 className="text-2xl font-bold text-purple-900">Business</h3>
              <p className="mt-2 text-purple-700">$79/month</p>
            </div>
            <div className="px-6 py-6">
              <ul className="space-y-3 text-sm">
                <li>✅ Unlimited AI-generated courses</li>
                <li>✅ Premium templates & AI models</li>
                <li>✅ All content formats + live sessions</li>
                <li>✅ Advanced assessments & certifications</li>
                <li>✅ Full white-label solution</li>
                <li>✅ Dedicated account manager</li>
                <li>✅ Advanced analytics & insights</li>
              </ul>
              <button 
                onClick={() => window.location.href = '/api/stripe/checkout?plan=BUSINESS'}
                className="mt-6 w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <p className="text-sm text-gray-500">
            Questions? Contact us at support@courseforge.ai
          </p>
        </div>
      </div>
    </div>
  )
}