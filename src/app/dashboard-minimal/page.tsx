export default function DashboardMinimal() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '3rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
            Welcome to Your Dashboard!
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '2rem' }}>
            You're successfully logged in to CourseForge AI
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '3rem' }}>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>My Courses</h3>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Create and manage your AI-generated courses</p>
              <button 
                onClick={() => window.location.href = '/courses'}
                style={{ width: '100%', backgroundColor: '#3b82f6', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
              >
                View Courses
              </button>
            </div>

            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Subscription</h3>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Manage your subscription and billing</p>
              <button 
                onClick={() => window.location.href = '/pricing-simple'}
                style={{ width: '100%', backgroundColor: '#10b981', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
              >
                View Plans
              </button>
            </div>

            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Account Settings</h3>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Update your profile and preferences</p>
              <button 
                onClick={() => window.location.href = '/account'}
                style={{ width: '100%', backgroundColor: '#6b7280', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
              >
                Account Settings
              </button>
            </div>
          </div>

          <div style={{ marginTop: '3rem' }}>
            <button 
              onClick={() => window.location.href = '/courses/create'}
              style={{ backgroundColor: '#3b82f6', color: 'white', padding: '0.75rem 2rem', borderRadius: '0.5rem', fontSize: '1.125rem', fontWeight: '600', border: 'none', cursor: 'pointer' }}
            >
              Create Your First AI Course
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}