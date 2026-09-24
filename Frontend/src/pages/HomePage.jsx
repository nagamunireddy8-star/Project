import { useMemo, useState } from 'react'
import { ArrowRight, ArrowUpRight, CarFront, Check, Search, ShieldCheck, Sparkles, TimerReset } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useGetVehiclesQuery } from '../app/store.js'
import VehicleCard from '../components/VehicleCard.jsx'
import { Button, ErrorState, LoadingState, SelectField } from '../components/ui.jsx'

const localDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
const today = localDate(new Date())
const tomorrowDate = new Date()
tomorrowDate.setDate(tomorrowDate.getDate() + 1)
const tomorrow = localDate(tomorrowDate)

export default function HomePage() {
  const [location, setLocation] = useState('')
  const [vehicleType, setVehicleType] = useState('')
  const [pickup, setPickup] = useState(today)
  const [dropoff, setDropoff] = useState(tomorrow)
  const navigate = useNavigate()
  const { data: vehicles = [], isLoading, isError, error, refetch } = useGetVehiclesQuery({})
  const locations = useMemo(() => [...new Set(vehicles.map((vehicle) => vehicle.location).filter(Boolean))].sort(), [vehicles])
  const featured = vehicles.filter((vehicle) => vehicle.available).slice(0, 3)
  const search = (event) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (vehicleType) params.set('type', vehicleType)
    if (pickup) params.set('pickup', pickup)
    if (dropoff) params.set('dropoff', dropoff)
    navigate(`/vehicles?${params}`)
  }

  return <>
    <section className="relative isolate overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 -z-20 bg-[url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2200&q=90')] bg-cover bg-[center_58%] opacity-45" /><div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/15" /><div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/55 to-transparent" />
      <div className="mx-auto grid min-h-[610px] max-w-[1440px] content-center gap-10 px-5 py-16 sm:px-10 lg:min-h-[690px] lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-20">
        <div className="max-w-2xl"><div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold"><Sparkles size={14} className="text-lime-300" /> A better way to get there</div><h1 className="mt-6 text-5xl font-semibold leading-[0.99] tracking-[-0.075em] sm:text-6xl lg:text-[5.4rem]">Take the long way <span className="font-serif italic font-normal text-lime-300">home.</span></h1><p className="mt-6 max-w-lg text-base leading-7 text-slate-300 sm:text-lg">Find a car that makes the miles feel shorter. Pick your ride, set your dates, and let the good part begin.</p><div className="mt-8 flex flex-wrap gap-5 text-xs font-semibold text-white/75"><span className="inline-flex items-center gap-2"><Check size={15} className="text-lime-300" />Thoughtful rides</span><span className="inline-flex items-center gap-2"><Check size={15} className="text-lime-300" />Easy booking</span><span className="inline-flex items-center gap-2"><Check size={15} className="text-lime-300" />Flexible plans</span></div></div>
        <form onSubmit={search} className="rounded-[1.75rem] border border-white/15 bg-white p-4 text-slate-950 shadow-2xl sm:p-6 lg:ml-auto lg:w-full lg:max-w-[510px]"><div className="flex items-start justify-between gap-4 px-1 pb-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-lime-700">Start exploring</p><h2 className="mt-1 text-xl font-bold tracking-[-0.04em]">Where are you headed?</h2></div><span className="grid size-10 place-items-center rounded-2xl bg-lime-100 text-lime-800"><CarFront size={20} /></span></div>
          <div className="grid gap-3 sm:grid-cols-2"><SelectField id="home-location" label="Pick-up city" value={location} onChange={(event) => setLocation(event.target.value)} className="sm:col-span-2"><option value="">Anywhere</option>{locations.map((city) => <option key={city}>{city}</option>)}</SelectField><label htmlFor="home-pickup" className="block text-sm font-semibold text-slate-700">Pick-up date<input id="home-pickup" type="date" min={today} value={pickup} onChange={(event) => setPickup(event.target.value)} className="mt-2 block min-h-12 w-full rounded-xl border border-slate-200 px-3.5 text-sm font-normal outline-none focus:border-slate-500" /></label><label htmlFor="home-return" className="block text-sm font-semibold text-slate-700">Return date<input id="home-return" type="date" min={pickup} value={dropoff} onChange={(event) => setDropoff(event.target.value)} className="mt-2 block min-h-12 w-full rounded-xl border border-slate-200 px-3.5 text-sm font-normal outline-none focus:border-slate-500" /></label><SelectField id="home-type" label="Vehicle type" value={vehicleType} onChange={(event) => setVehicleType(event.target.value)} className="sm:col-span-2"><option value="">Any kind of ride</option><option>SUV</option><option>Sedan</option><option>MPV</option><option>Hatchback</option></SelectField></div>
          <Button type="submit" className="mt-4 w-full"><Search size={16} />Find your ride</Button><p className="mt-3 text-center text-[11px] text-slate-400">Search now, choose your favorite later.</p>
        </form>
      </div>
    </section>
    <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-10 sm:py-20"><div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-lime-700">Your kind of car</p><h2 className="mt-3 max-w-md text-4xl font-semibold leading-tight tracking-[-0.065em] sm:text-5xl">The right ride changes everything.</h2></div><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><p className="max-w-md text-sm leading-6 text-slate-500">From quick city escapes to the scenic route, find a car that fits the trip you have in mind.</p><Link to="/vehicles" className="inline-flex shrink-0 items-center gap-2 text-sm font-bold">Browse all cars <ArrowRight size={16} /></Link></div></div>
      {isError ? <div className="mt-8"><ErrorState message={error?.message} onRetry={refetch} /></div> : isLoading ? <div className="mt-8"><LoadingState label="Finding the good ones" /></div> : featured.length ? <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{featured.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}</div> : <div className="mt-8 rounded-3xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">No cars are ready right now. Check back soon.</div>}
    </section>
    <section className="mx-auto max-w-[1440px] px-5 pb-16 sm:px-10"><div className="overflow-hidden rounded-[2rem] bg-lime-200 px-6 py-8 sm:px-10 sm:py-10 lg:px-14"><div className="grid gap-9 lg:grid-cols-[.85fr_1.15fr] lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-lime-950/60">A little more freedom</p><h2 className="mt-3 max-w-md text-3xl font-semibold leading-tight tracking-[-0.06em] sm:text-4xl">Good plans deserve great wheels.</h2><p className="mt-4 max-w-md text-sm leading-6 text-slate-700">Make the weekend yours. Choose from a considered collection and book in just a few clicks.</p><Link to="/vehicles"><Button className="mt-6">Explore the collection <ArrowUpRight size={16} /></Button></Link></div><div className="grid gap-3 sm:grid-cols-3">{[{ Icon: ShieldCheck, title: 'A smooth start', text: 'Simple booking from the first click.' }, { Icon: TimerReset, title: 'Your time', text: 'Dates and plans that suit your trip.' }, { Icon: Sparkles, title: 'Great rides', text: 'Thoughtfully picked for every journey.' }].map((item) => <div key={item.title} className="rounded-2xl border border-white/70 bg-white/65 p-5"><span className="grid size-10 place-items-center rounded-xl bg-white"><item.Icon size={18} /></span><h3 className="mt-4 text-sm font-bold">{item.title}</h3><p className="mt-1.5 text-xs leading-5 text-slate-600">{item.text}</p></div>)}</div></div></div></section>
    <section className="overflow-hidden border-y border-slate-200 bg-white py-4"><div className="flex min-w-max animate-[marquee_26s_linear_infinite] items-center gap-8 px-5 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">{Array.from({ length: 6 }, (_, index) => <span className="inline-flex items-center gap-8" key={index}>Make room for the scenic route <span className="text-lime-500">✳</span> Your next story starts here <span className="text-lime-500">✳</span></span>)}</div></section>
  </>
}
