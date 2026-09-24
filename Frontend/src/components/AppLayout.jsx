import { useEffect, useState } from 'react'
import { CarFront, Menu, Moon, Sun, X } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router-dom'

function ThemeToggle({ darkMode, onToggle }) {
  return (
    <button
      aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={darkMode}
      className="grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
      onClick={onToggle}
      title={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
      type="button"
    >
      {darkMode ? <Sun aria-hidden="true" className="size-[18px]" /> : <Moon aria-hidden="true" className="size-[18px]" />}
    </button>
  )
}

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'))
  const location = useLocation()

  useEffect(() => {
    const scrollTarget = location.hash
      ? document.getElementById(decodeURIComponent(location.hash.slice(1)))
      : null

    if (scrollTarget) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      scrollTarget.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [location.hash, location.pathname])

  function closeMenu() {
    setMenuOpen(false)
  }

  function toggleTheme() {
    const nextDarkMode = !darkMode
    document.documentElement.classList.toggle('dark', nextDarkMode)
    document.documentElement.style.colorScheme = nextDarkMode ? 'dark' : 'light'
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', nextDarkMode ? '#020617' : '#f8fafc')

    try {
      localStorage.setItem('vehicle-rentals-theme', nextDarkMode ? 'dark' : 'light')
    } catch {
      // Keep the theme toggle usable when browser storage is unavailable.
    }

    setDarkMode(nextDarkMode)
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <Link to="/" onClick={closeMenu} className="inline-flex shrink-0 items-center gap-2.5 font-semibold tracking-tight">
            <span className="grid size-9 place-items-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/20">
              <CarFront aria-hidden="true" className="size-5" />
            </span>
            <span className="text-sm sm:text-base">Vehicle Rentals</span>
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex lg:gap-2">
            <Link to="/" className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">Home</Link>
            <Link to="/#vehicles" className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">Vehicles</Link>
            <Link to="/#how-it-works" className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">How it works</Link>
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle darkMode={darkMode} onToggle={toggleTheme} />
            <Link
              to="/login"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              Log in
            </Link>
            <Link
              to="/create-account"
              className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Get started
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle darkMode={darkMode} onToggle={toggleTheme} />
            <button
              aria-controls="mobile-navigation"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
            >
              {menuOpen ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 sm:px-6 md:hidden">
            <div className="mx-auto grid max-w-7xl gap-1">
              <Link onClick={closeMenu} to="/" className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900">Home</Link>
              <Link onClick={closeMenu} to="/#vehicles" className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900">Vehicles</Link>
              <Link onClick={closeMenu} to="/#how-it-works" className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900">How it works</Link>
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                <Link onClick={closeMenu} to="/login" className="rounded-xl border border-slate-200 px-3 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900">Log in</Link>
                <Link onClick={closeMenu} to="/create-account" className="rounded-xl bg-blue-600 px-3 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700">Get started</Link>
              </div>
            </div>
          </nav>
        )}
      </header>
      <main className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200/80 bg-white/70 dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 text-xs text-slate-500 dark:text-slate-400 sm:px-6 lg:px-8">
          <span>Vehicle Rentals</span>
          <span>Find your way forward.</span>
        </div>
      </footer>
    </div>
  )
}
