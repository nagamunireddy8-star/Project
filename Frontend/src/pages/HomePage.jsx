import {
  ArrowRight,
  CalendarDays,
  CarFront,
  Compass,
  MapPin,
  Mountain,
  Sparkles,
  UsersRound,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import coastalDrive from '../assets/coastal-drive.png'

const marqueeItems = [
  'MADE FOR THE EVERYDAY',
  'ROOM FOR THE ESCAPE',
  'YOUR NEXT STORY STARTS HERE',
  'A RIDE FOR EVERY REASON',
]

const tripTypes = [
  {
    icon: CarFront,
    eyebrow: 'THE EVERYDAY RUN',
    title: 'Make the usual feel easy.',
    description: 'A comfortable fit for commutes, errands, and all the places in between.',
    iconStyle: 'bg-blue-50 text-blue-700 ring-blue-100 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-400/20',
  },
  {
    icon: Mountain,
    eyebrow: 'THE CHANGE OF SCENERY',
    title: 'Leave room for a detour.',
    description: 'For open weekends, long roads, and the plans you make along the way.',
    iconStyle: 'bg-cyan-50 text-cyan-700 ring-cyan-100 dark:bg-cyan-500/10 dark:text-cyan-300 dark:ring-cyan-400/20',
  },
  {
    icon: UsersRound,
    eyebrow: 'BRING THE WHOLE CREW',
    title: 'Take everyone along.',
    description: 'More space for your people, the bags, and everything the day brings.',
    iconStyle: 'bg-indigo-50 text-indigo-700 ring-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-400/20',
  },
]

const steps = [
  {
    icon: Compass,
    title: 'Find your kind of ride',
    description: 'Start with the kind of day you have in mind and find a vehicle to match.',
  },
  {
    icon: CalendarDays,
    title: 'Make the plan yours',
    description: 'Choose the details that work for your schedule and where you want to go.',
  },
  {
    icon: MapPin,
    title: 'Take the road ahead',
    description: 'Pick up your keys, set your own pace, and enjoy the journey.',
  },
]

function MarqueeRow() {
  return (
    <div className="overflow-hidden border-y border-slate-200 bg-white py-4 dark:border-slate-800 dark:bg-slate-900 sm:py-5">
      <p className="sr-only">Made for the everyday. Room for the escape. Your next story starts here. A ride for every reason.</p>
      <div aria-hidden="true" className="group flex w-full overflow-hidden">
        <div className="flex w-max shrink-0 motion-safe:animate-marquee motion-reduce:animate-none group-hover:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1 ? 'true' : undefined}>
              {marqueeItems.map((item) => (
                <li key={item} className="mx-5 flex items-center gap-5 whitespace-nowrap text-xs font-semibold tracking-[0.16em] text-slate-600 dark:text-slate-300 sm:mx-8 sm:gap-8 sm:text-sm">
                  <span>{item}</span>
                  <Sparkles aria-hidden="true" className="size-4 text-blue-600" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="w-full space-y-16 pb-4 sm:space-y-20 lg:space-y-24">
      <section className="grid overflow-hidden rounded-[1.75rem] bg-white shadow-xl shadow-slate-900/5 ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800 lg:min-h-[560px] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col items-start justify-center p-6 sm:p-10 lg:p-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold tracking-wide text-blue-700 ring-1 ring-inset ring-blue-100 dark:bg-blue-400/10 dark:text-blue-300 dark:ring-blue-300/20">
            <Sparkles aria-hidden="true" className="size-4" />
            A FRESH TAKE ON VEHICLE RENTALS
          </div>
          <h1 className="mt-6 max-w-xl text-[2.65rem] font-semibold leading-[1.04] tracking-tight text-slate-950 dark:text-white sm:text-6xl lg:text-[4.25rem]">
            Your plans deserve the right ride.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-8">
            We’re building a simpler way to find a vehicle for the everyday, the once-in-a-while, and everywhere in between.
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/25"
              to="/create-account"
            >
              Join the journey
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-700"
              to="/#vehicles"
            >
              Explore the idea
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
            <span className="inline-flex items-center gap-2"><span className="size-2 rounded-full bg-emerald-500" />Built around your kind of trip</span>
            <span className="hidden size-1 rounded-full bg-slate-300 dark:bg-slate-600 sm:inline-block" />
            <span>More freedom, fewer formalities</span>
          </div>
        </div>

        <div className="relative isolate min-h-[320px] overflow-hidden bg-slate-900 sm:min-h-[420px] lg:min-h-full">
          <img
            alt="A white electric crossover travelling along a coastal road"
            className="absolute inset-0 size-full object-cover object-[58%_center]"
            src={coastalDrive}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/5 to-slate-950/10" />
          <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3 sm:left-6 sm:right-6 sm:top-6">
            <div className="rounded-2xl border border-white/20 bg-white/90 px-3.5 py-3 shadow-lg shadow-black/10 backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/90 sm:px-4">
              <p className="text-[10px] font-semibold tracking-[0.16em] text-blue-700 dark:text-blue-300 sm:text-xs">THE NEXT STOP</p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white sm:text-base">Could be anywhere.</p>
            </div>
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-white/20 bg-slate-950/30 text-white backdrop-blur sm:size-12">
              <CarFront aria-hidden="true" className="size-5 sm:size-6" />
            </span>
          </div>
          <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 text-white sm:inset-x-6 sm:bottom-6">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-blue-100">MORE THAN A WAY THERE</p>
              <p className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">Make the miles yours.</p>
            </div>
            <span className="hidden rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur sm:inline-flex">Find your next favorite</span>
          </div>
        </div>
      </section>

      <MarqueeRow />

      <section id="vehicles" className="scroll-mt-28 space-y-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-blue-700 dark:text-blue-400">A RIDE FOR EVERY REASON</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Good trips begin with a good fit.</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
            Short hop or long weekend, the best journeys start with a vehicle that feels right for the day.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 sm:gap-5">
          {tripTypes.map(({ icon: Icon, eyebrow, title, description, iconStyle }, index) => (
            <article key={eyebrow} className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/30 sm:p-7">
              <div aria-hidden="true" className={`absolute -right-8 -top-8 size-32 rounded-full opacity-70 blur-2xl dark:opacity-30 ${index === 1 ? 'bg-cyan-100 dark:bg-cyan-700' : 'bg-blue-100 dark:bg-blue-700'}`} />
              <div className="relative">
                <span className={`grid size-12 place-items-center rounded-2xl ring-1 ring-inset ${iconStyle}`}>
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <p className="mt-7 text-[10px] font-semibold tracking-[0.16em] text-blue-700 dark:text-blue-400 sm:text-xs">{eyebrow}</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-28 rounded-[1.75rem] bg-slate-950 px-6 py-9 text-white sm:px-9 sm:py-12 lg:px-12 lg:py-14">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-sky-300">A CLEARER ROAD AHEAD</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">A little less hassle. A lot more go.</h2>
          <p className="mt-4 text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
            We’re shaping the experience around what matters: finding your fit, making your plan, and getting on with the good part.
          </p>
        </div>
        <div className="mt-9 grid gap-3 md:grid-cols-3 sm:mt-11 sm:gap-4">
          {steps.map(({ icon: Icon, title, description }, index) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-blue-500/20 text-sky-200 ring-1 ring-inset ring-white/10">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <span className="text-sm font-semibold tracking-[0.12em] text-slate-500">0{index + 1}</span>
              </div>
              <h3 className="mt-6 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative isolate overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-6 py-10 text-white shadow-xl shadow-blue-900/15 sm:px-10 sm:py-12 lg:flex lg:items-center lg:justify-between lg:gap-8 lg:px-12">
        <div aria-hidden="true" className="absolute -right-16 -top-36 -z-10 size-96 rounded-full border border-white/15" />
        <div aria-hidden="true" className="absolute -right-4 -top-24 -z-10 size-72 rounded-full border border-white/10" />
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-blue-100">WE’RE JUST GETTING STARTED</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Come along for the ride.</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base sm:leading-7">
            Get a first look at what we’re building for your next trip.
          </p>
        </div>
        <Link
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-blue-800 shadow-lg shadow-blue-950/10 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40 sm:w-auto lg:mt-0"
          to="/create-account"
        >
          Get started
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </section>
    </div>
  )
}
