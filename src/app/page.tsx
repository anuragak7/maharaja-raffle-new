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
          <h1 className="text-2xl font-bold">Hicksville Farmers Market – Lucky Draw</h1>
        </div>
      </header>

      <div className="grid sm:grid-cols-2 gap-6">
        <Link href="/draw" className="card hover:opacity-90">
          <h2 className="text-xl font-semibold mb-2">Draw Screen</h2>
          <p className="text-sm opacity-80">Run the live raffle with the rolling barrel animation.</p>
        </Link>
        <Link href="/admin" className="card hover:opacity-90">
          <h2 className="text-xl font-semibold mb-2">Admin</h2>
          <p className="text-sm opacity-80">Add entries, import CSV, export entries and winners, settings.</p>
        </Link>
      </div>
    </main>
  )
}
