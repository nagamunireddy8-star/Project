import { useMemo, useState } from 'react'
import { CalendarDays, Play, RotateCcw, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCancelBookingMutation, useGetAdminBookingsQuery, useReturnRentalMutation, useStartRentalMutation } from '../../app/store.js'
import { Button, Dialog, ErrorState, LoadingState, StatusBadge, useToast } from '../../components/ui.jsx'
import { formatDate, getErrorMessage, money, vehicleName } from '../../lib/format.js'

export default function AdminBookingsPage() {
  const { data: bookings = [], isLoading, isError, error, refetch } = useGetAdminBookingsQuery()
  const [cancelBooking, cancelState] = useCancelBookingMutation()
  const [startRental, startState] = useStartRentalMutation()
  const [returnRental, returnState] = useReturnRentalMutation()
  const [activeIds, setActiveIds] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [cancelTarget, setCancelTarget] = useState(null)
  const notify = useToast()
  const filtered = useMemo(() => filter === 'ALL' ? bookings : bookings.filter((booking) => booking.status === filter), [bookings, filter])

  const cancel = async () => {
    try { await cancelBooking(cancelTarget.id).unwrap(); notify('Booking cancelled.'); setCancelTarget(null) }
    catch (requestError) { notify(getErrorMessage(requestError), 'error') }
  }
  const start = async (booking) => {
    try { await startRental(booking.id).unwrap(); setActiveIds((ids) => [...new Set([...ids, booking.id])]); notify('Rental started.') }
    catch (requestError) {
      const message = getErrorMessage(requestError)
      if (message.toLowerCase().includes('already started')) { setActiveIds((ids) => [...new Set([...ids, booking.id])]); notify('Rental is already underway.') }
      else notify(message, 'error')
    }
  }
  const returnCar = async (booking) => {
    try { await returnRental(booking.id).unwrap(); setActiveIds((ids) => ids.filter((id) => id !== booking.id)); notify('Vehicle returned.') }
    catch (requestError) { notify(getErrorMessage(requestError), 'error') }
  }

  return <div>
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h2 className="text-xl font-bold tracking-tight">Booking management</h2><p className="mt-1 text-sm text-slate-500">Review and manage every trip.</p></div><span className="text-xs font-semibold text-slate-400">{bookings.length} total bookings</span></div>
    <div className="mt-5 flex gap-2 overflow-x-auto pb-1">{['ALL', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((status) => <button key={status} onClick={() => setFilter(status)} className={`shrink-0 rounded-full px-3.5 py-2 text-[11px] font-bold ${filter === status ? 'bg-slate-950 text-white' : 'border border-slate-200 bg-white text-slate-500'}`}>{status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}</button>)}</div>
    {isLoading ? <LoadingState label="Loading bookings" /> : isError ? <div className="mt-4"><ErrorState message={error?.message} onRetry={refetch} /></div> : filtered.length ? <div className="mt-4 space-y-3">{filtered.map((booking) => {
      const active = activeIds.includes(booking.id)
      const canAct = booking.status === 'CONFIRMED'
      return <article key={booking.id} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-center"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><Link to={`/bookings/${booking.id}`} className="text-sm font-bold hover:underline">#{booking.id} · {vehicleName(booking.vehicle)}</Link><StatusBadge status={active ? 'ACTIVE' : booking.status} /></div><p className="mt-1.5 truncate text-xs text-slate-500">{booking.user?.firstName} {booking.user?.lastName} · {booking.user?.email}</p><p className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-500"><CalendarDays size={13} />{formatDate(booking.startDate)} – {formatDate(booking.endDate)} · {booking.pickupLocation}</p></div><div className="flex flex-wrap items-center gap-2"><span className="mr-2 text-sm font-bold">{money(booking.totalPrice)}</span>{active ? <Button className="min-h-9 px-3 text-xs" disabled={returnState.isLoading} onClick={() => returnCar(booking)}><RotateCcw size={14} />Return</Button> : canAct && <Button className="min-h-9 px-3 text-xs" disabled={startState.isLoading} onClick={() => start(booking)}><Play size={13} />Start rental</Button>}{canAct && !active && <Button variant="secondary" className="min-h-9 px-3 text-xs" onClick={() => setCancelTarget(booking)}><X size={14} />Cancel</Button>}</div></div></article>
    })}</div> : <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No bookings in this status.</div>}
    <Dialog open={Boolean(cancelTarget)} onClose={() => setCancelTarget(null)} title="Cancel this booking?" description="The customer's booking will be cancelled and the vehicle will be marked available."><div className="rounded-xl bg-slate-50 p-4 text-sm font-bold">#{cancelTarget?.id} · {vehicleName(cancelTarget?.vehicle)}</div><div className="mt-5 grid grid-cols-2 gap-2"><Button variant="secondary" onClick={() => setCancelTarget(null)}>Keep booking</Button><Button variant="danger" disabled={cancelState.isLoading} onClick={cancel}>{cancelState.isLoading ? 'Cancelling...' : 'Cancel booking'}</Button></div></Dialog>
  </div>
}
