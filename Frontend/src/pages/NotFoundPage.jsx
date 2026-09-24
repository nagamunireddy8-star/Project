import { ArrowLeft, Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui.jsx'

export default function NotFoundPage() {
  return <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 py-16 text-center"><span className="grid size-14 place-items-center rounded-2xl bg-lime-200"><Compass size={25} /></span><p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-lime-700">Lost your way?</p><h1 className="mt-2 text-4xl font-semibold tracking-[-0.07em]">This road ends here.</h1><p className="mt-3 text-sm leading-6 text-slate-500">The page you’re looking for doesn’t exist. Let’s get you back on the road.</p><Link to="/"><Button className="mt-6"><ArrowLeft size={16} /> Back to the start</Button></Link></section>
}
