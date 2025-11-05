import { prisma } from '@/lib/db'
import { NextRequest } from 'next/server'
import { assertAdminAuth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const auth = assertAdminAuth(req)
  if (auth) return auth
  
  const store = 'bellerose' // Hardcoded for Bellerose app
  
  try {
    await prisma.winner.deleteMany({
      where: {
        entry: { store }
      }
    })
    
    await prisma.entry.updateMany({
      where: { store },
      data: { hasWon: false }
    })
    
    return Response.json({ ok: true, message: 'Bellerose raffle reset successfully' })
  } catch (error: any) {
    console.error('Reset error:', error)
    return Response.json({ error: 'Reset failed' }, { status: 500 })
  }
}
