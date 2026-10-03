import { useRef, useState } from 'react'
import { CAPTIONS, LAYERS, PATHS, type Mode } from '../data'
import { clamp, easeIO, prefersReduced, useRaf } from '../motion'
import { eyebrow, mono, sectionPad, wrap } from '../ui'

const toggle = (on: boolean) => ({ border: 0, padding: '12px 18px', minHeight: 44, ...mono, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', background: on ? '#ede9e2' : 'transparent', color: on ? '#0e0d0c' : '#a39d93', transition: 'background-color .3s,color .3s' }) as const

export default function Systems() {
  const [layer, setLayer] = useState(2)
  const [mode, setMode] = useState<Mode>('request')
  const arch = useRef<HTMLDivElement>(null)
  const packet = useRef<HTMLDivElement>(null)
  const anim = useRef({ at: 0, glow: LAYERS.map(() => 0) })
  const reduced = useRef(prefersReduced())

  // a packet travels the request path layer to layer; each layer glows as it passes
  useRaf((_, dt) => {
    const ar = arch.current, pk = packet.current
    if (!ar || !pk || reduced.current) return
    const rr = ar.getBoundingClientRect()
    if (rr.bottom <= 0 || rr.top >= innerHeight) return
    const ls = ar.querySelectorAll<HTMLElement>('[data-layer]'), path = PATHS[mode]
    if (ls.length !== LAYERS.length) return
    const a = anim.current
    a.at += dt / 1000
    const segs = path.length - 1, seg = Math.floor(a.at) % segs
    const f = easeIO(clamp((a.at % 1) / 0.72))
    const A = ls[path[seg]], B = ls[path[seg + 1]]
    const ya = A.offsetTop + A.offsetHeight / 2, yb = B.offsetTop + B.offsetHeight / 2, py = ya + (yb - ya) * f
    pk.style.transform = `translate3d(0,${py.toFixed(1)}px,0)`
    ls.forEach((L, i) => {
      a.glow[i] = Math.abs(L.offsetTop + L.offsetHeight / 2 - py) < 10 ? 1 : a.glow[i] * 0.955
      const g = L.querySelector<HTMLElement>('[data-glow]')
      if (g) g.style.opacity = a.glow[i].toFixed(3)
    })
  })

  const pick = (m: Mode) => { if (m !== mode) { anim.current.at = 0; setMode(m) } }
  const d = LAYERS[layer]

  return (
    <section id="systems" style={{ padding: sectionPad }}>
      <div style={wrap}>
        <div data-reveal="" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px 48px', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'clamp(48px,6vw,88px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <span style={eyebrow()}>Systems</span>
            <h2 style={{ margin: 0, fontSize: 'clamp(44px,6.4vw,110px)', fontWeight: 500, letterSpacing: '-0.05em', lineHeight: 0.96 }}>How I think about a request</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
            <div role="group" aria-label="Flow type" style={{ display: 'flex', border: '1px solid rgba(237,233,226,0.2)', alignSelf: 'flex-start' }}>
              <button type="button" onClick={() => pick('request')} aria-pressed={mode === 'request'} style={toggle(mode === 'request')}>HTTP request</button>
              <button type="button" onClick={() => pick('job')} aria-pressed={mode === 'job'} style={toggle(mode === 'job')}>Background job</button>
            </div>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#a39d93' }}>{CAPTIONS[mode]}</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px clamp(32px,5vw,80px)', alignItems: 'flex-start' }}>
          <div ref={arch} data-reveal="" style={{ position: 'relative', flex: '3 1 520px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 14, paddingLeft: 56 }}>
            <div aria-hidden="true" style={{ position: 'absolute', left: 27, top: 30, bottom: 30, width: 1, background: 'rgba(237,233,226,0.16)' }} />
            <div ref={packet} aria-hidden="true" style={{ position: 'absolute', left: 22, top: -6, width: 11, height: 11, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 0 6px color-mix(in oklab,var(--accent) 18%,transparent),0 0 30px var(--accent)', zIndex: 2 }} />
            {LAYERS.map((l, i) => (
              <button key={l.name} type="button" data-layer="" onClick={() => setLayer(i)} onFocus={() => setLayer(i)} aria-pressed={i === layer}
                style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 24px', width: '100%', textAlign: 'left', padding: '22px 24px', minHeight: 74, border: `1px solid ${i === layer ? 'rgba(237,233,226,0.45)' : 'rgba(237,233,226,0.12)'}`, background: i === layer ? 'rgba(237,233,226,0.04)' : 'transparent', transition: 'border-color .4s,background-color .4s' }}>
                <span data-glow="" aria-hidden="true" style={{ position: 'absolute', inset: -1, border: '1px solid var(--accent)', opacity: 0, pointerEvents: 'none' }} />
                <span style={{ ...mono, fontSize: 11, color: '#a39d93', width: 22 }}>0{i + 1}</span>
                <span style={{ flex: '1 1 200px', fontSize: 'clamp(19px,1.7vw,24px)', fontWeight: 500, letterSpacing: '-0.02em' }}>{l.name}</span>
                <span style={{ ...mono, fontSize: 12, letterSpacing: '0.02em', color: '#a39d93' }}>{l.tech}</span>
              </button>
            ))}
          </div>
          <aside aria-live="polite" style={{ flex: '2 1 340px', minWidth: 0, position: 'sticky', top: 110, display: 'flex', flexDirection: 'column', gap: 28, borderTop: '1px solid rgba(237,233,226,0.14)', paddingTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', ...eyebrow() }}><span>Layer {layer + 1}</span></div>
            <h3 style={{ margin: 0, fontSize: 'clamp(32px,3vw,46px)', fontWeight: 500, letterSpacing: '-0.035em', lineHeight: 1 }}>{d.name}</h3>
            <p style={{ margin: 0, fontSize: 18, lineHeight: 1.55, color: '#cfc9bf', textWrap: 'pretty' }}>{d.lives}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ ...eyebrow(), fontSize: 11, letterSpacing: '0.1em' }}>What I check here</span>
              {d.watch.map(w => (
                <div key={w} style={{ display: 'flex', gap: 14, fontSize: 16, lineHeight: 1.5, borderTop: '1px solid rgba(237,233,226,0.08)', paddingTop: 12 }}>
                  <span style={{ color: 'var(--accent)', ...mono, fontSize: 12, paddingTop: 3 }}>→</span>{w}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
