import { useEffect, useRef, useState } from 'react'
import { EMAIL, asset } from '../data'
import { eyebrow, gutter, mono, wrap } from '../ui'

const LINKS: [string, string, string, boolean][] = [
  ['Email', `${EMAIL} ↗`, `mailto:${EMAIL}`, false],
  ['GitHub', 'github.com/saleem189 ↗', 'https://github.com/saleem189', true],
  ['LinkedIn', 'View profile ↗', 'https://www.linkedin.com/in/muhammad-saleem-ayoub-20bb581b8/', true],
  ['Resume', 'Download PDF ↓', asset('Saleem_Ayoub_Resume.pdf'), false],
]

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number>(0)
  useEffect(() => () => clearTimeout(timer.current), [])
  const copy = () => {
    navigator.clipboard?.writeText(EMAIL).catch(() => {})
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1800)
  }
  const small = { ...eyebrow(), fontSize: 11, letterSpacing: '0.1em' }

  return (
    <section id="contact" style={{ position: 'relative', padding: `clamp(110px,15vw,220px) ${gutter} 40px`, background: '#131210', borderTop: '1px solid rgba(237,233,226,0.08)', overflow: 'hidden' }}>
      <div style={{ ...wrap, display: 'flex', flexDirection: 'column', gap: 'clamp(56px,8vw,120px)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(20px,3vw,36px)' }}>
          <span data-reveal="" style={eyebrow()}>Contact</span>
          <p data-reveal="" style={{ margin: 0, fontSize: 'clamp(28px,3.4vw,54px)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#cfc9bf' }}>Working on something I could help with?</p>
          <div data-reveal="120" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '24px clamp(24px,4vw,64px)' }}>
            <a href={`mailto:${EMAIL}`} className="talk">Let's talk.</a>
            <a href={`mailto:${EMAIL}`} aria-label="Email Saleem Ayoub" className="go">→</a>
          </div>
          <div data-reveal="200" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 20px', alignItems: 'center' }}>
            <span style={eyebrow()}>Or copy the address</span>
            <button type="button" onClick={copy} aria-live="polite" className="copy">
              {EMAIL}<span style={{ ...mono, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)' }}>{copied ? 'Copied ✓' : 'Copy'}</span>
            </button>
          </div>
        </div>
        <div data-reveal="" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '0 32px' }}>
          {LINKS.map(([k, v, href, ext]) => (
            <a key={k} href={href} {...(ext ? { target: '_blank', rel: 'noopener' } : {})} {...(k === 'Resume' ? { download: true } : {})} style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid rgba(237,233,226,0.16)', padding: '22px 0', minHeight: 44 }}>
              <span style={small}>{k}</span><span style={{ fontSize: 19, fontWeight: 500 }}>{v}</span>
            </a>
          ))}
        </div>
        <footer style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 32px', justifyContent: 'space-between', alignItems: 'center', ...eyebrow(), fontSize: 11, borderTop: '1px solid rgba(237,233,226,0.08)', paddingTop: 24 }}>
          <span>© 2026 Saleem Ayoub</span>
          <span>Islamabad, Pakistan</span>
          <a href="#top" style={{ color: '#a39d93', display: 'inline-flex', alignItems: 'center', minHeight: 44 }}>Back to top ↑</a>
        </footer>
      </div>
    </section>
  )
}
