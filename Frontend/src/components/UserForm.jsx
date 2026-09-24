import { useState } from 'react'
import {
  ArrowRight,
  CarFront,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const inputClassName =
  'w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/15'

export default function UserForm({ variant = 'login' }) {
  const isCreate = variant === 'create'
  const [showPassword, setShowPassword] = useState(false)
  const [notice, setNotice] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setNotice('This form is a preview. Account access will be available soon.')
  }

  return (
    <section className="w-full overflow-hidden rounded-[1.75rem] bg-white shadow-xl shadow-slate-900/5 ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800 lg:grid lg:min-h-[650px] lg:grid-cols-[0.92fr_1.08fr]">
      <div className="relative isolate flex min-h-[300px] flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6 text-white sm:min-h-[340px] sm:p-9 lg:min-h-full lg:p-11">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-28 -top-36 size-96 rounded-full border border-white/10" />
          <div className="absolute -right-16 -top-24 size-72 rounded-full border border-white/10" />
          <div className="absolute -bottom-44 -left-24 size-80 rounded-full bg-blue-500/15 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />
        </div>

        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold tracking-wide text-blue-100">
            <ShieldCheck aria-hidden="true" className="size-4 text-sky-300" />
            YOUR NEXT JOURNEY STARTS HERE
          </div>
          <h1 className="mt-8 max-w-lg text-3xl font-semibold leading-tight tracking-tight sm:mt-10 sm:text-4xl lg:text-[2.7rem]">
            {isCreate ? 'Make room for more journeys.' : 'Welcome back to the open road.'}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
            {isCreate
              ? 'Create your account and get ready to find a ride that fits your plans.'
              : 'Sign in to pick up where your next trip begins.'}
          </p>
        </div>

        <div className="mt-8 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm sm:p-5">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-blue-500/20 text-sky-200 ring-1 ring-inset ring-white/10">
            <CarFront aria-hidden="true" className="size-6" />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">A better way to get moving</p>
            <p className="mt-1 text-xs leading-5 text-slate-300 sm:text-sm">
              Your plans. Your pace. Your next destination.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center p-6 sm:p-9 lg:p-12">
        <div className="mx-auto w-full max-w-md">
          <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-100 dark:bg-blue-400/10 dark:text-blue-300 dark:ring-blue-300/20">
            {isCreate ? 'GET STARTED' : 'GOOD TO SEE YOU'}
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            {isCreate ? 'Create your account' : 'Log in to your account'}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
            {isCreate
              ? 'A few details are all you need to get started.'
              : 'Enter your details and get back to planning.'}
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {isCreate && (
              <div>
                <label htmlFor="full-name" className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Full name
                </label>
                <div className="relative">
                  <UserRound aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" />
                  <input
                    autoComplete="name"
                    className={inputClassName}
                    id="full-name"
                    name="name"
                    placeholder="Your name"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
                Email address
              </label>
              <div className="relative">
                <Mail aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" />
                <input
                  autoComplete="email"
                  className={inputClassName}
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  type="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
                Password
              </label>
              <div className="relative">
                <LockKeyhole aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" />
                <input
                  autoComplete={isCreate ? 'new-password' : 'current-password'}
                  className={`${inputClassName} pr-12`}
                  id="password"
                  minLength={isCreate ? 8 : undefined}
                  name="password"
                  placeholder={isCreate ? 'At least 8 characters' : 'Enter your password'}
                  required
                  type={showPassword ? 'text' : 'password'}
                />
                <button
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="absolute right-2.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  onClick={() => setShowPassword((visible) => !visible)}
                  type="button"
                >
                  {showPassword ? <EyeOff aria-hidden="true" className="size-[18px]" /> : <Eye aria-hidden="true" className="size-[18px]" />}
                </button>
              </div>
              {isCreate && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Use at least 8 characters.</p>}
            </div>

            <button
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/25"
              type="submit"
            >
              {isCreate ? 'Create account' : 'Log in'}
              <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
            </button>

            {notice && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-5 text-amber-900 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200" role="status">
                {notice}
              </p>
            )}
          </form>

          <p className="mt-7 text-center text-sm text-slate-600 dark:text-slate-300">
            {isCreate ? 'Already have an account?' : 'New to Vehicle Rentals?'}{' '}
            <Link
              className="font-semibold text-blue-700 decoration-blue-300 underline-offset-4 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              to={isCreate ? '/login' : '/create-account'}
            >
              {isCreate ? 'Log in' : 'Create an account'}
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
