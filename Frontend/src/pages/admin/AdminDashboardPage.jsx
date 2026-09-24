import { ArrowRight, CalendarDays, CarFront, CircleDollarSign, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useGetAdminBookingsQuery, useGetAdminDashboardQuery } from '../../app/store.js'
import { ErrorState, LoadingState, StatusBadge } from '../../components/ui.jsx'
import { formatDate, money, vehicleName } from '../../lib/format.js'

const cards = [
  { key: 'totalVehicles', label: 'Fleet vehicles', Icon: CarFront, accent: 'bg-lime-100 text-lime-800' },
  { key: 'totalBookings', label: 'Total bookings', Icon: CalendarDays, accent: 'bg-blue-50 text-blue-700' },
  { key: 'totalUsers', label: 'Customers', Icon: UsersRound, accent: 'bg-violet-50 text-violet-700' },
  { key: 'availableVehicles', label: 'Available now', Icon: CircleDollarSign, accent: 'bg-amber-50 text-amber-700' },
]

export default function AdminDashboardPage() {
  const dashboard = useGetAdminDashboardQuery()
  const bookings = useGetAdminBookingsQuery()
  if (dashboard.isLoading || bookings.isLoading) return <LoadingState label="Preparing your overview" />
  if (dashboard.isError) return <ErrorState message={dashboard.error?.message} onRetry={dashboard.refetch} />
  const stats = dashboard.data || {}
  return <div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ key, label, Icon, accent }) => <article key={key} className="rounded-2xl border border-slate-200 bg-white p-4"><span className={`grid size-10 place-items-center rounded-xl ${accent}`}><Icon size={18} /></span><p className="mt-5 text-2xl font-extrabold tracking-[-0.05em]">{stats[key] ?? '—'}</p><p className="mt-1 text-xs font-medium text-slate-500">{label}</p></article>)}</div>
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4"><div><h2 className="text-sm font-bold">Recent bookings</h2><p className="mt-1 text-xs text-slate-500">The latest activity across your fleet</p></div><Link to="/admin/bookings" className="inline-flex items-center gap-1.5 text-xs font-bold">View all <ArrowRight size={14} /></Link></div>
      {bookings.isError ? <div className="p-4"><ErrorState message={bookings.error?.message} onRetry={bookings.refetch} /></div> : bookings.data?.length ? <div className="divide-y divide-slate-100">{bookings.data.slice(0, 5).map((booking) => <div key={booking.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="truncate text-sm font-bold">{vehicleName(booking.vehicle)}</p><p className="mt-1 truncate text-xs text-slate-500">{booking.user?.firstName} {booking.user?.lastName} · {formatDate(booking.startDate)} – {formatDate(booking.endDate)}</p></div><div className="flex items-center gap-3"><StatusBadge status={booking.status} /><span className="text-sm font-bold">{money(booking.totalPrice)}</span></div></div>)}</div> : <div className="px-5 py-10 text-center text-sm text-slate-500">No bookings yet.</div>}
    </div>
  </div>
}
