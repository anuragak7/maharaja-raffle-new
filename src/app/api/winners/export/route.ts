import { prisma } from '@/lib/db'

// This route should not be statically generated
export const dynamic = 'force-dynamic'

export async function GET() {
  const store = 'bellerose' // Filter for Bellerose winners only
  const rows = await prisma.winner.findMany({ 
    include: { entry: true },
    where: { entry: { store } },
    orderBy: { drawnAt: 'asc' } 
  })
  const header = 'round,drawn_at,first_name,last_name,phone\n'
  const body = rows.map(r => `${r.round},${r.drawnAt.toISOString()},${r.entry.firstName},${r.entry.lastName},${r.entry.phone}`).join('\n')
  const csv = header + body
  return new Response(csv, { headers: { 'content-type': 'text/csv', 'content-disposition': 'attachment; filename="bellerose-winners.csv"' } })
}
