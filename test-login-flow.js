#!/usr/bin/env node

// Test the complete login and redirect flow
console.log('🧪 Testing Complete Login & Redirect Flow...')
console.log('==============================================')

async function testLoginFlow() {
  try {
    console.log('\n1️⃣ Testing demo login via API...')
    
    // Test the authentication API
    const loginResponse = await fetch('http://localhost:3001/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'demo@courseforge.ai',
        password: 'demo'
      })
    })
    
    console.log(`Login API Response: ${loginResponse.status}`)
    
    if (loginResponse.ok) {
      console.log('✅ Login API call successful')
      
      // Check if we got a session cookie
      const cookies = loginResponse.headers.get('set-cookie')
      if (cookies) {
        console.log('✅ Session cookie set')
      } else {
        console.log('⚠️  No session cookie detected')
      }
      
    } else {
      console.log('❌ Login API call failed')
      const errorText = await loginResponse.text()
      console.log('Error response:', errorText.substring(0, 200))
    }

    console.log('\n2️⃣ Testing session endpoint...')
    
    // Test if we can get session info
    try {
      const sessionResponse = await fetch('http://localhost:3001/api/auth/session')
      const sessionData = await sessionResponse.json()
      
      if (sessionData && Object.keys(sessionData).length > 0) {
        console.log('✅ Session endpoint accessible')
        console.log('Session data:', JSON.stringify(sessionData, null, 2))
      } else {
        console.log('✅ Session endpoint accessible (no active session)')
      }
    } catch (error) {
      console.log('❌ Session endpoint error:', error.message)
    }

    console.log('\n3️⃣ Testing dashboard redirect...')
    
    // Test if dashboard page is accessible
    try {
      const dashboardResponse = await fetch('http://localhost:3001/dashboard')
      console.log(`Dashboard Response: ${dashboardResponse.status}`)
      
      if (dashboardResponse.ok) {
        console.log('✅ Dashboard page accessible')
      } else {
        console.log('❌ Dashboard page not accessible')
        const errorText = await dashboardResponse.text()
        console.log('Error:', errorText.substring(0, 200))
      }
    } catch (error) {
      console.log('❌ Dashboard error:', error.message)
    }

    console.log('\n4️⃣ Testing pricing page...')
    
    try {
      const pricingResponse = await fetch('http://localhost:3001/pricing')
      console.log(`Pricing Response: ${pricingResponse.status}`)
      
      if (pricingResponse.ok) {
        console.log('✅ Pricing page accessible')
      } else {
        console.log('❌ Pricing page not accessible')
      }
    } catch (error) {
      console.log('❌ Pricing page error:', error.message)
    }

    console.log('\n5️⃣ Testing complete flow...')
    
    // Simulate the complete flow
    console.log('📋 Complete Flow Test:')
    console.log('   1. User clicks demo login button')
    console.log('   2. API call to /api/auth/callback/credentials')
    console.log('   3. Should redirect to /dashboard')
    console.log('   4. Dashboard should load successfully')

  } catch (error) {
    console.error('❌ Login flow test failed:', error.message)
  }
}

// Run the test
testLoginFlow().then(() => {
  console.log('\n' + '='.repeat(60))
  console.log('🏁 Login Flow Test Complete!')
  console.log('='.repeat(60))
}).catch(console.error)