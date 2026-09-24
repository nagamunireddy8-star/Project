import { useMemo, useState } from 'react'
import { ClipboardCheck, Edit3, Plus, Search, Trash2 } from 'lucide-react'
import { useCreateVehicleMutation, useCreateVehicleRegistrationMutation, useDeleteVehicleMutation, useGetAdminVehiclesQuery, useGetVehicleRegistrationQuery, useUpdateVehicleMutation } from '../../app/store.js'
import { Button, Dialog, ErrorState, Field, LoadingState, SelectField, StatusBadge, useToast } from '../../components/ui.jsx'
import { getErrorMessage, money, vehicleName } from '../../lib/format.js'

const emptyVehicle = { brand: '', model: '', vehicleType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', year: new Date().getFullYear(), seats: 5, dailyRate: '', location: '', registrationNumber: '', description: '', imageUrls: '' }
const localToday = () => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function VehicleFormDialog({ vehicle, onClose, onSaved }) {
  const [form, setForm] = useState(() => vehicle ? { ...vehicle, imageUrls: vehicle.imageUrls?.join('\n') || '' } : emptyVehicle)
  const [createVehicle, createState] = useCreateVehicleMutation()
  const [updateVehicle, updateState] = useUpdateVehicleMutation()
  const notify = useToast()
  const loading = createState.isLoading || updateState.isLoading
  const change = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))
  const submit = async (event) => {
    event.preventDefault()
    const payload = { ...form, year: Number(form.year), seats: Number(form.seats), dailyRate: Number(form.dailyRate), imageUrls: form.imageUrls.split(/\n|,/).map((url) => url.trim()).filter(Boolean) }
    delete payload.id
    delete payload.available
    try {
      if (vehicle) await updateVehicle({ id: vehicle.id, ...payload }).unwrap()
      else await createVehicle(payload).unwrap()
      notify(vehicle ? 'Vehicle details updated.' : 'Vehicle added to the fleet.')
      onSaved()
    } catch (error) { notify(getErrorMessage(error), 'error') }
  }
  return <Dialog open title={vehicle ? `Edit ${vehicleName(vehicle)}` : 'Add a vehicle'} description="Add the details your customers need to choose the right ride." onClose={onClose} size="max-w-2xl">
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <Field id="vehicle-brand" label="Brand" value={form.brand} onChange={change('brand')} required />
      <Field id="vehicle-model" label="Model" value={form.model} onChange={change('model')} required />
      <SelectField id="vehicle-type" label="Vehicle type" value={form.vehicleType} onChange={change('vehicleType')}><option>SUV</option><option>Sedan</option><option>MPV</option><option>Hatchback</option><option>Coupe</option><option>Van</option></SelectField>
      <SelectField id="vehicle-fuel" label="Fuel type" value={form.fuelType} onChange={change('fuelType')}><option>Petrol</option><option>Diesel</option><option>Electric</option><option>Hybrid</option><option>CNG</option></SelectField>
      <SelectField id="vehicle-transmission" label="Transmission" value={form.transmission} onChange={change('transmission')}><option>Automatic</option><option>Manual</option></SelectField>
      <Field id="vehicle-year" label="Model year" type="number" min="1980" max="2100" value={form.year} onChange={change('year')} required />
      <Field id="vehicle-seats" label="Seats" type="number" min="1" max="20" value={form.seats} onChange={change('seats')} required />
      <Field id="vehicle-rate" label="Daily rate (₹)" type="number" min="1" step="1" value={form.dailyRate} onChange={change('dailyRate')} required />
      <Field id="vehicle-location" label="Location" value={form.location} onChange={change('location')} required />
      <Field id="vehicle-reg-number" label="Registration number" value={form.registrationNumber} onChange={change('registrationNumber')} required />
      <label htmlFor="vehicle-description" className="block text-sm font-semibold text-slate-700 sm:col-span-2">Description<textarea id="vehicle-description" rows="3" value={form.description || ''} onChange={change('description')} className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-normal outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-100" /></label>
      <label htmlFor="vehicle-images" className="block text-sm font-semibold text-slate-700 sm:col-span-2">Image URLs <span className="font-normal text-slate-400">(one per line)</span><textarea id="vehicle-images" rows="3" value={form.imageUrls} onChange={change('imageUrls')} placeholder="https://..." className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-normal outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-100" /></label>
      <div className="flex gap-2 pt-1 sm:col-span-2"><Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Discard</Button><Button type="submit" disabled={loading} className="flex-1">{loading ? 'Saving...' : vehicle ? 'Save changes' : 'Add to fleet'}</Button></div>
    </form>
  </Dialog>
}

function RegistrationDialog({ vehicle, onClose }) {
  const { data, isLoading, isError, error, refetch } = useGetVehicleRegistrationQuery(vehicle?.id, { skip: !vehicle })
  const [createRegistration, { isLoading: saving }] = useCreateVehicleRegistrationMutation()
  const [form, setForm] = useState({ documentType: 'Registration', documentNumber: '', issuedDate: localToday(), expiryDate: `${Number(localToday().slice(0, 4)) + 5}${localToday().slice(4)}`, status: 'VALID' })
  const [attempted, setAttempted] = useState(false)
  const notify = useToast()
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))
  const submit = async (event) => {
    event.preventDefault()
    setAttempted(true)
    try {
      await createRegistration({ vehicleId: vehicle.id, ...form }).unwrap()
      notify('Vehicle registration saved.')
      onClose()
    } catch (requestError) { notify(getErrorMessage(requestError), 'error') }
  }
  const noRegistration = isError && error?.message?.toLowerCase().includes('registration not found')
  return <Dialog open title="Vehicle registration" description={`${vehicleName(vehicle)} · ${vehicle.registrationNumber}`} onClose={onClose}>
    {isLoading ? <LoadingState label="Checking registration" /> : data ? <div className="space-y-4"><div className="flex items-center justify-between rounded-2xl bg-emerald-50 p-4"><div className="flex items-center gap-2 text-sm font-bold text-emerald-800"><ClipboardCheck size={18} />Registration on file</div><StatusBadge status={data.status} /></div><dl className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 p-4 text-sm"><div><dt className="text-xs text-slate-400">Document type</dt><dd className="mt-1 font-semibold">{data.documentType}</dd></div><div><dt className="text-xs text-slate-400">Document number</dt><dd className="mt-1 break-all font-semibold">{data.documentNumber}</dd></div><div><dt className="text-xs text-slate-400">Issued</dt><dd className="mt-1 font-semibold">{data.issuedDate}</dd></div><div><dt className="text-xs text-slate-400">Expires</dt><dd className="mt-1 font-semibold">{data.expiryDate}</dd></div></dl></div> : noRegistration || attempted ? <form onSubmit={submit} className="space-y-4"><p className="rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">No registration is on file for this vehicle. Add the document details below.</p><div className="grid gap-3 sm:grid-cols-2"><Field id="doc-type" label="Document type" value={form.documentType} onChange={update('documentType')} required /><Field id="doc-number" label="Document number" value={form.documentNumber} onChange={update('documentNumber')} required /><Field id="doc-issued" label="Issued date" type="date" value={form.issuedDate} onChange={update('issuedDate')} required /><Field id="doc-expiry" label="Expiry date" type="date" value={form.expiryDate} onChange={update('expiryDate')} required /><SelectField id="doc-status" label="Status" value={form.status} onChange={update('status')}><option>VALID</option><option>EXPIRED</option><option>PENDING</option></SelectField></div><Button type="submit" disabled={saving} className="w-full">{saving ? 'Saving...' : 'Save registration'}</Button></form> : <ErrorState message={error?.message} onRetry={refetch} />}
  </Dialog>
}

export default function AdminFleetPage() {
  const { data: vehicles = [], isLoading, isError, error, refetch } = useGetAdminVehiclesQuery()
  const [deleteVehicle, { isLoading: deleting }] = useDeleteVehicleMutation()
  const [search, setSearch] = useState('')
  const [editTarget, setEditTarget] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [registrationTarget, setRegistrationTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const notify = useToast()
  const filtered = useMemo(() => vehicles.filter((vehicle) => `${vehicle.brand} ${vehicle.model} ${vehicle.location} ${vehicle.registrationNumber}`.toLowerCase().includes(search.toLowerCase())), [vehicles, search])
  const openCreate = () => { setEditTarget(null); setFormOpen(true) }
  const openEdit = (vehicle) => { setEditTarget(vehicle); setFormOpen(true) }
  const closeForm = () => setFormOpen(false)
  const remove = async () => {
    try { await deleteVehicle(deleteTarget.id).unwrap(); notify(`${vehicleName(deleteTarget)} removed from fleet.`); setDeleteTarget(null) }
    catch (requestError) { notify(getErrorMessage(requestError), 'error') }
  }
  return <div>
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h2 className="text-xl font-bold tracking-tight">Fleet management</h2><p className="mt-1 text-sm text-slate-500">Keep your collection and vehicle documents up to date.</p></div><Button onClick={openCreate}><Plus size={16} /> Add vehicle</Button></div>
    <label className="relative mt-5 block"><span className="sr-only">Search fleet</span><Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by model, city or registration" className="min-h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-slate-500" /></label>
    {isLoading ? <LoadingState label="Loading your fleet" /> : isError ? <div className="mt-4"><ErrorState message={error?.message} onRetry={refetch} /></div> : filtered.length ? <div className="mt-4 space-y-3">{filtered.map((vehicle) => <article key={vehicle.id} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-center"><div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-lime-100 text-slate-900"><span className="text-xs font-extrabold">{vehicle.brand.slice(0, 2).toUpperCase()}</span></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-bold">{vehicleName(vehicle)}</h3><StatusBadge status={vehicle.available ? 'AVAILABLE' : 'BOOKED'} /></div><p className="mt-1 truncate text-xs text-slate-500">{vehicle.year} · {vehicle.location} · {vehicle.registrationNumber}</p></div><div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end"><p className="text-sm font-bold">{money(vehicle.dailyRate)}<span className="ml-1 text-[10px] font-medium text-slate-400">/ day</span></p><div className="flex gap-1"><Button variant="secondary" className="min-h-9 px-3 text-xs" onClick={() => setRegistrationTarget(vehicle)}><ClipboardCheck size={14} />Docs</Button><Button variant="secondary" className="min-h-9 px-3 text-xs" onClick={() => openEdit(vehicle)}><Edit3 size={14} />Edit</Button><Button variant="ghost" className="min-h-9 px-3 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={() => setDeleteTarget(vehicle)} aria-label={`Delete ${vehicleName(vehicle)}`}><Trash2 size={14} /></Button></div></div></div></article>)}</div> : <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">{search ? 'No vehicles match your search.' : 'Your fleet is empty.'}</div>}
    {formOpen && <VehicleFormDialog key={editTarget?.id || 'new'} vehicle={editTarget} onClose={closeForm} onSaved={closeForm} />}
    {registrationTarget && <RegistrationDialog vehicle={registrationTarget} onClose={() => setRegistrationTarget(null)} />}
    <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title="Remove this vehicle?" description="This will permanently remove the vehicle from your fleet."><div className="rounded-xl bg-slate-50 p-4 text-sm font-bold">{vehicleName(deleteTarget)}</div><div className="mt-5 grid grid-cols-2 gap-2"><Button variant="secondary" onClick={() => setDeleteTarget(null)}>Keep vehicle</Button><Button variant="danger" disabled={deleting} onClick={remove}>{deleting ? 'Removing...' : 'Remove vehicle'}</Button></div></Dialog>
  </div>
}
