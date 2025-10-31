import { prisma } from '@/lib/db'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
// This route should not be statically generated
export const dynamic = 'force-dynamic'

function parseCSV(text: string) {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) throw new Error('CSV must have header row and at least one data row')
  
  const header = lines.shift()?.split(',').map(s=>s.trim().toLowerCase().replace(/['"]/g, '')) || []
  
  // Support multiple header variations
  const firstNameIndex = header.findIndex(h => 
    h.includes('first') && h.includes('name') || h === 'firstname' || h === 'first'
  )
  const lastNameIndex = header.findIndex(h => 
    h.includes('last') && h.includes('name') || h === 'lastname' || h === 'last'
  )
  const phoneIndex = header.findIndex(h => 
    h.includes('phone') || h.includes('mobile') || h.includes('number') || h.includes('tel')
  )
  
  if (firstNameIndex === -1 || lastNameIndex === -1 || phoneIndex === -1) {
    throw new Error(`Missing required columns. Found headers: ${header.join(', ')}. Need: first_name, last_name, phone`)
  }
  
  const rows = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    const cols = line.split(',').map(s => s.trim().replace(/['"]/g, ''))
    const firstName = cols[firstNameIndex]?.trim() || ''
    const lastName = cols[lastNameIndex]?.trim() || ''
    const phone = (cols[phoneIndex] || '').replace(/\D/g, '')
    
    if (firstName && lastName && /^\d{10}$/.test(phone)) {
      rows.push({ firstName, lastName, phone })
    }
  }
  
  return rows
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file')
    
    if (!(file instanceof File)) {
      return new Response('No file provided', { status: 400 })
    }
    
    if (!file.name.toLowerCase().endsWith('.csv')) {
      return new Response('File must be a CSV file', { status: 400 })
    }
    
    const text = await file.text()
    const rows = parseCSV(text)
    
    if (rows.length === 0) {
      return new Response('No valid entries found in CSV. Check format: first_name, last_name, phone (10 digits)', { status: 400 })
    }
    
    let imported = 0
    let updated = 0
    
    await prisma.$transaction(async (tx) => {
      for (const r of rows) {
        const existing = await tx.entry.findUnique({ where: { phone: r.phone } })
        
        if (existing) {
          await tx.entry.update({
            where: { phone: r.phone },
            data: { firstName: r.firstName, lastName: r.lastName }
          })
          updated++
        } else {
          await tx.entry.create({ data: r })
          imported++
        }
      }
    })
    
    return Response.json({ 
      ok: true, 
      imported, 
      updated,
      total: imported + updated,
      message: `Success! ${imported} new entries added, ${updated} existing entries updated.`
    })
    
  } catch (error) {
    console.error('CSV Import Error:', error)
    return new Response(
      error instanceof Error ? error.message : 'Unknown error during import', 
      { status: 500 }
    )
  }
}
