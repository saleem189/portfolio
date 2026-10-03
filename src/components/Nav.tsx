import { useEffect, useRef, useState } from 'react'
import { NAV, EMAIL } from '../data'
import { clamp, useMobile, useRaf } from '../motion'
import { eyebrow, ghostBtn, gutter, mono } from '../ui'

const cap = (s: string) => s[0].toUpperCase() + s.slice(1)

export default function Nav() {
  const mobile = useMobile()
  const [menu, setMenu] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const nav = useRef<HTMLElement>(null)
  const progress = useRef<HTMLDivElement>(null)
  const state = useRef({ compact: false, hidden: false, lastY: 0 })

  useEffect(() => {
    if (!menu) return
    const main = document.querySelector('main')
    if (main) main.inert = true
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    addEventListener('keydown', onKey)
    return () => { removeEventListener('keydown', onKey); if (main) main.inert = false }
  }, [menu])

  useRaf(() => {
    const s = state.current, y = scrollY, vh = innerHeight, v = y - s.lastY
    s.lastY = y
    const n = nav.current
    if (n) {
      const compact = y > 40
      if (compact !== s.compact) {
        s.compact = compact
        n.style.padding = compact ? `14px ${gutter}` : `26px ${gutter}`
        n.style.backgroundColor = compact ? 'rgba(14,13,12,0.78)' : 'transparent'
        n.style.backdropFilter = compact ? 'blur(16px)' : 'none'
        n.style.borderBottomColor = compact ? 'rgba(237,233,226,0.08)' : 'transparent'
      }
      let hide = s.hidden
      if (v > 3 && y > vh) hide = true
      else if (v < -3 || y < vh) hide = false
      if (hide !== s.hidden) { s.hidden = hide; n.style.transform = hide ? 'translate3d(0,-100%,0)' : 'none' }
    }
    if (progress.current) progress.current.style.transform = `scaleX(${clamp(y / Math.max(1, document.documentElement.scrollHeight - vh)).toFixed(4)})`
    let act: string | null = null
    for (const id of NAV) {
      const el = document.getElementById(id)
      if (el && el.getBoundingClientRect().top < vh * 0.4) act = id
    }
    setActive(prev => (prev === act ? prev : act))
  })

  const linkStyle = { display: 'flex', alignItems: 'center', gap: 8, ...mono, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'color .3s' } as const

  return (
    <>
      <header ref={nav} style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 80, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, padding: `26px ${gutter}`, borderBottom: '1px solid transparent', transition: 'padding .6s cubic-bezier(.22,1,.36,1),background-color .6s,border-color .6s,transform .6s cubic-bezier(.22,1,.36,1)' }}>
        <a href="#top" style={{ display: 'flex', gap: 14, alignItems: 'center', minHeight: 44 }} aria-label="Saleem Ayoub — back to top">
          <span style={{ width: 36, height: 36, border: '1px solid rgba(237,233,226,0.3)', display: 'grid', placeItems: 'center', ...mono, fontSize: 11, fontWeight: 500, letterSpacing: '0.04em' }}>SA</span>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 2, lineHeight: 1.2 }}>
            <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: '-0.01em' }}>Saleem Ayoub</span>
            <span style={{ ...mono, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a39d93' }}>Laravel · Vue</span>
          </span>
        </a>
        {mobile ? (
          <button type="button" onClick={() => setMenu(true)} aria-expanded={menu} style={ghostBtn}>Menu</button>
        ) : (
          <nav aria-label="Primary" style={{ display: 'flex', gap: 'clamp(18px,2.4vw,36px)', alignItems: 'center' }}>
            {NAV.map(id => (
              <a key={id} href={`#${id}`} style={{ ...linkStyle, color: active === id ? '#ede9e2' : '#a39d93' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', opacity: active === id ? 1 : 0, transition: 'opacity .3s' }} />
                {cap(id)}
              </a>
            ))}
            <a href="#contact" className="nav-cta">Contact</a>
          </nav>
        )}
        <div ref={progress} aria-hidden="true" style={{ position: 'absolute', left: 0, bottom: -1, height: 1, width: '100%', background: 'var(--accent)', transformOrigin: '0 50%', transform: 'scaleX(0)' }} />
      </header>

      {menu && (
        <div role="dialog" aria-modal="true" aria-label="Menu" style={{ position: 'fixed', inset: 0, zIndex: 96, background: '#0e0d0c', display: 'flex', flexDirection: 'column', padding: '26px 20px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Saleem Ayoub</span>
            <button type="button" onClick={() => setMenu(false)} style={ghostBtn} autoFocus>Close</button>
          </div>
          <nav aria-label="Mobile" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[...NAV, 'contact'].map(id => (
              <a key={id} href={`#${id}`} onClick={() => setMenu(false)} style={{ display: 'flex', alignItems: 'baseline', gap: 14, fontSize: 'clamp(40px,11vw,52px)', fontWeight: 500, letterSpacing: '-0.04em', lineHeight: 1.1, borderTop: '1px solid rgba(237,233,226,0.12)', paddingTop: 8, color: id === 'contact' ? 'var(--accent)' : undefined }}>{cap(id)}</a>
            ))}
            <span style={{ marginTop: 28, ...eyebrow(), textTransform: 'none', letterSpacing: '0.06em' }}>{EMAIL}</span>
          </nav>
        </div>
      )}
    </>
  )
}
