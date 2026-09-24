import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-xl py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">404</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-3 text-slate-600">That page does not exist.</p>
      <Link to="/" className="mt-6 inline-flex font-semibold text-blue-700 hover:text-blue-800">
        Return home
      </Link>
    </section>
  )
}
