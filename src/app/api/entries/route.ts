import { prisma } from '@/lib/db'
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { assertAdminAuth } from '@/lib/auth'

const entrySchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().regex(/\d{10}/, 'Phone must be 10 digits')
})

// This route should not be statically generated
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const summary = req.nextUrl.searchParams.get('summary')
  if (summary) {
    const total = await prisma.entry.count()
    const drawn = await prisma.entry.count({ where: { hasWon: true } })
    const remaining = total - drawn
    const sample = await prisma.entry.findMany({ where: { hasWon: false }, take: 20, orderBy: { createdAt: 'desc' } })
    return Response.json({ counters: { total, remaining, drawn }, sample })
  }

  const entries = await prisma.entry.findMany({ orderBy: { createdAt: 'desc' } })
  return Response.json({ entries })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = entrySchema.safeParse(body)
  if (!parsed.success) {
    return new Response(parsed.error.issues.map(i=>i.message).join(', '), { status: 400 })
  }
  const { firstName, lastName, phone } = parsed.data
  try {
    const e = await prisma.entry.create({ data: {
      firstName, lastName, phone: phone.replace(/\D/g, '')
    }})
    return Response.json({ ok: true, entry: e })
  } catch (e: any) {
    console.error('Database error creating entry:', e)
    if (e.code === 'P2002') return new Response('Phone already exists', { status: 400 })
    return new Response('Failed to create: ' + (e.message || 'Unknown error'), { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const auth = assertAdminAuth(req)
  if (auth) return auth
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return new Response('Missing id', { status: 400 })
  await prisma.entry.delete({ where: { id } })
  return Response.json({ ok: true })
}
