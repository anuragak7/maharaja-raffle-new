import { prisma } from '@/lib/db'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const store = 'bellerose' // Hardcoded for Bellerose app
  
  try {
    const availableEntries = await prisma.entry.findMany({
      where: { hasWon: false, store },
      orderBy: { createdAt: 'asc' }
    })

    if (availableEntries.length === 0) {
      return Response.json({ error: 'No entries available' }, { status: 400 })
    }

    const randomIndex = Math.floor(Math.random() * availableEntries.length)
    const winner = availableEntries[randomIndex]

    await prisma.entry.update({
      where: { id: winner.id },
      data: { hasWon: true }
    })

    const currentRound = await prisma.winner.count() + 1
    
    await prisma.winner.create({
      data: {
        entryId: winner.id,
        round: currentRound
      }
    })

    return Response.json({ 
      winner: {
        ...winner,
        displayName: `${winner.firstName} ${winner.lastName}`
      }
    })
  } catch (error: any) {
    console.error('Draw error:', error)
    return Response.json({ error: 'Draw failed' }, { status: 500 })
  }
}
