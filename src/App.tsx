import { useCallback, useEffect, useRef, useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Work from './components/Work'
import Stack from './components/Stack'
import Systems from './components/Systems'
import Experience from './components/Experience'
import Principles from './components/Principles'
import Contact from './components/Contact'
import CaseStudy from './components/CaseStudy'
import { useReveals } from './motion'

const GRAIN = `url("data:image/svg+xml,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>")}")`

export default function App() {
  const root = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<number | null>(null)
  const lastFocus = useRef<Element | null>(null)
  useReveals(root)

  const openCase = (i: number) => { lastFocus.current = document.activeElement; setOpen(i) }
  const closeCase = useCallback(() => {
    setOpen(null)
    ;(lastFocus.current as HTMLElement | null)?.focus?.({ preventScroll: true })
  }, [])

  useEffect(() => { document.title = 'Saleem Ayoub — Laravel & Full-Stack Software Engineer' }, [])

  return (
    <div ref={root} id="top" style={{ position: 'relative', background: '#0e0d0c', color: '#ede9e2', minHeight: '100vh', overflowX: 'clip' }}>
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 110, pointerEvents: 'none', opacity: 0.07, mixBlendMode: 'overlay', backgroundImage: GRAIN }} />
      <div inert={open != null}>
      <Nav />
      <main>
        <Hero />
        <About />
        <Work onOpen={openCase} />
        <Stack />
        <Systems />
        <Experience />
        <Principles />
        <Contact />
      </main>
      </div>
      {open != null && <CaseStudy index={open} onChange={setOpen} onClose={closeCase} />}
    </div>
  )
}
