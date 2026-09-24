import { useState } from 'react'
import { ArrowDownRight, ArrowLeft, CalendarDays, CarFront, MapPin, Play, RotateCcw, X } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useCancelBookingMutation, useGetBookingQuery, useReturnRentalMutation, useStartRentalMutation } from '../app/store.js'
import { Button, Dialog, ErrorState, LoadingState, StatusBadge, useToast } from '../components/ui.jsx'
import { formatDate, getErrorMessage, money, vehicleImage, vehicleName } from '../lib/format.js'
import { useSelector } from 'react-redux'

export default function BookingDetailPage() {
  const { id } = useParams()
  const { user } = useSelector((state) => state.auth)
  const { data: booking, isLoading, isError, error, refetch } = useGetBookingQuery(id, { skip: !user })
  const [cancelBooking, { isLoading: cancelling }] = useCancelBookingMutation()
  const [startRental, { isLoading: starting }] = useStartRentalMutation()
  const [returnRental, { isLoading: returning }] = useReturnRentalMutation()
  const [active, setActive] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const notify = useToast()

  if (!user) return <Navigate to={`/login?redirect=${encodeURIComponent(`/bookings/${id}`)}`} replace />
  if (isLoading) return <div className="mx-auto max-w-3xl px-5 py-12"><LoadingState label="Loading booking details" /></div>
  if (isError) return <div className="mx-auto max-w-3xl px-5 py-10"><ErrorState message={error?.message} onRetry={refetch} /><Link to={user.role === 'ADMIN' ? '/admin/bookings' : '/my-bookings'} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold"><ArrowLeft size={16} /> Back to bookings</Link></div>

  const vehicle = booking.vehicle || {}
  const isConfirmed = booking.status === 'CONFIRMED'
  const start = async () => {
    try { await startRental(booking.id).unwrap(); setActive(true); notify('Rental started. Enjoy the drive!') }
    catch (requestError) { const message = getErrorMessage(requestError); if (message.toLowerCase().includes('already started')) { setActive(true); notify('This rental is already underway.') } else notify(message, 'error') }
  }
  const returnCar = async () => {
    try { await returnRental(booking.id).unwrap(); setActive(false); notify('Vehicle returned. Thanks for choosing Drive Club!') }
    catch (requestError) { notify(getErrorMessage(requestError), 'error') }
  }
  const cancel = async () => {
    try { await cancelBooking(booking.id).unwrap(); setConfirmCancel(false); notify('Booking cancelled.') }
    catch (requestError) { notify(getErrorMessage(requestError), 'error') }
  }

  return <div className="mx-auto max-w-[1100px] px-5 pb-16 pt-8 sm:px-10 sm:pt-10">
    <Link to={user.role === 'ADMIN' ? '/admin/bookings' : '/my-bookings'} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-950"><ArrowLeft size={16} /> Back to bookings</Link>
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
      <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white">
        <div className="relative"><img src={vehicleImage(vehicle)} alt={vehicleName(vehicle)} className="aspect-[1.8/1] w-full bg-slate-100 object-cover" /><span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em]">Booking #{booking.id}</span></div>
        <div className="p-5 sm:p-7"><div className="flex flex-wrap items-center gap-3"><StatusBadge status={active ? 'ACTIVE' : booking.status} /><span className="text-xs font-semibold text-slate-400">Booked {formatDate(booking.bookingDate)}</span></div><h1 className="mt-3 text-3xl font-semibold tracking-[-0.065em]">{vehicleName(vehicle)}</h1><p className="mt-2 text-sm text-slate-500">{vehicle.year} {vehicle.vehicleType} · {vehicle.transmission} · {vehicle.seats} seats</p>
          {user.role === 'ADMIN' && <div className="mt-5 rounded-xl bg-slate-50 p-4"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Customer</p><p className="mt-1 text-sm font-semibold">{booking.user?.firstName} {booking.user?.lastName}</p><p className="mt-0.5 text-xs text-slate-500">{booking.user?.email}</p></div>}
          <div className="mt-6 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-slate-200 p-4"><span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400"><CalendarDays size={14} />Trip dates</span><p className="mt-2 text-sm font-bold">{formatDate(booking.startDate)} <ArrowDownRight size={13} className="mx-1 inline text-slate-400" /> {formatDate(booking.endDate)}</p></div><div className="rounded-2xl border border-slate-200 p-4"><span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400"><MapPin size={14} />Pickup · Drop-off</span><p className="mt-2 text-sm font-bold">{booking.pickupLocation} <span className="text-slate-400">→</span> {booking.dropoffLocation}</p></div></div>
        </div>
      </section>
      <aside className="h-fit rounded-[1.75rem] border border-slate-200 bg-white p-5 sm:p-6"><p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">Booking summary</p><div className="mt-4 flex items-center justify-between text-sm"><span className="text-slate-500">Daily rate</span><span className="font-semibold">{money(vehicle.dailyRate)}</span></div><div className="mt-3 flex items-center justify-between text-sm"><span className="text-slate-500">Total trip cost</span><span className="text-lg font-extrabold">{money(booking.totalPrice)}</span></div><div className="my-5 h-px bg-slate-100" />
        {active ? <Button className="w-full" disabled={returning} onClick={returnCar}><RotateCcw size={15} />{returning ? 'Returning...' : 'Return vehicle'}</Button> : isConfirmed && <div className="space-y-2"><Button className="w-full" disabled={starting} onClick={start}><Play size={14} />{starting ? 'Starting...' : 'Start rental'}</Button><Button variant="secondary" className="w-full" onClick={() => setConfirmCancel(true)}><X size={15} />Cancel booking</Button></div>}
        {booking.status === 'COMPLETED' && <div className="rounded-xl bg-emerald-50 p-3 text-center text-xs font-semibold text-emerald-800">Trip completed. Thanks for riding with us.</div>}{booking.status === 'CANCELLED' && <div className="rounded-xl bg-rose-50 p-3 text-center text-xs font-semibold text-rose-800">This booking has been cancelled.</div>}
        <Link to="/vehicles" className="mt-5 flex items-center justify-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-950"><CarFront size={15} /> Find another car</Link>
      </aside>
    </div>
    <Dialog open={confirmCancel} onClose={() => setConfirmCancel(false)} title="Cancel this booking?" description="Your booking will be cancelled and this vehicle will become available again."><div className="grid grid-cols-2 gap-2"><Button variant="secondary" onClick={() => setConfirmCancel(false)}>Keep booking</Button><Button variant="danger" disabled={cancelling} onClick={cancel}>{cancelling ? 'Cancelling...' : 'Cancel booking'}</Button></div></Dialog>
  </div>
}
