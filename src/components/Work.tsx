import { useRef, useState } from 'react'
import { PROJECTS } from '../data'
import { clamp, finePointer, mouse, useMobile, useRaf } from '../motion'
import { eyebrow, mono, wrap } from '../ui'

const pad = (i: number) => String(i + 1).padStart(2, '0')
const EASE = 'cubic-bezier(.22,1,.36,1)'

export default function Work({ onOpen }: { onOpen: (i: number) => void }) {
  const mobile = useMobile()
  const [hover, setHover] = useState<number | null>(null)
  const preview = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: mouse.x, y: mouse.y, s: 0 })
  const fine = useRef(finePointer())

  // preview card trails the cursor, sitting above it so the hovered row stays readable
  useRaf(() => {
    const el = preview.current
    if (!el) return
    const p = pos.current, on = hover != null && !mobile && fine.current
    const tx = Math.min(mouse.x + 36, innerWidth - 400), ty = Math.max(mouse.y - 270 - 40, 72), dx = tx - p.x
    p.x += dx * 0.11; p.y += (ty - p.y) * 0.11; p.s += ((on ? 1 : 0) - p.s) * 0.14
    el.style.transform = `translate3d(${p.x}px,${p.y}px,0) rotate(${clamp(dx * 0.03, -7, 7)}deg) scale(${0.85 + p.s * 0.15})`
    el.style.opacity = p.s.toFixed(3)
  })

  const shown = PROJECTS[hover ?? 0]
  const cardText = { ...mono, fontSize: 11, letterSpacing: '0.08em', color: '#a39d93' }

  return (
    <section id="work" style={{ padding: '0 clamp(20px,4vw,48px) clamp(110px,15vw,220px)' }}>
      <div ref={preview} aria-hidden="true" style={{ position: 'fixed', left: 0, top: 0, width: 380, height: 270, zIndex: 70, pointerEvents: 'none', opacity: 0, overflow: 'hidden', willChange: 'transform' }}>
        {shown.image ? (
          <img src={shown.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block', border: '1px solid rgba(237,233,226,0.1)' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#1a1916', backgroundImage: 'repeating-linear-gradient(135deg,rgba(237,233,226,0.06) 0 1px,transparent 1px 11px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 18, border: '1px solid rgba(237,233,226,0.1)' }}>
            <span style={cardText}>{pad(hover ?? 0)} — {shown.name}</span>
            <span style={{ ...cardText, textTransform: 'uppercase' }}>{shown.type}</span>
          </div>
        )}
      </div>

      <div style={wrap}>
        <div data-reveal="" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px 48px', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'clamp(48px,6vw,88px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <span style={eyebrow()}>Selected work</span>
            <h2 style={{ margin: 0, fontSize: 'clamp(48px,7.4vw,128px)', fontWeight: 500, letterSpacing: '-0.05em', lineHeight: 0.94 }}>Selected work</h2>
          </div>
          <p style={{ margin: 0, maxWidth: 380, fontSize: 16, lineHeight: 1.6, color: '#a39d93' }}>Things I've built at work and on my own. Click a project for the details.</p>
        </div>
        <div style={{ borderBottom: '1px solid rgba(237,233,226,0.12)' }}>
          {PROJECTS.map((p, i) => {
            const on = hover === i, dim = hover != null && !on && !mobile, open = on || mobile
            const enter = () => setHover(h => (h === i ? h : i)), leave = () => setHover(h => (h === i ? null : h))
            return (
              <button key={p.name} type="button" onClick={() => onOpen(i)} onMouseEnter={enter} onMouseLeave={leave} onFocus={enter} onBlur={leave}
                aria-label={`Open case study ${pad(i)}: ${p.name}`}
                style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 0, borderTop: '1px solid rgba(237,233,226,0.12)', padding: 'clamp(26px,3vw,42px) 0', opacity: dim ? 0.42 : 1, transition: `opacity .6s ${EASE}` }}>
                <span style={{ display: 'flex', alignItems: 'baseline', gap: '12px clamp(16px,3vw,48px)', flexWrap: 'wrap' }}>
                  <span style={{ ...mono, fontSize: 12, color: '#a39d93', width: 28 }}>{pad(i)}</span>
                  <span style={{ flex: '1 1 380px', minWidth: 0, fontSize: 'clamp(34px,5.4vw,92px)', fontWeight: 500, letterSpacing: '-0.04em', lineHeight: 1, transform: `translateX(${on && !mobile ? 28 : 0}px)`, transition: `transform .8s ${EASE}` }}>{p.name}</span>
                  <span style={{ display: 'flex', gap: 28, alignItems: 'center', ...mono, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#a39d93' }}>
                    <span>{p.type}</span>
                    {p.year && <span>{p.year}</span>}
                    <span aria-hidden="true" style={{ display: 'grid', placeItems: 'center', width: 40, height: 40, borderRadius: '50%', border: `1px solid ${on ? 'var(--accent)' : 'rgba(237,233,226,0.2)'}`, color: on ? '#0e0d0c' : '#a39d93', fontSize: 15, background: on ? 'var(--accent)' : 'transparent', transform: `rotate(${on ? 0 : -45}deg)`, transition: `transform .6s ${EASE},color .3s,border-color .3s` }}>→</span>
                  </span>
                </span>
                <span style={{ display: 'block', overflow: 'hidden', maxHeight: open ? 180 : 0, opacity: open ? 1 : 0, transition: `max-height .8s ${EASE},opacity .6s` }}>
                  <span style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 40px', padding: mobile ? '12px 0 0 0' : '20px 0 0 calc(28px + clamp(16px,3vw,48px))', alignItems: 'baseline' }}>
                    <span style={{ display: mobile ? 'none' : 'block', maxWidth: 540, fontSize: 16, lineHeight: 1.55, color: '#cfc9bf' }}>{p.desc}</span>
                    <span style={{ ...mono, fontSize: 12, letterSpacing: '0.04em', color: 'var(--accent)' }}>{p.stack.join(' · ')}</span>
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
