import Link from 'next/link'

export default function Page() {
  return (
    <main className="max-w-5xl mx-auto p-6 space-y-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {process.env.NEXT_PUBLIC_LOGO_URL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={process.env.NEXT_PUBLIC_LOGO_URL!} alt="Logo" className="h-10 w-10 object-contain rounded" />
          ) : null}
          <h1 className="text-2xl font-bold">MAHARAJA BELLEROSE – Lucky Draw</h1>
        </div>
      </header>

      <div className="grid sm:grid-cols-3 gap-6">
        <Link href="/draw" className="card hover:opacity-90">
          <h2 className="text-xl font-semibold mb-2">🎰 Draw Screen</h2>
          <p className="text-sm opacity-80">Run the live raffle with the rolling barrel animation.</p>
        </Link>
        <a href="/kiosk" className="card hover:opacity-90 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20 block">
          <h2 className="text-xl font-semibold mb-2">📺 Kiosk Monitor</h2>
          <p className="text-sm opacity-80">Full-screen display mode for monitors and large screens.</p>
        </a>
        <Link href="/admin" className="card hover:opacity-90">
          <h2 className="text-xl font-semibold mb-2">⚙️ Admin</h2>
          <p className="text-sm opacity-80">Add entries, import CSV, export entries and winners, settings.</p>
        </Link>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <h3 className="font-semibold text-blue-900 mb-2">📱 Quick Access</h3>
        <div className="space-y-1 text-sm text-blue-700">
          <p><strong>Kiosk Mode:</strong> <code>/kiosk</code> or <code>/public/kiosk.html</code></p>
          <p><strong>Keyboard Shortcuts in Kiosk:</strong> Space/Enter = Draw, F = Fullscreen, R = Refresh</p>
          <p><strong>Total Participants:</strong> 267 entries loaded and ready</p>
        </div>
      </div>
    </main>
  )
}
