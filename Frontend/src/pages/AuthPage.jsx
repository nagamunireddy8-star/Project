import { useState } from 'react'
import { ArrowLeft, ArrowRight, CarFront, Check, KeyRound, Sparkles } from 'lucide-react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setSession, useLoginMutation, useRegisterMutation } from '../app/store.js'
import { Button, Field, useToast } from '../components/ui.jsx'
import { getErrorMessage } from '../lib/format.js'

export default function AuthPage({ mode = 'login' }) {
  const isRegister = mode === 'register'
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [params] = useSearchParams()
  const requestedRedirect = params.get('redirect')
  const redirect = requestedRedirect?.startsWith('/') && !requestedRedirect.startsWith('//') ? requestedRedirect : null
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const notify = useToast()
  const [login, { isLoading: loginLoading }] = useLoginMutation()
  const [register, { isLoading: registerLoading }] = useRegisterMutation()
  const loading = loginLoading || registerLoading

  if (user) return <Navigate to={redirect || (user.role === 'ADMIN' ? '/admin' : '/')} replace />

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))
  const submit = async (event) => {
    event.preventDefault()
    try {
      if (isRegister) {
        await register({ firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email.trim(), password: form.password }).unwrap()
        notify('Your account is ready. Log in to start planning a trip.')
        navigate(`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`)
        return
      }
      const result = await login({ email: form.email.trim(), password: form.password }).unwrap()
      dispatch(setSession({ token: result.token, user: result.user }))
      notify(`Welcome back, ${result.user.firstName}.`)
      navigate(redirect || (result.user.role === 'ADMIN' ? '/admin' : '/'))
    } catch (error) {
      notify(getErrorMessage(error, 'Please check your details and try again.'), 'error')
    }
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-220px)] max-w-[1440px] items-stretch gap-8 px-5 py-8 sm:px-10 sm:py-12 lg:grid-cols-2">
      <section className="relative hidden min-h-[620px] overflow-hidden rounded-[2rem] bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=85')] bg-cover bg-center opacity-35" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/10" />
        <Link to="/" className="relative z-10 inline-flex items-center gap-2 text-sm font-extrabold tracking-tight"><span className="grid size-9 place-items-center rounded-xl bg-white/15 text-lime-300"><CarFront size={19} /></span> DRIVE.CLUB</Link>
        <div className="relative z-10 max-w-lg"><span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em]"><Sparkles size={12} className="text-lime-300" /> Every trip has a beginning</span><p className="mt-5 font-serif text-4xl italic leading-tight tracking-[-0.03em]">“Somewhere, something incredible is waiting to be known.”</p><p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-white/60">A little inspiration for the road ahead</p></div>
      </section>
      <section className="flex items-center justify-center py-6">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-950 lg:hidden"><ArrowLeft size={15} /> Back to home</Link>
          <div className="grid size-12 place-items-center rounded-2xl bg-lime-200 text-slate-900"><KeyRound size={21} /></div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-lime-700">{isRegister ? 'Make yourself at home' : 'Your next trip awaits'}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.07em]">{isRegister ? 'Create an account.' : 'Welcome back.'}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">{isRegister ? 'Join Drive Club and make your next journey a little easier.' : 'Sign in to manage bookings and pick up where you left off.'}</p>
          <form onSubmit={submit} className="mt-8 space-y-4">
            {isRegister && <div className="grid grid-cols-2 gap-3"><Field id="first-name" label="First name" value={form.firstName} onChange={update('firstName')} autoComplete="given-name" required /><Field id="last-name" label="Last name" value={form.lastName} onChange={update('lastName')} autoComplete="family-name" required /></div>}
            <Field id="email" label="Email address" type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} autoComplete="email" required />
            <div className="relative"><Field id="password" label="Password" type={showPassword ? 'text' : 'password'} placeholder={isRegister ? 'At least 6 characters' : 'Your password'} value={form.password} onChange={update('password')} autoComplete={isRegister ? 'new-password' : 'current-password'} minLength={isRegister ? 6 : undefined} required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[42px] rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 hover:text-slate-800">{showPassword ? 'Hide' : 'Show'}</button></div>
            <Button type="submit" disabled={loading} className="w-full">{loading ? (isRegister ? 'Creating account...' : 'Signing in...') : (isRegister ? 'Create account' : 'Sign in')} {!loading && <ArrowRight size={16} />}</Button>
          </form>
          {!isRegister && <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4"><div className="flex items-center gap-2 text-xs font-bold"><Sparkles size={14} className="text-lime-700" /> Explore with a demo account</div><div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-2 text-xs"><button type="button" onClick={() => setForm((current) => ({ ...current, email: 'alice@example.com', password: 'user123' }))} className="font-semibold text-slate-600 underline underline-offset-4 hover:text-slate-950">Customer demo</button><button type="button" onClick={() => setForm((current) => ({ ...current, email: 'admin@vehicle.com', password: 'admin123' }))} className="font-semibold text-slate-600 underline underline-offset-4 hover:text-slate-950">Admin demo</button></div></div>}
          <p className="mt-6 text-center text-sm text-slate-500">{isRegister ? 'Already part of the club?' : 'New around here?'} <Link to={`${isRegister ? '/login' : '/register'}${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} className="font-bold text-slate-950 underline decoration-lime-400 decoration-2 underline-offset-4">{isRegister ? 'Sign in' : 'Create an account'}</Link></p>
          {isRegister && <p className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400"><Check size={14} className="text-lime-700" /> Your info stays yours. That’s the deal.</p>}
        </div>
      </section>
    </div>
  )
}
