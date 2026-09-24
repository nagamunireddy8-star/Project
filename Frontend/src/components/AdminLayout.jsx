import { BarChart3, CarFront, ClipboardList, LayoutDashboard, UsersRound } from 'lucide-react'
import { Navigate, NavLink, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const links = [
  { to: '/admin', label: 'Overview', Icon: LayoutDashboard, end: true },
  { to: '/admin/fleet', label: 'Fleet', Icon: CarFront },
  { to: '/admin/bookings', label: 'Bookings', Icon: ClipboardList },
  { to: '/admin/users', label: 'Customers', Icon: UsersRound },
  { to: '/admin/reports', label: 'Reports', Icon: BarChart3 },
]

export default function AdminLayout() {
  const { user } = useSelector((state) => state.auth)
  if (!user) return <Navigate to="/login?redirect=%2Fadmin" replace />
  if (user.role !== 'ADMIN') return <Navigate to="/" replace />

  return <div className="mx-auto max-w-[1440px] px-5 pb-16 pt-8 sm:px-10 sm:pt-10">
    <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-lime-700">Drive Club workspace</p><h1 className="mt-1 text-3xl font-semibold tracking-[-0.06em] sm:text-4xl">Good morning, {user.firstName}.</h1></div><p className="text-xs text-slate-500">You’re signed in as an administrator</p></div>
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-2 lg:sticky lg:top-24">
        <nav aria-label="Administration" className="flex gap-1 overflow-x-auto lg:flex-col">{links.map(({ to, label, Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `inline-flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-3 text-xs font-semibold transition ${isActive ? 'bg-slate-950 text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950'}`}><Icon size={16} />{label}</NavLink>)}</nav>
      </aside>
      <section className="min-w-0"><Outlet /></section>
    </div>
  </div>
}
