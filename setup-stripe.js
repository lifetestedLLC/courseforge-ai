#!/usr/bin/env node

// Interactive Stripe setup script
const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log('🎯 CourseForge AI - Stripe Setup Helper')
console.log('=========================================')

const questions = [
  {
    key: 'STRIPE_SECRET_KEY',
    question: 'Enter your Stripe Secret Key (starts with sk_test_): ',
    required: true
  },
  {
    key: 'STRIPE_STARTER_PRICE_ID',
    question: 'Enter your Starter Plan Price ID (starts with price_): ',
    required: false
  },
  {
    key: 'STRIPE_CREATOR_PRICE_ID',
    question: 'Enter your Creator Plan Price ID (starts with price_): ',
    required: false
  },
  {
    key: 'STRIPE_BUSINESS_PRICE_ID',
    question: 'Enter your Business Plan Price ID (starts with price_): ',
    required: false
  },
  {
    key: 'STRIPE_WEBHOOK_SECRET',
    question: 'Enter your Stripe Webhook Secret (starts with whsec_): ',
    required: false
  }
]

const answers = {}

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim())
    })
  })
}

async function runSetup() {
  console.log('\n📝 Let\'s set up your Stripe integration!')
  console.log('Press Enter to skip optional questions.\n')

  for (const q of questions) {
    let answer = await askQuestion(q.question)
    
    if (q.required && !answer) {
      console.log(`❌ ${q.key} is required. Please try again.`)
      answer = await askQuestion(q.question)
    }
    
    answers[q.key] = answer || process.env[q.key] || ''
  }

  console.log('\n🔄 Updating your .env.local file...')
  
  try {
    // Read current .env.local
    const envPath = path.join(process.cwd(), '.env.local')
    let envContent = fs.readFileSync(envPath, 'utf8')

    // Update the Stripe section
    const lines = envContent.split('\n')
    const updatedLines = []
    let inStripeSection = false

    for (const line of lines) {
      if (line.includes('STRIPE_SECRET_KEY=')) {
        updatedLines.push(`STRIPE_SECRET_KEY="${answers.STRIPE_SECRET_KEY}"`)
      } else if (line.includes('STRIPE_WEBHOOK_SECRET=')) {
        updatedLines.push(`STRIPE_WEBHOOK_SECRET="${answers.STRIPE_WEBHOOK_SECRET}"`)
      } else if (line.includes('STRIPE_STARTER_PRICE_ID=')) {
        updatedLines.push(`STRIPE_STARTER_PRICE_ID="${answers.STRIPE_STARTER_PRICE_ID}"`)
      } else if (line.includes('STRIPE_CREATOR_PRICE_ID=')) {
        updatedLines.push(`STRIPE_CREATOR_PRICE_ID="${answers.STRIPE_CREATOR_PRICE_ID}"`)
      } else if (line.includes('STRIPE_BUSINESS_PRICE_ID=')) {
        updatedLines.push(`STRIPE_BUSINESS_PRICE_ID="${answers.STRIPE_BUSINESS_PRICE_ID}"`)
      } else {
        updatedLines.push(line)
      }
    }

    // Write back the updated content
    fs.writeFileSync(envPath, updatedLines.join('\n'))
    
    console.log('✅ .env.local file updated successfully!')
    
    // Test the connection
    console.log('\n🧪 Testing Stripe connection...')
    const testResult = await testStripeConnection(answers.STRIPE_SECRET_KEY)
    
    if (testResult) {
      console.log('\n🎉 Setup completed successfully!')
      console.log('\nNext steps:')
      console.log('1. Create your Stripe products and prices (see STRIPE_SETUP_GUIDE.md)')
      console.log('2. Set up webhooks')
      console.log('3. Run: npm run stripe:test')
      console.log('4. Visit: http://localhost:3000/pricing')
    } else {
      console.log('\n❌ Stripe connection test failed. Please check your secret key.')
    }
    
  } catch (error) {
    console.error('❌ Error updating .env.local:', error.message)
  } finally {
    rl.close()
  }
}

async function testStripeConnection(secretKey) {
  try {
    const Stripe = require('stripe')
    const stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16',
    })

    const balance = await stripe.balance.retrieve()
    
    console.log('✅ Stripe connection successful!')
    console.log(`   Account mode: ${balance.livemode ? 'LIVE' : 'TEST'}`)
    console.log(`   Available balance: ${balance.available[0]?.amount || 0} ${balance.available[0]?.currency || 'usd'}`)
    
    return true
  } catch (error) {
    console.log('❌ Stripe connection failed:', error.message)
    return false
  }
}

runSetup().catch(console.error)