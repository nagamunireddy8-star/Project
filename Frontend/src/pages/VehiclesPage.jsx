import { useEffect, useMemo, useState } from 'react'
import { ArrowDownUp, CarFront, ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { useGetVehiclesQuery } from '../app/store.js'
import VehicleCard from '../components/VehicleCard.jsx'
import { Button, ErrorState, LoadingState } from '../components/ui.jsx'

export default function VehiclesPage() {
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState(params.get('search') || '')
  const [query, setQuery] = useState(params.get('search') || '')
  const [type, setType] = useState(params.get('type') || '')
  const [location, setLocation] = useState(params.get('location') || '')
  const [sort, setSort] = useState('recommended')
  const [mobileFilters, setMobileFilters] = useState(false)
  const { data: vehicles = [], isLoading, isFetching, isError, error, refetch } = useGetVehiclesQuery({ search: query })

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQuery(search.trim())
      const next = new URLSearchParams(params)
      search.trim() ? next.set('search', search.trim()) : next.delete('search')
      setParams(next, { replace: true })
    }, 280)
    return () => window.clearTimeout(timer)
  }, [search])

  const locations = useMemo(() => [...new Set(vehicles.map((vehicle) => vehicle.location).filter(Boolean))].sort(), [vehicles])
  const filtered = useMemo(() => {
    const result = vehicles.filter((vehicle) => vehicle.available && (!type || vehicle.vehicleType.toLowerCase() === type.toLowerCase()) && (!location || vehicle.location === location))
    if (sort === 'price-low') result.sort((a, b) => a.dailyRate - b.dailyRate)
    if (sort === 'price-high') result.sort((a, b) => b.dailyRate - a.dailyRate)
    if (sort === 'newest') result.sort((a, b) => b.year - a.year)
    return result
  }, [vehicles, type, location, sort])

  const clearFilters = () => {
    setSearch(''); setQuery(''); setType(''); setLocation(''); setSort('recommended')
    setParams({}, { replace: true })
  }

  const controls = <>
    <label className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Vehicle type<select value={type} onChange={(event) => { setType(event.target.value); const next = new URLSearchParams(params); event.target.value ? next.set('type', event.target.value) : next.delete('type'); setParams(next) }} className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium normal-case tracking-normal text-slate-800 outline-none focus:border-slate-500"><option value="">All types</option>{['SUV', 'Sedan', 'MPV', 'Hatchback', 'Coupe'].map((option) => <option key={option}>{option}</option>)}</select></label>
    <label className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Pick-up city<select value={location} onChange={(event) => { setLocation(event.target.value); const next = new URLSearchParams(params); event.target.value ? next.set('location', event.target.value) : next.delete('location'); setParams(next) }} className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium normal-case tracking-normal text-slate-800 outline-none focus:border-slate-500"><option value="">Any city</option>{locations.map((option) => <option key={option}>{option}</option>)}</select></label>
    <label className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Sort by<select value={sort} onChange={(event) => setSort(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium normal-case tracking-normal text-slate-800 outline-none focus:border-slate-500"><option value="recommended">Recommended</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="newest">Newest first</option></select></label>
  </>

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-16 pt-9 sm:px-10 sm:pt-12">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-lime-700">The collection</p><h1 className="mt-2 text-4xl font-semibold tracking-[-0.065em] sm:text-5xl">Find your next ride.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">A great day out starts with the right car. Take a look around.</p></div>
        <div className="flex gap-2"><button onClick={() => setMobileFilters(true)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold lg:hidden"><SlidersHorizontal size={16} /> Filters</button><div className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5"><ArrowDownUp size={15} className="text-slate-400" /><span className="text-sm font-semibold">{filtered.length} cars</span></div></div>
      </div>

      <div className="mt-8 grid gap-7 lg:grid-cols-[250px_1fr]">
        <aside className="hidden h-fit rounded-2xl border border-slate-200 bg-white p-5 lg:block">
          <div className="flex items-center justify-between"><h2 className="text-sm font-bold">Refine your search</h2><button onClick={clearFilters} className="text-xs font-semibold text-slate-400 hover:text-slate-950">Reset</button></div>
          <div className="mt-5 flex flex-col gap-5">{controls}</div>
        </aside>
        <div className="min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative flex-1"><span className="sr-only">Search makes and models</span><CarFront size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search a make or model..." className="min-h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-100" /></label>
            {(type || location || query) && <button onClick={clearFilters} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-500 hover:bg-slate-100"><X size={15} /> Clear</button>}
          </div>
          {isError ? <div className="mt-6"><ErrorState message={error?.message} onRetry={refetch} /></div> : isLoading ? <LoadingState label="Loading the collection" /> : filtered.length ? <div className={`mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 ${isFetching ? 'opacity-60' : ''}`}>{filtered.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}</div> : <div className="mt-5 flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-5 text-center"><span className="grid size-12 place-items-center rounded-2xl bg-lime-100 text-lime-800"><CarFront size={22} /></span><h2 className="mt-4 text-lg font-bold">No cars match just yet</h2><p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">Try a different search or clear some filters to see more cars.</p><Button variant="secondary" className="mt-4" onClick={clearFilters}>Clear filters</Button></div>}
        </div>
      </div>
      {mobileFilters && <div className="fixed inset-0 z-50 flex items-end bg-slate-950/50 sm:items-center sm:justify-center sm:p-5" onMouseDown={(event) => event.target === event.currentTarget && setMobileFilters(false)}><section className="w-full rounded-t-[2rem] bg-white p-5 sm:max-w-md sm:rounded-[2rem]"><div className="flex items-center justify-between"><h2 className="text-lg font-bold">Filters</h2><button onClick={() => setMobileFilters(false)} className="grid size-9 place-items-center rounded-xl bg-slate-100"><X size={17} /></button></div><div className="mt-5 flex flex-col gap-5">{controls}</div><div className="mt-6 grid grid-cols-2 gap-2"><Button variant="secondary" onClick={clearFilters}>Reset</Button><Button onClick={() => setMobileFilters(false)}>Show {filtered.length} cars <ChevronDown size={15} /></Button></div></section></div>}
    </div>
  )
}
