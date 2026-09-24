import { useMemo, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, CalendarDays, CarFront, CircleCheck, Clock3, MapPin, Play, RotateCcw, X } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import { useCancelBookingMutation, useGetMyBookingsQuery, useReturnRentalMutation, useStartRentalMutation } from '../app/store.js'
import { Button, Dialog, ErrorState, LoadingState, StatusBadge, useToast } from '../components/ui.jsx'
import { formatDate, getErrorMessage, money, vehicleImage, vehicleName } from '../lib/format.js'
import { useSelector } from 'react-redux'

export default function BookingsPage() {
  const { user } = useSelector((state) => state.auth)
  const { data: bookings = [], isLoading, isError, error, refetch } = useGetMyBookingsQuery(undefined, { skip: !user || user.role !== 'CUSTOMER' })
  const [cancelBooking, { isLoading: cancelling }] = useCancelBookingMutation()
  const [startRental, { isLoading: starting }] = useStartRentalMutation()
  const [returnRental, { isLoading: returning }] = useReturnRentalMutation()
  const [activeIds, setActiveIds] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [cancelTarget, setCancelTarget] = useState(null)
  const notify = useToast()

  const visibleBookings = useMemo(() => filter === 'ALL' ? bookings : bookings.filter((booking) => booking.status === filter), [bookings, filter])
  if (!user) return <Navigate to="/login?redirect=%2Fmy-bookings" replace />
  if (user.role !== 'CUSTOMER') return <Navigate to="/admin" replace />

  const handleCancel = async () => {
    if (!cancelTarget) return
    try {
      await cancelBooking(cancelTarget.id).unwrap()
      notify('Booking cancelled. The vehicle is available again.')
      setCancelTarget(null)
    } catch (requestError) { notify(getErrorMessage(requestError), 'error') }
  }

  const handleStart = async (booking) => {
    try {
      await startRental(booking.id).unwrap()
      setActiveIds((ids) => [...new Set([...ids, booking.id])])
      notify('Rental started. Enjoy the drive!')
    } catch (requestError) {
      const message = getErrorMessage(requestError)
      if (message.toLowerCase().includes('already started')) {
        setActiveIds((ids) => [...new Set([...ids, booking.id])])
        notify('This rental is already underway. You can return it when you’re done.')
      } else notify(message, 'error')
    }
  }

  const handleReturn = async (booking) => {
    try {
      await returnRental(booking.id).unwrap()
      setActiveIds((ids) => ids.filter((id) => id !== booking.id))
      notify('Vehicle returned. Thanks for choosing Drive Club!')
    } catch (requestError) { notify(getErrorMessage(requestError), 'error') }
  }

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-16 pt-9 sm:px-10 sm:pt-12">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-lime-700">Your journeys</p><h1 className="mt-2 text-4xl font-semibold tracking-[-0.065em] sm:text-5xl">My bookings.</h1><p className="mt-3 text-sm text-slate-500">All your trips, in one place. Pick up right where you left off.</p></div><div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold"><CarFront size={17} className="text-lime-700" />{bookings.length} {bookings.length === 1 ? 'trip' : 'trips'}</div></div>
      <div className="mt-8 flex gap-2 overflow-x-auto pb-1">{['ALL', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((status) => <button key={status} onClick={() => setFilter(status)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${filter === status ? 'bg-slate-950 text-white' : 'border border-slate-200 bg-white text-slate-500 hover:text-slate-950'}`}>{status === 'ALL' ? 'All trips' : status.charAt(0) + status.slice(1).toLowerCase()}</button>)}</div>
      {isLoading ? <LoadingState label="Loading your trips" /> : isError ? <div className="mt-5"><ErrorState message={error?.message} onRetry={refetch} /></div> : visibleBookings.length ? <div className="mt-5 space-y-4">{visibleBookings.map((booking) => {
        const vehicle = booking.vehicle || {}
        const active = activeIds.includes(booking.id)
        const canAct = booking.status === 'CONFIRMED'
        return <article key={booking.id} className="grid overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white sm:grid-cols-[220px_1fr]">
          <div className="relative min-h-48 bg-slate-100 sm:min-h-0"><img src={vehicleImage(vehicle)} alt={vehicleName(vehicle)} className="absolute inset-0 size-full object-cover" /><div className="absolute left-3 top-3"><StatusBadge status={active ? 'ACTIVE' : booking.status} /></div></div>
          <div className="min-w-0 p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row"><div className="min-w-0"><Link to={`/bookings/${booking.id}`} className="text-[10px] font-bold uppercase tracking-[0.17em] text-slate-400 hover:text-slate-800">Booking #{booking.id} · {vehicle.vehicleType || 'Vehicle'} · Details</Link><h2 className="mt-1 truncate text-xl font-bold tracking-[-0.04em]">{vehicleName(vehicle)}</h2><p className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500"><MapPin size={13} className="text-lime-700" />{booking.pickupLocation || vehicle.location}</p></div><div className="sm:text-right"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Total trip</p><p className="mt-1 text-xl font-extrabold tracking-[-0.05em]">{money(booking.totalPrice)}</p></div></div>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-slate-100 py-3 text-xs font-medium text-slate-600"><span className="inline-flex items-center gap-1.5"><CalendarDays size={14} className="text-slate-400" />{formatDate(booking.startDate)} <ArrowDownRight size={13} /> {formatDate(booking.endDate)}</span><span className="inline-flex items-center gap-1.5"><Clock3 size={14} className="text-slate-400" />Booked {formatDate(booking.bookingDate)}</span></div>
            <div className="mt-4 flex flex-wrap gap-2">{active ? <Button className="min-h-10" disabled={returning} onClick={() => handleReturn(booking)}><RotateCcw size={15} />{returning ? 'Returning...' : 'Return vehicle'}</Button> : canAct && <Button className="min-h-10" disabled={starting} onClick={() => handleStart(booking)}><Play size={14} />{starting ? 'Starting...' : 'Start rental'}</Button>}{canAct && !active && <Button variant="secondary" className="min-h-10" onClick={() => setCancelTarget(booking)}><X size={15} />Cancel booking</Button>}{booking.status === 'COMPLETED' && <span className="inline-flex min-h-10 items-center gap-2 px-2 text-xs font-semibold text-emerald-700"><CircleCheck size={16} />Trip complete</span>}</div>
          </div>
        </article>
      })}</div> : <div className="mt-5 rounded-[1.5rem] border border-dashed border-slate-300 bg-white px-5 py-14 text-center"><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-lime-100 text-lime-800"><CarFront size={22} /></span><h2 className="mt-4 text-lg font-bold">{filter === 'ALL' ? 'Your next trip starts here' : `No ${filter.toLowerCase()} trips`}</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">{filter === 'ALL' ? 'Find a ride for the journey you’ve been thinking about.' : 'Try another filter to find the trip you’re looking for.'}</p><Link to="/vehicles"><Button className="mt-5">Browse cars <ArrowUpRight size={16} /></Button></Link></div>}
      <Dialog open={Boolean(cancelTarget)} onClose={() => setCancelTarget(null)} title="Cancel this booking?" description="The vehicle will become available again. You can book it another time.">
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm font-bold">{vehicleName(cancelTarget?.vehicle)}</p><p className="mt-1 text-xs text-slate-500">{formatDate(cancelTarget?.startDate)} – {formatDate(cancelTarget?.endDate)}</p></div><div className="mt-5 grid grid-cols-2 gap-2"><Button variant="secondary" onClick={() => setCancelTarget(null)}>Keep booking</Button><Button variant="danger" disabled={cancelling} onClick={handleCancel}>{cancelling ? 'Cancelling...' : 'Cancel trip'}</Button></div>
      </Dialog>
    </div>
  )
}
