import { ArrowLeft, CarFront } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="mx-auto w-full max-w-2xl rounded-[1.75rem] bg-white px-6 py-14 text-center shadow-xl shadow-slate-900/5 ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800 sm:px-12 sm:py-20">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-100 dark:bg-blue-400/10 dark:text-blue-300 dark:ring-blue-300/20">
        <CarFront aria-hidden="true" className="size-7" />
      </span>
      <p className="mt-7 text-xs font-semibold tracking-[0.18em] text-blue-700 dark:text-blue-400">404 · OFF ROUTE</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Page not found</h1>
      <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
        We couldn’t find that destination. Head back home and choose where to go next.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Return home
      </Link>
    </section>
  )
}
