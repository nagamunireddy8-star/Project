import { Activity, ArrowDownRight, ArrowUpRight, CarFront, ChartNoAxesCombined, CircleDollarSign, CircleX, ShieldCheck } from 'lucide-react'
import { useGetBookingReportQuery, useGetVehicleReportQuery } from '../../app/store.js'
import { ErrorState, LoadingState } from '../../components/ui.jsx'
import { money } from '../../lib/format.js'

function Stat({ label, value, Icon, tone = 'lime' }) {
  const styles = tone === 'rose' ? 'bg-rose-50 text-rose-700' : tone === 'blue' ? 'bg-blue-50 text-blue-700' : 'bg-lime-100 text-lime-800'
  return <div className="rounded-2xl border border-slate-200 bg-white p-5"><span className={`grid size-10 place-items-center rounded-xl ${styles}`}><Icon size={18} /></span><p className="mt-5 text-2xl font-extrabold tracking-[-0.05em]">{value}</p><p className="mt-1 text-xs font-medium text-slate-500">{label}</p></div>
}

export default function AdminReportsPage() {
  const vehicles = useGetVehicleReportQuery()
  const bookings = useGetBookingReportQuery()
  if (vehicles.isLoading || bookings.isLoading) return <LoadingState label="Gathering report data" />
  if (vehicles.isError) return <ErrorState message={vehicles.error?.message} onRetry={vehicles.refetch} />
  const fleet = vehicles.data || {}
  const sales = bookings.data || {}
  const fleetUse = fleet.totalVehicles ? Math.round((fleet.utilizedVehicles / fleet.totalVehicles) * 100) : 0
  const confirmedRate = sales.totalBookings ? Math.round((sales.confirmedBookings / sales.totalBookings) * 100) : 0
  const cancelledRate = sales.totalBookings ? Math.round((sales.cancelledBookings / sales.totalBookings) * 100) : 0
  return <div>
    <div><h2 className="text-xl font-bold tracking-tight">Reports</h2><p className="mt-1 text-sm text-slate-500">A clear view of how things are moving.</p></div>
    {bookings.isError && <div className="mt-4"><ErrorState message={bookings.error?.message} onRetry={bookings.refetch} /></div>}
    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Stat label="Total bookings" value={sales.totalBookings ?? '—'} Icon={ChartNoAxesCombined} /><Stat label="Total revenue" value={money(sales.totalRevenue)} Icon={CircleDollarSign} tone="blue" /><Stat label="Confirmed bookings" value={sales.confirmedBookings ?? '—'} Icon={ShieldCheck} /><Stat label="Cancelled bookings" value={sales.cancelledBookings ?? '—'} Icon={CircleX} tone="rose" /></div>
    <div className="mt-5 grid gap-4 xl:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-lime-100 text-lime-800"><CarFront size={18} /></span><div><h3 className="text-sm font-bold">Fleet utilization</h3><p className="mt-0.5 text-xs text-slate-500">Availability across all vehicles</p></div></div><div className="mt-6 flex items-end justify-between"><p className="text-3xl font-extrabold tracking-[-0.06em]">{fleetUse}<span className="text-lg text-slate-400">%</span></p><p className="text-xs text-slate-500">{fleet.utilizedVehicles ?? 0} utilized · {fleet.availableVehicles ?? 0} available</p></div><div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-lime-400 transition-all" style={{ width: `${fleetUse}%` }} /></div><div className="mt-4 flex justify-between text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400"><span>{fleet.totalVehicles ?? 0} vehicles</span><span>{fleetUse}% utilized</span></div></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-700"><Activity size={18} /></span><div><h3 className="text-sm font-bold">Booking outcomes</h3><p className="mt-0.5 text-xs text-slate-500">Confirmed and cancelled share</p></div></div><div className="mt-6 space-y-5"><div><div className="flex justify-between text-xs"><span className="inline-flex items-center gap-2 font-semibold"><ArrowUpRight size={14} className="text-emerald-600" />Confirmed</span><span className="font-bold">{confirmedRate}% <span className="font-medium text-slate-400">({sales.confirmedBookings ?? 0})</span></span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-400" style={{ width: `${confirmedRate}%` }} /></div></div><div><div className="flex justify-between text-xs"><span className="inline-flex items-center gap-2 font-semibold"><ArrowDownRight size={14} className="text-rose-500" />Cancelled</span><span className="font-bold">{cancelledRate}% <span className="font-medium text-slate-400">({sales.cancelledBookings ?? 0})</span></span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-rose-300" style={{ width: `${cancelledRate}%` }} /></div></div></div></section>
    </div>
  </div>
}
