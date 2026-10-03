import { JOBS, asset } from '../data'
import { eyebrow, mono, sectionPad, wrap } from '../ui'

const INK = '#151412', MUTED = '#5f5a53'

export default function Experience() {
  return (
    <section id="experience" style={{ padding: sectionPad, background: '#ece8e1', color: INK }}>
      <div style={wrap}>
        <div data-reveal="" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px 48px', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'clamp(48px,6vw,88px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <span style={eyebrow(MUTED)}>Career</span>
            <h2 style={{ margin: 0, fontSize: 'clamp(44px,6.4vw,110px)', fontWeight: 500, letterSpacing: '-0.05em', lineHeight: 0.96 }}>Experience</h2>
          </div>
          <a href={asset('Saleem_Ayoub_Resume.pdf')} download style={{ color: INK, ...eyebrow(INK), borderBottom: '1px solid rgba(21,20,18,0.4)', padding: '14px 0 6px', display: 'inline-flex', alignItems: 'flex-end', minHeight: 44 }}>Download resume ↓</a>
        </div>
        {JOBS.map(j => (
          <article key={j.title} className="exp" data-reveal="" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px clamp(32px,5vw,80px)', padding: 'clamp(32px,4vw,52px) 0' }}>
            <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ ...eyebrow(MUTED), letterSpacing: '0.06em', marginBottom: 6 }}>{j.when}</span>
              <h3 style={{ margin: 0, fontSize: 'clamp(26px,2.4vw,36px)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.1 }}>{j.title}</h3>
              <span style={eyebrow('color-mix(in oklab,var(--accent) 40%,#151412)')}>{j.org}</span>
            </div>
            <div style={{ flex: '2 1 440px', display: 'flex', flexDirection: 'column', gap: 18 }}>
              <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: '#2e2b27', maxWidth: 620, textWrap: 'pretty' }}>{j.summary}</p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 15, lineHeight: 1.5, color: MUTED }}>
                {j.points.map(pt => (
                  <li key={pt} style={{ display: 'flex', gap: 12 }}><span style={{ ...mono, fontSize: 12, paddingTop: 2 }}>→</span><span>{pt}</span></li>
                ))}
              </ul>
              <span style={{ ...mono, fontSize: 12, color: MUTED }}>{j.stack}</span>
            </div>
          </article>
        ))}
        <article data-reveal="" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px clamp(32px,5vw,80px)', borderTop: '1px solid rgba(21,20,18,0.16)', borderBottom: '1px solid rgba(21,20,18,0.16)', padding: '28px 0', fontSize: 15, color: '#2e2b27' }}>
          <span style={{ flex: '1 1 300px', ...eyebrow(MUTED) }}>Education</span>
          <span style={{ flex: '1 1 200px' }}>MSc Computer Science — KFUEIT, 2018–2021</span>
          <span style={{ flex: '1 1 220px' }}>BSc Computer Science — The Islamia University of Bahawalpur, 2016–2018</span>
        </article>
      </div>
    </section>
  )
}
