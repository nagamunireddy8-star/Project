import { CarFront } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center px-6 py-4">
          <Link to="/" className="inline-flex items-center gap-2 font-semibold tracking-tight">
            <CarFront aria-hidden="true" className="size-5 text-blue-600" />
            <span>Vehicle Rentals</span>
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-12">
        <Outlet />
      </main>
    </div>
  )
}
