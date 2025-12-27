export default function PricingPageMinimal() {
  const handlePlanSelection = (plan: string) => {
    window.location.href = `/api/stripe/checkout?plan=${plan}`
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '3rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
            Choose Your Plan
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '2rem' }}>
            Start creating AI-powered courses today
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '3rem' }}>
          {/* Starter Plan */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', backgroundColor: '#eff6ff' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e40af' }}>Starter</h3>
              <p style={{ marginTop: '0.5rem', color: '#3b82f6', fontSize: '1.25rem' }}>$15/month</p>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <ul style={{ fontSize: '0.875rem' }}>
                <li style={{ marginBottom: '0.75rem' }}>✅ 3 AI-generated courses per month</li>
                <li style={{ marginBottom: '0.75rem' }}>✅ Basic course templates</li>
                <li style={{ marginBottom: '0.75rem' }}>✅ Standard video & text lessons</li>
                <li style={{ marginBottom: '0.75rem' }}>✅ Quiz generation</li>
                <li style={{ marginBottom: '0.75rem' }}>✅ PDF export</li>
                <li style={{ marginBottom: '0.75rem' }}>✅ Email support</li>
                <li>✅ Basic analytics</li>
              </ul>
              <button 
                onClick={() => handlePlanSelection('STARTER')}
                style={{ marginTop: '1.5rem', width: '100%', backgroundColor: '#3b82f6', color: 'white', padding: '0.75rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontWeight: '600' }}
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Pro Plan */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', overflow: 'hidden', border: '2px solid #10b981' }}>
            <div style={{ padding: '1.5rem', backgroundColor: '#ecfdf5', position: 'relative' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>Creator</h3>
              <p style={{ marginTop: '0.5rem', color: '#059669', fontSize: '1.25rem' }}>$49/month</p>
              <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
                <span style={{ backgroundColor: '#10b981', color: 'white', fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>Most Popular</span>
              </div>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <ul style={{ fontSize: '0.875rem' }}>
                <li style={{ marginBottom: '0.75rem' }}>✅ 15 AI-generated courses per month</li>
                <li style={{ marginBottom: '0.75rem' }}>✅ Advanced course templates</li>
                <li style={{ marginBottom: '0.75rem' }}>✅ All content formats</li>
                <li style={{ marginBottom: '0.75rem' }}>✅ Advanced quiz & assessment tools</li>
                <li style={{ marginBottom: '0.75rem' }}>✅ Custom branding & white-label</li>
                <li style={{ marginBottom: '0.75rem' }}>✅ Priority support</li>
                <li>✅ Advanced analytics dashboard</li>
              </ul>
              <button 
                onClick={() => handlePlanSelection('CREATOR')}
                style={{ marginTop: '1.5rem', width: '100%', backgroundColor: '#10b981', color: 'white', padding: '0.75rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontWeight: '600' }}
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Business Plan */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', backgroundColor: '#faf5ff' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#7c3aed' }}>Business</h3>
              <p style={{ marginTop: '0.5rem', color: '#7c3aed', fontSize: '1.25rem' }}>$79/month</p>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <ul style={{ fontSize: '0.875rem' }}>
                <li style={{ marginBottom: '0.75rem' }}>✅ Unlimited AI-generated courses</li>
                <li style={{ marginBottom: '0.75rem' }}>✅ Premium templates & AI models</li>
                <li style={{ marginBottom: '0.75rem' }}>✅ All content formats + live sessions</li>
                <li style={{ marginBottom: '0.75rem' }}>✅ Advanced assessments & certifications</li>
                <li style={{ marginBottom: '0.75rem' }}>✅ Full white-label solution</li>
                <li style={{ marginBottom: '0.75rem' }}>✅ Dedicated account manager</li>
                <li>✅ Advanced analytics & insights</li>
              </ul>
              <button 
                onClick={() => handlePlanSelection('BUSINESS')}
                style={{ marginTop: '1.5rem', width: '100%', backgroundColor: '#7c3aed', color: 'white', padding: '0.75rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontWeight: '600' }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            All plans include a 14-day free trial. No credit card required.
          </p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Questions? Contact us at support@courseforge.ai
          </p>
        </div>
      </div>
    </div>
  )
}