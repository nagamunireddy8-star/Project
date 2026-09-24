import { ArrowUpRight, Fuel, MapPin, Settings2, UsersRound } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { money, vehicleImage, vehicleName } from '../lib/format.js'

export default function VehicleCard({ vehicle }) {
  const location = useLocation()
  const query = location.search.includes('pickup=') || location.search.includes('dropoff=') ? location.search : ''
  return (
    <article className="group overflow-hidden rounded-[1.65rem] border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5">
      <Link to={`/vehicles/${vehicle.id}${query}`} className="relative block aspect-[1.52/1] overflow-hidden bg-slate-100">
        <img src={vehicleImage(vehicle)} alt={vehicleName(vehicle)} className="size-full object-cover transition duration-700 group-hover:scale-[1.04]" loading="lazy" />
        <span className="absolute left-4 top-4 rounded-full border border-white/40 bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-700 backdrop-blur">{vehicle.vehicleType}</span>
        <span className="absolute right-4 top-4 rounded-full bg-lime-300 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-900">{vehicle.available ? 'Ready to go' : 'Booked'}</span>
        <span className="absolute bottom-4 right-4 grid size-10 translate-y-2 place-items-center rounded-full bg-white text-slate-900 opacity-0 shadow-lg transition group-hover:translate-y-0 group-hover:opacity-100"><ArrowUpRight size={18} /></span>
      </Link>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{vehicle.brand} · {vehicle.year}</p><h3 className="mt-1 truncate text-lg font-bold tracking-[-0.04em]">{vehicleName(vehicle)}</h3></div>
          <div className="shrink-0 text-right"><p className="text-lg font-extrabold tracking-[-0.05em]">{money(vehicle.dailyRate)}</p><p className="text-[10px] font-medium text-slate-400">per day</p></div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-4 text-xs font-medium text-slate-500">
          <span className="inline-flex items-center gap-1.5"><UsersRound size={14} />{vehicle.seats} seats</span>
          <span className="inline-flex items-center gap-1.5"><Settings2 size={14} />{vehicle.transmission}</span>
          <span className="inline-flex items-center gap-1.5"><Fuel size={14} />{vehicle.fuelType}</span>
        </div>
        <p className="mt-3 inline-flex max-w-full items-center gap-1.5 truncate text-xs font-semibold text-slate-500"><MapPin size={13} className="shrink-0 text-lime-600" />{vehicle.location}</p>
      </div>
    </article>
  )
}
