import { prisma } from '@/lib/db'
import { NextRequest } from 'next/server'
import { assertAdminAuth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const auth = assertAdminAuth(req)
  if (auth) return auth

  await prisma.$transaction([
    prisma.winner.deleteMany({}),
    prisma.entry.updateMany({ data: { hasWon: false } })
  ])

  return Response.json({ ok: true })
}
