import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    console.log('🔍 Debug: Testing authentication setup...')
    
    // Check if authOptions is properly loaded
    console.log('🔍 Debug: Auth options loaded:', !!authOptions)
    console.log('🔍 Debug: Auth providers:', authOptions.providers?.length || 0)
    
    // Try to get session
    const session = await getServerSession(authOptions)
    console.log('🔍 Debug: Session retrieved:', !!session)
    
    return NextResponse.json({
      status: 'debug_complete',
      session: session,
      authOptionsLoaded: !!authOptions,
      providersCount: authOptions.providers?.length || 0,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Debug: Error in auth debug endpoint:', error)
    
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}