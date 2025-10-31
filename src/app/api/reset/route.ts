import { prisma } from '@/lib/db'
import { NextRequest } from 'next/server'
import { assertAdminAuth } from '@/lib/auth'

// This route should not be statically generated
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const auth = assertAdminAuth(req)
  if (auth) return auth

  await prisma.$transaction([
    prisma.winner.deleteMany({}),
    prisma.entry.updateMany({ data: { hasWon: false } })
  ])

  return Response.json({ ok: true })
}
