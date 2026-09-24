import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowUpRight, CalendarDays, CarFront, Check, Fuel, MapPin, ShieldCheck, Settings2, UsersRound } from 'lucide-react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useCreateBookingMutation, useGetVehicleQuery } from '../app/store.js'
import { Button, Dialog, ErrorState, Field, LoadingState, useToast } from '../components/ui.jsx'
import { getErrorMessage, money, vehicleImage, vehicleName } from '../lib/format.js'
import { useSelector } from 'react-redux'

const localToday = () => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export default function VehicleDetailPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const [bookingOpen, setBookingOpen] = useState(false)
  const [startDate, setStartDate] = useState(searchParams.get('pickup') || localToday())
  const [endDate, setEndDate] = useState(searchParams.get('dropoff') || '')
  const [pickupLocation, setPickupLocation] = useState(searchParams.get('location') || '')
  const [dropoffLocation, setDropoffLocation] = useState(searchParams.get('location') || '')
  const { user } = useSelector((state) => state.auth)
  const { data: vehicle, isLoading, isError, error, refetch } = useGetVehicleQuery(id)
  const [createBooking, { isLoading: booking }] = useCreateBookingMutation()
  const notify = useToast()
  const navigate = useNavigate()
  const days = useMemo(() => {
    if (!startDate || !endDate) return 1
    const diff = Math.round((new Date(`${endDate}T00:00:00`) - new Date(`${startDate}T00:00:00`)) / 86400000)
    return Math.max(1, diff + 1)
  }, [startDate, endDate])

  const handleBooking = async (event) => {
    event.preventDefault()
    if (!user) {
      const returnTo = `/vehicles/${id}?pickup=${encodeURIComponent(startDate)}&dropoff=${encodeURIComponent(endDate)}`
      navigate(`/login?redirect=${encodeURIComponent(returnTo)}`)
      return
    }
    try {
      await createBooking({ vehicleId: Number(id), startDate, endDate, pickupLocation: pickupLocation || vehicle.location, dropoffLocation: dropoffLocation || vehicle.location }).unwrap()
      setBookingOpen(false)
      notify('Your booking is confirmed. Have a great trip!')
      navigate('/my-bookings')
    } catch (requestError) {
      notify(getErrorMessage(requestError), 'error')
    }
  }

  if (isLoading) return <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-10"><LoadingState label="Loading vehicle details" /></div>
  if (isError) return <div className="mx-auto max-w-3xl px-5 py-10 sm:px-10"><ErrorState message={error?.message} onRetry={refetch} /><Link to="/vehicles" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold"><ArrowLeft size={16} /> Back to all cars</Link></div>

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-16 pt-7 sm:px-10 sm:pt-10">
      <Link to="/vehicles" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-950"><ArrowLeft size={16} /> Back to the collection</Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.25fr_.75fr] lg:items-start">
        <div>
          <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-100"><img src={vehicleImage(vehicle)} alt={vehicleName(vehicle)} className="aspect-[1.45/1] w-full object-cover sm:aspect-[1.65/1]" /><span className="absolute left-4 top-4 rounded-full bg-white/90 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.14em] backdrop-blur">{vehicle.vehicleType}</span></div>
          {vehicle.imageUrls?.length > 1 && <div className="mt-3 grid grid-cols-4 gap-3">{vehicle.imageUrls.slice(0, 4).map((image, index) => <div key={`${image}-${index}`} className="overflow-hidden rounded-xl bg-slate-100"><img src={image} alt={`${vehicleName(vehicle)} view ${index + 1}`} className="aspect-[1.5/1] w-full object-cover" /></div>)}</div>}
          <div className="mt-8"><div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-400"><span>{vehicle.brand}</span><span className="text-lime-600">✳</span><span>{vehicle.year}</span><span className="text-lime-600">✳</span><span>{vehicle.location}</span></div><h1 className="mt-2 text-4xl font-semibold tracking-[-0.07em] sm:text-5xl">{vehicleName(vehicle)}</h1><p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600">{vehicle.description || 'A comfortable, well-appointed ride ready to take you where you want to go.'}</p></div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">{[{ Icon: UsersRound, label: 'Seats', value: `${vehicle.seats} people` }, { Icon: Settings2, label: 'Transmission', value: vehicle.transmission }, { Icon: Fuel, label: 'Fuel', value: vehicle.fuelType }, { Icon: MapPin, label: 'Location', value: vehicle.location }].map(({ Icon, label, value }) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4"><Icon size={18} className="text-lime-700" /><p className="mt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p><p className="mt-1 text-sm font-bold">{value}</p></div>)}</div>
          <div className="mt-8 rounded-2xl bg-slate-950 p-5 text-white sm:flex sm:items-center sm:gap-4"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-lime-300"><ShieldCheck size={20} /></span><div className="mt-3 sm:mt-0"><h2 className="text-sm font-bold">Ready when you are</h2><p className="mt-1 text-xs leading-5 text-slate-300">Your booking is handled directly by Drive Club. Choose your dates and we’ll take it from here.</p></div></div>
        </div>
        <aside className="sticky top-24 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Your ride, from</p><p className="mt-1 text-3xl font-extrabold tracking-[-0.07em]">{money(vehicle.dailyRate)}<span className="ml-1 text-sm font-medium tracking-normal text-slate-400">/ day</span></p></div><span className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] ${vehicle.available ? 'bg-lime-100 text-lime-900' : 'bg-slate-100 text-slate-500'}`}>{vehicle.available ? 'Available' : 'Currently booked'}</span></div>
          <div className="my-5 h-px bg-slate-100" />
          <div className="flex flex-col gap-3 text-sm"><div className="flex justify-between"><span className="text-slate-500">Daily rate</span><span className="font-semibold">{money(vehicle.dailyRate)}</span></div><div className="flex justify-between"><span className="text-slate-500">Pickup location</span><span className="font-semibold">{vehicle.location}</span></div></div>
          <Button className="mt-6 w-full" disabled={!vehicle.available} onClick={() => setBookingOpen(true)}>{vehicle.available ? <>Book this car <ArrowUpRight size={16} /></> : 'Not available right now'}</Button>
          <p className="mt-3 text-center text-[11px] leading-5 text-slate-400">No payment details needed to request your booking.</p>
          <div className="mt-6 rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold">Included with this ride</p><p className="mt-2 flex items-start gap-2 text-xs leading-5 text-slate-500"><Check size={14} className="mt-0.5 shrink-0 text-lime-700" />Transparent daily pricing, easy date selection, and a smooth pickup in {vehicle.location}.</p></div>
        </aside>
      </div>

      <Dialog open={bookingOpen} onClose={() => setBookingOpen(false)} title="Make it your trip" description={`${vehicleName(vehicle)} · ${money(vehicle.dailyRate)} per day`}>
        <form onSubmit={handleBooking} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2"><Field id="booking-start" label="Pick-up date" type="date" min={localToday()} value={startDate} onChange={(event) => setStartDate(event.target.value)} required /><Field id="booking-end" label="Return date" type="date" min={startDate || localToday()} value={endDate} onChange={(event) => setEndDate(event.target.value)} required /></div>
          <div className="grid gap-3 sm:grid-cols-2"><Field id="booking-pickup" label="Pick-up city" value={pickupLocation} onChange={(event) => setPickupLocation(event.target.value)} placeholder={vehicle.location} /><Field id="booking-dropoff" label="Drop-off city" value={dropoffLocation} onChange={(event) => setDropoffLocation(event.target.value)} placeholder={vehicle.location} /></div>
          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"><span className="inline-flex items-center gap-2 text-sm font-medium text-slate-600"><CalendarDays size={16} /> {days} {days === 1 ? 'day' : 'days'}</span><span className="text-sm font-bold">Estimated total <span className="ml-1 text-lg">{money(days * vehicle.dailyRate)}</span></span></div>
          {!user && <p className="text-xs leading-5 text-slate-500">You’ll be asked to log in before the booking is placed.</p>}
          <Button type="submit" disabled={booking || !startDate || !endDate || endDate < startDate} className="w-full">{booking ? 'Confirming...' : user ? 'Confirm booking' : 'Log in to continue'}{!booking && <ArrowUpRight size={16} />}</Button>
          {endDate && endDate < startDate && <p className="text-xs font-medium text-rose-600">Return date must be on or after your pick-up date.</p>}
        </form>
      </Dialog>
    </div>
  )
}
