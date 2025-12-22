// Environment variable validation and configuration
import { z } from 'zod'

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  
  // Authentication
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),
  NEXTAUTH_SECRET: z.string().min(1, 'NEXTAUTH_SECRET is required'),
  
  // OAuth Providers (optional)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_ID: z.string().optional(),
  GITHUB_SECRET: z.string().optional(),
  
  // OpenAI
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
  
  // Stripe
  STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY is required'),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, 'STRIPE_WEBHOOK_SECRET is required'),
  STRIPE_STARTER_PRICE_ID: z.string().min(1, 'STRIPE_STARTER_PRICE_ID is required'),
  STRIPE_CREATOR_PRICE_ID: z.string().min(1, 'STRIPE_CREATOR_PRICE_ID is required'),
  STRIPE_BUSINESS_PRICE_ID: z.string().min(1, 'STRIPE_BUSINESS_PRICE_ID is required'),
  
  // App Configuration
  NEXT_PUBLIC_APP_URL: z.string().url('NEXT_PUBLIC_APP_URL must be a valid URL'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export type EnvConfig = z.infer<typeof envSchema>

function validateEnv(): EnvConfig {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join('.')).join(', ')
      throw new Error(`Environment validation failed. Missing or invalid variables: ${missingVars}`)
    }
    throw error
  }
}

// Export validated environment configuration
export const env = validateEnv()

// Helper to check if we're in development
export const isDevelopment = env.NODE_ENV === 'development'

// Helper to check if we're in production
export const isProduction = env.NODE_ENV === 'production'

// Stripe configuration validation
export function validateStripeConfig() {
  const requiredForProduction = [
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'STRIPE_STARTER_PRICE_ID',
    'STRIPE_CREATOR_PRICE_ID',
    'STRIPE_BUSINESS_PRICE_ID',
  ] as const

  const missing = requiredForProduction.filter(key => !env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing Stripe configuration for production: ${missing.join(', ')}`)
  }

  // Validate Stripe key format
  if (!env.STRIPE_SECRET_KEY.startsWith('sk_')) {
    throw new Error('STRIPE_SECRET_KEY must start with "sk_"')
  }

  // Validate webhook secret format
  if (!env.STRIPE_WEBHOOK_SECRET.startsWith('whsec_')) {
    console.warn('STRIPE_WEBHOOK_SECRET should start with "whsec_" for better security')
  }
}