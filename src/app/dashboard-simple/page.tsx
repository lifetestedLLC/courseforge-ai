export default function DashboardSimple() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Dashboard!
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            You're successfully logged in to CourseForge AI
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">My Courses</h3>
              <p className="text-gray-600 mb-4">Create and manage your AI-generated courses</p>
              <button 
                onClick={() => window.location.href = '/courses'}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                View Courses
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Subscription</h3>
              <p className="text-gray-600 mb-4">Manage your subscription and billing</p>
              <button 
                onClick={() => window.location.href = '/pricing-simple'}
                className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              >
                View Plans
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
              <p className="text-gray-600 mb-4">Update your profile and preferences</p>
              <button 
                onClick={() => window.location.href = '/account'}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
              >
                Account Settings
              </button>
            </div>
          </div>

          <div className="mt-12">
            <button 
              onClick={() => window.location.href = '/courses/create'}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
            >
              Create Your First AI Course
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}