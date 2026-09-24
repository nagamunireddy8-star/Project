import { createContext, useContext, useEffect, useState } from 'react'
import { AlertCircle, Check, LoaderCircle, X } from 'lucide-react'

const ToastContext = createContext(() => {})

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const notify = (message, type = 'success') => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((items) => [...items, { id, message, type }])
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 4200)
  }

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[80] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-5 sm:items-end">
        {toasts.map((toast) => (
          <div key={toast.id} role="status" className={`pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 shadow-xl shadow-slate-900/10 ${toast.type === 'error' ? 'border-rose-200' : 'border-slate-200'}`}>
            <span className={`grid size-8 shrink-0 place-items-center rounded-xl ${toast.type === 'error' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-700'}`}>
              {toast.type === 'error' ? <AlertCircle size={17} /> : <Check size={17} />}
            </span>
            <p className="min-w-0 flex-1 text-sm font-medium text-slate-800">{toast.message}</p>
            <button onClick={() => setToasts((items) => items.filter((item) => item.id !== toast.id))} aria-label="Dismiss notification" className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><X size={16} /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-slate-950 text-white hover:bg-slate-800 focus-visible:ring-slate-400',
    accent: 'bg-lime-300 text-slate-950 hover:bg-lime-200 focus-visible:ring-lime-500',
    secondary: 'border border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-300',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-slate-300',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-400',
  }
  return <button className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55 ${variants[variant]} ${className}`} {...props}>{children}</button>
}

export function Spinner({ className = '' }) {
  return <LoaderCircle aria-hidden="true" className={`size-5 animate-spin ${className}`} />
}

export function LoadingState({ label = 'Loading' }) {
  return <div className="flex min-h-52 flex-col items-center justify-center gap-3 text-sm font-medium text-slate-500"><Spinner className="size-6 text-lime-600" /><span>{label}</span></div>
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800"><div className="flex items-start gap-3"><AlertCircle size={18} className="mt-0.5 shrink-0" /><div className="flex-1"><p className="font-semibold">We couldn’t load this right now</p><p className="mt-1 break-words text-rose-700">{message}</p>{onRetry && <button onClick={onRetry} className="mt-3 font-semibold underline underline-offset-4">Try again</button>}</div></div></div>
}

export function Dialog({ open, title, description, children, onClose, size = 'max-w-lg' }) {
  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => event.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-5" onMouseDown={(event) => event.target === event.currentTarget && onClose?.()}>
      <section role="dialog" aria-modal="true" aria-labelledby="dialog-title" className={`max-h-[92vh] w-full ${size} overflow-y-auto rounded-t-[2rem] bg-white p-5 shadow-2xl sm:rounded-[2rem] sm:p-7`}>
        <div className="flex items-start justify-between gap-5">
          <div><h2 id="dialog-title" className="text-xl font-bold tracking-tight text-slate-950">{title}</h2>{description && <p className="mt-1.5 text-sm leading-6 text-slate-500">{description}</p>}</div>
          <button onClick={onClose} aria-label="Close dialog" className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"><X size={17} /></button>
        </div>
        <div className="mt-6">{children}</div>
      </section>
    </div>
  )
}

export function Field({ label, id, className = '', ...props }) {
  return <label htmlFor={id} className={`block text-sm font-semibold text-slate-700 ${className}`}>{label}<input id={id} className="mt-2 block min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-100 disabled:bg-slate-100" {...props} /></label>
}

export function SelectField({ label, id, children, className = '', ...props }) {
  return <label htmlFor={id} className={`block text-sm font-semibold text-slate-700 ${className}`}>{label}<select id={id} className="mt-2 block min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-normal text-slate-900 outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-100" {...props}>{children}</select></label>
}

export function StatusBadge({ status }) {
  const normalized = String(status || 'unknown').toUpperCase()
  const style = normalized === 'CONFIRMED' || normalized === 'ACTIVE' || normalized === 'RETURNED' || normalized === 'VALID' || normalized === 'AVAILABLE'
    ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/10'
    : normalized === 'CANCELLED' || normalized === 'EXPIRED'
      ? 'bg-rose-50 text-rose-700 ring-rose-600/10'
      : 'bg-amber-50 text-amber-800 ring-amber-600/10'
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] ring-1 ring-inset ${style}`}>{normalized}</span>
}
