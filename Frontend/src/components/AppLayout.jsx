import { useState } from 'react'
import { ArrowUpRight, CarFront, Menu, X } from 'lucide-react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearSession } from '../app/store.js'
import { Button } from './ui.jsx'

const navClass = ({ isActive }) => `rounded-full px-3.5 py-2 text-sm font-semibold transition ${isActive ? 'bg-slate-100 text-slate-950' : 'text-slate-500 hover:text-slate-950'}`

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const signOut = () => { dispatch(clearSession()); navigate('/'); setMenuOpen(false) }

  return <div className="min-h-screen bg-[#f7f8f5] text-slate-950">
    <div className="bg-slate-950 text-center text-xs font-medium text-white"><div className="mx-auto flex max-w-[1440px] items-center justify-center gap-2 px-4 py-2"><span className="size-1.5 rounded-full bg-lime-300" />Your next drive is closer than you think.<Link to="/vehicles" className="inline-flex items-center gap-1 font-bold text-lime-300">Explore cars <ArrowUpRight size={13} /></Link></div></div>
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-[#f7f8f5]/90 backdrop-blur-xl"><div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-7 lg:px-10">
      <Link to="/" className="group inline-flex items-center gap-2.5"><span className="grid size-10 place-items-center rounded-2xl bg-slate-950 text-lime-300"><CarFront size={21} /></span><span className="text-[15px] font-extrabold tracking-[-0.05em]">DRIVE<span className="text-lime-600">.</span>CLUB</span></Link>
      <nav className="hidden items-center gap-1 md:flex"><NavLink to="/vehicles" className={navClass}>Find a car</NavLink>{user?.role === 'CUSTOMER' && <NavLink to="/my-bookings" className={navClass}>My bookings</NavLink>}{user?.role === 'ADMIN' && <NavLink to="/admin" className={navClass}>Admin</NavLink>}</nav>
      <div className="hidden items-center gap-2 md:flex">{user ? <><span className="mr-2 text-sm font-semibold">{user.firstName}</span><Button variant="secondary" className="min-h-10 rounded-full" onClick={signOut}>Sign out</Button></> : <><Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-600">Log in</Link><Link to="/register"><Button className="min-h-10 rounded-full px-5">Get started <ArrowUpRight size={15} /></Button></Link></>}</div>
      <button className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white md:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
    </div>{menuOpen && <div className="border-t border-slate-200 bg-[#f7f8f5] p-4 md:hidden"><div className="flex flex-col gap-1"><Link to="/vehicles" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-semibold">Find a car</Link>{user?.role === 'CUSTOMER' && <Link to="/my-bookings" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-semibold">My bookings</Link>}{user?.role === 'ADMIN' && <Link to="/admin" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-semibold">Admin dashboard</Link>}{user ? <button onClick={signOut} className="rounded-xl px-3 py-3 text-left text-sm font-semibold text-rose-700">Sign out</button> : <div className="mt-2 grid grid-cols-2 gap-2"><Link to="/login" onClick={() => setMenuOpen(false)}><Button variant="secondary" className="w-full">Log in</Button></Link><Link to="/register" onClick={() => setMenuOpen(false)}><Button className="w-full">Join now</Button></Link></div>}</div></div>}</header>
    <main className="min-h-[calc(100vh-220px)]"><Outlet /></main>
    <footer className="mt-16 border-t border-slate-200 bg-white"><div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-10"><Link to="/" className="inline-flex items-center gap-2 text-sm font-extrabold"><span className="grid size-8 place-items-center rounded-xl bg-slate-950 text-lime-300"><CarFront size={17} /></span>DRIVE.CLUB</Link><p className="text-xs text-slate-500">Good trips start with a better set of keys.</p><Link to="/vehicles" className="text-xs font-semibold text-slate-500 hover:text-slate-950">Browse cars</Link></div></footer>
  </div>
}
