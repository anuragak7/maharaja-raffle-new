'use client'

import { useEffect, useState } from 'react'

type Entry = { id: string; firstName: string; lastName: string; phone: string; hasWon: boolean }

export default function AdminPage() {
  const [firstName, setFirst] = useState('')
  const [lastName, setLast] = useState('')
  const [phone, setPhone] = useState('')
  const [entries, setEntries] = useState<Entry[]>([])
  const [adminPass, setAdminPass] = useState('')

  useEffect(() => {
    // Get admin password from localStorage only on client side
    if (typeof window !== 'undefined') {
      const savedPass = localStorage.getItem('ADMIN_PASSWORD') || ''
      setAdminPass(savedPass)
    }
    
    // Load entries
    load()
  }, [])

  async function load() {
    try {
      const res = await fetch('/api/entries')
      if (res.ok) {
        const data = await res.json()
        setEntries(data.entries || [])
      } else {
        console.error('Failed to load entries:', res.status)
        setEntries([])
      }
    } catch (error) {
      console.error('Error loading entries:', error)
      setEntries([])
    }
  }

  async function addOne(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/entries', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, phone })
    })
    if (!res.ok) return alert(await res.text())
    setFirst(''); setLast(''); setPhone('')
    await load()
  }

  async function del(id: string) {
    const res = await fetch('/api/entries?id='+id, { method: 'DELETE', headers: { 'authorization': 'Bearer ' + adminPass } })
    if (!res.ok) return alert(await res.text())
    await load()
  }

  async function resetWinners() {
    const res = await fetch('/api/reset', { method: 'POST', headers: { 'authorization': 'Bearer ' + adminPass } })
    if (!res.ok) return alert(await res.text())
    await load()
  }

  function savePass() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ADMIN_PASSWORD', adminPass)
      alert('Saved admin password locally for authenticated actions.')
    }
  }

  return (
    <main className="min-h-screen max-w-5xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin</h1>
        <a className="btn" href="/">Home</a>
      </header>

      <section className="card">
        <div className="font-semibold mb-3">Admin Password (for deletes & reset)</div>
        <div className="flex gap-2">
          <input value={adminPass} onChange={e=>setAdminPass(e.target.value)} className="w-full rounded-xl px-3 py-2 bg-white/10 border border-white/20" placeholder="ADMIN_PASSWORD from server env" />
          <button className="btn" onClick={savePass}>Save</button>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <form onSubmit={addOne} className="card space-y-3">
          <div className="font-semibold">Add Single Entry</div>
          <input value={firstName} onChange={e=>setFirst(e.target.value)} required placeholder="First Name" className="w-full rounded-xl px-3 py-2 bg-white/10 border border-white/20" />
          <input value={lastName} onChange={e=>setLast(e.target.value)} required placeholder="Last Name" className="w-full rounded-xl px-3 py-2 bg-white/10 border border-white/20" />
          <input value={phone} onChange={e=>setPhone(e.target.value)} required placeholder="Phone (10 digits)" className="w-full rounded-xl px-3 py-2 bg-white/10 border border-white/20" />
          <button className="btn" type="submit">Add</button>
        </form>

        <div className="card space-y-3">
          <div className="font-semibold">Bulk / Export / Reset</div>
          <div className="flex gap-2 flex-wrap">
            <a className="btn" href="/api/entries/export">Export Entries CSV</a>
            <a className="btn" href="/api/winners/export">Export Winners CSV</a>
            <button className="btn" onClick={resetWinners}>Reset All Winners</button>
          </div>
          <div className="text-sm opacity-80">CSV import endpoint is available at <code>/api/entries/import</code> (POST form-data: file).</div>
        </div>
      </section>

      <section className="card">
        <div className="font-semibold mb-3">Entries</div>
        <div className="max-h-[50vh] overflow-auto divide-y divide-white/10">
          {entries.map(e => (
            <div key={e.id} className="py-2 flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold">{e.firstName} {e.lastName}</div>
                <div className="text-sm opacity-80">{e.phone}</div>
              </div>
              <div className="flex items-center gap-2">
                {e.hasWon && <span className="badge">Won</span>}
                <button className="btn" onClick={()=>del(e.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
