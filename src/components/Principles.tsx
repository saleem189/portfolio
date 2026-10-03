import { useRef } from 'react'
import { PRINCIPLES } from '../data'
import { clamp, prefersReduced, useRaf } from '../motion'
import { eyebrow, sectionPad, wrap } from '../ui'

export default function Principles() {
  const list = useRef<HTMLDivElement>(null)
  const reduced = prefersReduced()

  // each row brightens and settles as it nears the middle of the viewport
  useRaf(() => {
    if (reduced || !list.current) return
    const vh = innerHeight
    for (const el of list.current.children as HTMLCollectionOf<HTMLElement>) {
      const r = el.getBoundingClientRect()
      if (r.bottom < -100 || r.top > vh + 100) continue
      const k = 1 - clamp(Math.abs(r.top + r.height / 2 - vh * 0.5) / (vh * 0.5))
      const a = clamp(k * 1.6)
      el.style.opacity = (0.28 + 0.72 * a).toFixed(3)
      el.style.transform = `translate3d(${((1 - a) * 24).toFixed(1)}px,0,0)`
    }
  })

  return (
    <section id="principles" style={{ padding: sectionPad }}>
      <div style={wrap}>
        <h2 className="sr-only">How I like to work</h2>
        <div aria-hidden="true" data-reveal="" style={{ ...eyebrow(), marginBottom: 'clamp(48px,6vw,88px)' }}>How I like to work</div>
        <div ref={list} style={{ display: 'flex', flexDirection: 'column' }}>
          {PRINCIPLES.map(([title, note], i) => (
            <div key={title} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 48px', alignItems: 'flex-end', justifyContent: 'space-between', borderTop: '1px solid rgba(237,233,226,0.12)', borderBottom: i === PRINCIPLES.length - 1 ? '1px solid rgba(237,233,226,0.12)' : undefined, padding: 'clamp(28px,3.4vw,48px) 0' }}>
              <h3 style={{ margin: 0, flex: '3 1 600px', fontSize: 'clamp(36px,5.4vw,92px)', fontWeight: 500, letterSpacing: '-0.04em', lineHeight: 1.02, textWrap: 'balance' }}>{title}</h3>
              <p style={{ margin: 0, flex: '1 1 260px', maxWidth: 360, fontSize: 16, lineHeight: 1.6, color: '#a39d93' }}>{note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
