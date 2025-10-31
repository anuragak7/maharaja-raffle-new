import { prisma } from '@/lib/db'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

function parseCSV(text: string) {
  const lines = text.trim().split(/\r?\n/)
  const header = lines.shift()?.split(',').map(s=>s.trim().toLowerCase()) || []
  const fi = header.indexOf('first_name')
  const la = header.indexOf('last_name')
  const ph = header.indexOf('phone')
  const rows = []
  for (const line of lines) {
    const cols = line.split(',')
    rows.push({ firstName: cols[fi]?.trim() || '', lastName: cols[la]?.trim() || '', phone: (cols[ph]||'').replace(/\D/g,'') })
  }
  return rows
}

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof File)) return new Response('file missing', { status: 400 })
  const text = await file.text()
  const rows = parseCSV(text).filter(r => r.firstName && r.lastName && /\d{10}/.test(r.phone))
  const ops = rows.map(r => prisma.entry.upsert({
    where: { phone: r.phone },
    update: { firstName: r.firstName, lastName: r.lastName },
    create: r
  }))
  await prisma.$transaction(ops, { timeout: 20000 })
  return Response.json({ ok: true, imported: rows.length })
}
