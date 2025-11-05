import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Environment check started...')
    
    const checks = {
      NODE_ENV: process.env.NODE_ENV || 'undefined',
      DATABASE_URL: process.env.DATABASE_URL ? 'Set (length: ' + process.env.DATABASE_URL.length + ')' : 'NOT SET',
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? 'Set' : 'NOT SET',
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json({ 
      status: 'Environment Check', 
      checks,
      message: 'This endpoint shows environment variable status'
    })
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'Error', 
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}