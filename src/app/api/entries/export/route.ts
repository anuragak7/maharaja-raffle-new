import { prisma } from '@/lib/db'

// This route should not be statically generated
export const dynamic = 'force-dynamic'

export async function GET() {
  const rows = await prisma.entry.findMany({ orderBy: { createdAt: 'asc' } })
  const header = 'first_name,last_name,phone\n'
  const body = rows.map(r => `${r.firstName},${r.lastName},${r.phone}`).join('\n')
  const csv = header + body
  return new Response(csv, { headers: { 'content-type': 'text/csv', 'content-disposition': 'attachment; filename="entries.csv"' } })
}
