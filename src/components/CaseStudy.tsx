import { useEffect, useRef } from 'react'
import { PROJECTS } from '../data'
import { EASE, clamp, prefersReduced, useRaf } from '../motion'
import { eyebrow, ghostBtn, gutter, mono } from '../ui'

const pad = (i: number) => String(i + 1).padStart(2, '0')
const label = { ...mono, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a39d93' } as const

function revealIn(o: HTMLElement, base: number) {
  o.querySelectorAll<HTMLElement>('[data-cs]').forEach((el, i) => {
    el.style.transition = 'none'; el.style.opacity = '0'; el.style.transform = 'translate3d(0,28px,0)'; el.getBoundingClientRect()
    const d = base + i * 70
    el.style.transition = `opacity .9s ${EASE} ${d}ms, transform 1.1s ${EASE} ${d}ms`
    el.style.opacity = '1'; el.style.transform = 'none'
  })
}

interface Props { index: number; onChange: (i: number) => void; onClose: () => void }

export default function CaseStudy({ index, onChange, onClose }: Props) {
  const p = PROJECTS[index], n = PROJECTS.length, next = (index + 1) % n
  const overlay = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const closing = useRef(false)
  const reduced = prefersReduced()

  const close = () => {
    const o = overlay.current
    if (closing.current) return
    if (!o || reduced) return onClose()
    closing.current = true
    o.style.transition = 'clip-path .8s cubic-bezier(.76,0,.24,1)'; o.style.clipPath = 'inset(0 0 100% 0)'
    setTimeout(onClose, 780)
  }
  const closeRef = useRef(close)
  useEffect(() => { closeRef.current = close })

  // lock page scroll while open; wipe in on first mount
  useEffect(() => {
    const o = overlay.current
    document.body.style.overflow = 'hidden'
    if (o && !reduced) {
      o.style.transition = 'none'; o.style.clipPath = 'inset(100% 0 0 0)'; o.getBoundingClientRect()
      o.style.transition = 'clip-path 1s cubic-bezier(.76,0,.24,1)'; o.style.clipPath = 'inset(0% 0 0 0)'
    }
    return () => { document.body.style.overflow = '' }
  }, [reduced])

  // each project: back to top and stagger its blocks in
  useEffect(() => {
    const o = overlay.current
    if (!o) return
    o.scrollTop = 0
    if (!reduced) revealIn(o, 380)
  }, [index, reduced])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onChange((index + 1) % n)
      else if (e.key === 'ArrowLeft') onChange((index + n - 1) % n)
      else if (e.key === 'Escape') closeRef.current()
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [index, n, onChange])

  useRaf(() => {
    const o = overlay.current
    if (o && bar.current) bar.current.style.transform = `scaleX(${clamp(o.scrollTop / Math.max(1, o.scrollHeight - o.clientHeight)).toFixed(4)})`
  })

  const meta = [
    p.role && ['Role', p.role],
    p.year && ['Year', p.year],
    ['Stack', p.stack.join(' · ')],
  ].filter(Boolean) as [string, string][]
  const story = [['The problem', p.challenge], ['What I did', p.solution], ['Outcome', p.result]].filter(([, t]) => t) as [string, string][]

  return (
    <div ref={overlay} role="dialog" aria-modal="true" aria-label={`Case study: ${p.name}`} style={{ position: 'fixed', inset: 0, zIndex: 95, background: '#0e0d0c', overflowY: 'auto', overscrollBehavior: 'contain' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: `20px ${gutter}`, background: 'rgba(14,13,12,0.85)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(237,233,226,0.08)' }}>
        <span style={eyebrow()}>{pad(index)} of {pad(n - 1)}</span>
        <button type="button" onClick={close} style={ghostBtn} autoFocus>Close</button>
        <div ref={bar} aria-hidden="true" style={{ position: 'absolute', left: 0, bottom: -1, height: 1, width: '100%', background: 'var(--accent)', transformOrigin: '0 50%', transform: 'scaleX(0)' }} />
      </div>
      <article style={{ maxWidth: 1600, margin: '0 auto', padding: `clamp(56px,8vw,120px) ${gutter} 80px`, display: 'flex', flexDirection: 'column', gap: 'clamp(56px,7vw,110px)' }}>
        <header style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <span data-cs="" style={eyebrow('var(--accent)')}>{[p.type, p.year].filter(Boolean).join(' — ')}</span>
          <h2 data-cs="" style={{ margin: 0, fontSize: 'clamp(48px,9vw,160px)', fontWeight: 600, letterSpacing: '-0.055em', lineHeight: 0.92 }}>{p.name}</h2>
          <p data-cs="" style={{ margin: 0, maxWidth: 760, fontSize: 'clamp(20px,1.8vw,26px)', lineHeight: 1.45, color: '#cfc9bf', textWrap: 'pretty' }}>{p.desc}</p>
          <div data-cs="" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '24px 32px', borderTop: '1px solid rgba(237,233,226,0.14)', paddingTop: 24 }}>
            {meta.map(([k, v]) => (
              <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={label}>{k}</span><span style={{ fontSize: 16 }}>{v}</span></div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={label}>Link</span>
              {p.link
                ? <a href={p.link} target="_blank" rel="noopener" style={{ fontSize: 16 }}>{p.link.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')} ↗</a>
                : <span style={{ fontSize: 16, color: '#a39d93' }}>Internal — not public</span>}
            </div>
          </div>
        </header>
        {p.image && (
          <img data-cs="" src={p.image} alt={`${p.name} homepage`} style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(237,233,226,0.1)' }} />
        )}
        {story.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '48px clamp(32px,4vw,64px)' }}>
            {story.map(([k, t]) => (
              <div key={k} data-cs="" style={{ display: 'flex', flexDirection: 'column', gap: 16, borderTop: '1px solid rgba(237,233,226,0.14)', paddingTop: 22 }}>
                <span style={{ ...label, color: 'var(--accent)' }}>{k}</span>
                <p style={{ margin: 0, fontSize: 18, lineHeight: 1.6, color: '#cfc9bf' }}>{t}</p>
              </div>
            ))}
          </div>
        )}
        <div data-cs="" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <span style={label}>How it fits together</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
            {p.arch.map((a, k) => (
              <span key={a} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ border: '1px solid rgba(237,233,226,0.2)', padding: '14px 18px', fontSize: 16, fontWeight: 500 }}>{a}</span>
                {k < p.arch.length - 1 && <span style={{ ...mono, color: 'var(--accent)' }}>→</span>}
              </span>
            ))}
          </div>
        </div>
        {p.gallery && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,420px),1fr))', gap: 20 }}>
            {p.gallery.map(g => (
              <figure key={g.src} data-cs="" style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <img src={g.src} alt={g.caption} style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(237,233,226,0.1)' }} />
                <figcaption style={{ fontSize: 14, lineHeight: 1.5, color: '#a39d93' }}>{g.caption}</figcaption>
              </figure>
            ))}
          </div>
        )}
        <button type="button" onClick={() => onChange(next)} className="next">
          <span style={label}>Next project</span>
          <span style={{ fontSize: 'clamp(40px,6vw,104px)', fontWeight: 500, letterSpacing: '-0.045em', lineHeight: 1 }}>{PROJECTS[next].name} →</span>
        </button>
      </article>
    </div>
  )
}
