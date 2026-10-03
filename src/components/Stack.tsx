import { useState } from 'react'
import { CATS, TAGS } from '../data'
import { useMobile } from '../motion'
import { eyebrow, mono, sectionPad, wrap } from '../ui'

const INK = '#151412', MUTED = '#5f5a53'
const count = (name: string) => String(name === 'All' ? TAGS.length : TAGS.filter(t => t.c.includes(name)).length).padStart(2, '0')

export default function Stack() {
  const mobile = useMobile()
  const [cat, setCat] = useState('All')
  const desc = (CATS.find(c => c[0] === cat) ?? CATS[0])[1]
  const on = (c: string[]) => cat === 'All' || c.includes(cat)

  return (
    <section id="stack" style={{ padding: sectionPad, background: '#ece8e1', color: INK }}>
      <div style={wrap}>
        <div data-reveal="" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px 48px', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'clamp(48px,6vw,88px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <span style={eyebrow(MUTED)}>Stack</span>
            <h2 style={{ margin: 0, fontSize: 'clamp(44px,6.4vw,110px)', fontWeight: 500, letterSpacing: '-0.05em', lineHeight: 0.96, maxWidth: '12ch' }}>What I work with</h2>
          </div>
          <p style={{ margin: 0, maxWidth: 380, fontSize: 16, lineHeight: 1.6, color: MUTED }}>The tools I use day to day. Pick an area to filter the list.</p>
        </div>

        {mobile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div role="group" aria-label="Filter by area" style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {CATS.map(([name]) => {
                const sel = name === cat
                return (
                  <button key={name} type="button" onClick={() => setCat(name)} aria-pressed={sel} style={{ display: 'flex', alignItems: 'center', gap: 6, minHeight: 44, padding: '8px 12px', border: `1px solid ${sel ? INK : 'rgba(21,20,18,0.22)'}`, background: sel ? INK : 'transparent', color: sel ? '#ece8e1' : INK, fontSize: 14, fontWeight: 500, transition: 'background-color .3s,color .3s' }}>
                    {name}<span style={{ ...mono, fontSize: 11, opacity: 0.7 }}>{count(name)}</span>
                  </button>
                )
              })}
            </div>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: '#2e2b27', textWrap: 'pretty' }}>{desc}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, borderTop: '1px solid rgba(21,20,18,0.16)', paddingTop: 18 }}>
              {TAGS.filter(t => on(t.c)).map(t => (
                <span key={t.name} style={{ padding: '6px 10px', border: `1px solid ${cat !== 'All' ? 'var(--accent)' : 'rgba(21,20,18,0.22)'}`, background: cat !== 'All' ? 'color-mix(in oklab, var(--accent) 22%, transparent)' : 'transparent', color: INK, fontSize: 13, fontWeight: 500, overflowWrap: 'anywhere' }}>{t.name}</span>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px clamp(40px,6vw,96px)' }}>
            <div data-reveal="" role="group" aria-label="Filter by area" style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', position: 'sticky', top: 96, alignSelf: 'flex-start' }}>
              {CATS.map(([name]) => {
                const sel = name === cat
                return (
                  <button key={name} type="button" onClick={() => setCat(name)} onMouseEnter={() => setCat(name)} aria-pressed={sel} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'none', border: 0, borderTop: '1px solid rgba(21,20,18,0.14)', padding: '14px 0', minHeight: 48, textAlign: 'left', fontSize: 'clamp(20px,1.8vw,26px)', fontWeight: 500, letterSpacing: '-0.02em', color: sel ? INK : MUTED, transition: 'color .3s' }}>
                    <span style={{ width: 8, height: 8, background: 'var(--accent)', opacity: sel ? 1 : 0, transition: 'opacity .3s' }} />
                    <span style={{ flex: 1 }}>{name}</span>
                    <span style={{ ...mono, fontSize: 11, color: MUTED }}>{count(name)}</span>
                  </button>
                )
              })}
            </div>
            <div style={{ flex: '3 1 520px', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 48 }}>
              <div data-reveal="" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {TAGS.map(t => {
                  const lit = on(t.c), hi = lit && cat !== 'All'
                  return (
                    <span key={t.name} style={{ padding: '12px 18px', border: `1px solid ${hi ? 'var(--accent)' : lit ? 'rgba(21,20,18,0.22)' : 'rgba(21,20,18,0.08)'}`, background: hi ? 'color-mix(in oklab, var(--accent) 22%, transparent)' : 'transparent', color: lit ? INK : 'rgba(21,20,18,0.3)', fontSize: 'clamp(15px,1.2vw,18px)', fontWeight: 500, letterSpacing: '-0.01em', transition: 'color .4s,background-color .4s,border-color .4s' }}>{t.name}</span>
                  )
                })}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 40px', borderTop: '1px solid rgba(21,20,18,0.16)', paddingTop: 24, alignItems: 'baseline' }}>
                <span style={eyebrow('color-mix(in oklab,var(--accent) 40%,#151412)')}>{cat === 'All' ? 'All areas' : cat}</span>
                <p style={{ margin: 0, flex: '1 1 320px', maxWidth: 620, fontSize: 18, lineHeight: 1.55, color: '#2e2b27', textWrap: 'pretty' }}>{desc}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
