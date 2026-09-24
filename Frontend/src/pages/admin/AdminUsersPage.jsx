import { useMemo, useState } from 'react'
import { Search, UsersRound } from 'lucide-react'
import { useGetAdminUsersQuery } from '../../app/store.js'
import { ErrorState, LoadingState, StatusBadge } from '../../components/ui.jsx'

export default function AdminUsersPage() {
  const { data: users = [], isLoading, isError, error, refetch } = useGetAdminUsersQuery()
  const [search, setSearch] = useState('')
  const filtered = useMemo(() => users.filter((user) => `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(search.toLowerCase())), [users, search])
  return <div>
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h2 className="text-xl font-bold tracking-tight">Customers</h2><p className="mt-1 text-sm text-slate-500">People who trust us with their journeys.</p></div><span className="text-xs font-semibold text-slate-400">{users.length} accounts</span></div>
    <label className="relative mt-5 block"><span className="sr-only">Search customers</span><Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or email" className="min-h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-slate-500" /></label>
    {isLoading ? <LoadingState label="Loading customers" /> : isError ? <div className="mt-4"><ErrorState message={error?.message} onRetry={refetch} /></div> : filtered.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2">{filtered.map((user) => <article key={user.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-lime-100 text-xs font-extrabold text-slate-800">{user.firstName?.[0]}{user.lastName?.[0]}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-bold">{user.firstName} {user.lastName}</h3><StatusBadge status={user.role} /></div><p className="mt-1 truncate text-xs text-slate-500">{user.email}</p></div><span className={`size-2 shrink-0 rounded-full ${user.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`} title={user.enabled ? 'Account enabled' : 'Account disabled'} /></article>)}</div> : <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><UsersRound size={22} className="mx-auto text-slate-400" /><p className="mt-3 text-sm font-semibold">No customers found</p></div>}
  </div>
}
