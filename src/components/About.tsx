import { Fragment, useRef } from 'react'
import { clamp, prefersReduced, useRaf } from '../motion'
import { eyebrow, sectionPad, wrap } from '../ui'

const TEXT = "Most of my work is backend: Laravel services, queues, APIs and the database underneath. I write a lot of Vue as well, so I usually follow a feature from the table schema to the button that triggers it. I like code the next person can read, and I would rather measure a slow page than guess why it's slow."
const WORDS = TEXT.split(' ')
const FACTS = [
  ['Based in', 'Islamabad, Pakistan'],
  ['Now', 'PriceOye, since Feb 2024'],
  ['Before', 'Peek International, 2021–2024'],
  ['Studied', 'MSc Computer Science, KFUEIT'],
]

export default function About() {
  const para = useRef<HTMLParagraphElement>(null)
  const lit = useRef(-1)
  const reduced = prefersReduced()

  // words light up as the paragraph scrolls through the viewport
  useRaf(() => {
    const el = para.current
    if (!el || reduced) return
    const r = el.getBoundingClientRect(), vh = innerHeight
    if (r.top >= vh || r.bottom <= 0) return
    const n = Math.round(clamp((vh * 0.82 - r.top) / (r.height * 0.9 + vh * 0.15)) * WORDS.length)
    if (n === lit.current) return
    lit.current = n
    el.querySelectorAll<HTMLElement>('span').forEach((w, i) => { w.style.opacity = i < n ? '1' : '0.28' })
  })

  return (
    <section id="about" style={{ padding: sectionPad }}>
      <div style={{ ...wrap, display: 'flex', flexWrap: 'wrap', gap: '40px 48px' }}>
        <h2 className="sr-only">About</h2>
        <div data-reveal="" style={{ flex: '1 1 220px', ...eyebrow() }}>About</div>
        <div style={{ flex: '4 1 560px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'clamp(72px,9vw,128px)' }}>
          <p ref={para} style={{ margin: 0, fontSize: 'clamp(30px,3.7vw,60px)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.1, textWrap: 'pretty' }}>
            {WORDS.map((w, i) => (
              <Fragment key={i}>
                <span style={{ opacity: reduced ? 1 : 0.28, transition: 'opacity .35s ease' }}>{w}</span>
                {i < WORDS.length - 1 ? ' ' : ''}
              </Fragment>
            ))}
          </p>
          <dl data-reveal="" style={{ margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '28px 32px', borderTop: '1px solid rgba(237,233,226,0.14)', paddingTop: 24 }}>
            {FACTS.map(([k, v]) => (
              <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <dt style={{ fontSize: 14, color: '#a39d93' }}>{k}</dt>
                <dd style={{ margin: 0, fontSize: 18 }}>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
