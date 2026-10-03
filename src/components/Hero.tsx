import { useEffect, useRef, useState } from 'react'
import { EASE, clamp, hexA, mouse, prefersReduced, useRaf } from '../motion'
import { gutter, mono } from '../ui'

const ACCENT = '#8fb4ff'
const TIMEZONE = 'Asia/Karachi'

interface Node { th: number; ph: number; s: number; sx: number; sy: number; d: number; p: number; hot: number }
interface Pulse { e: [number, number]; t: number; v: number; f: boolean }
interface Net { nodes: Node[]; edges: [number, number][]; pulses: Pulse[] }

function buildNet(mob: boolean): Net {
  const nodes: Node[] = [], edges: [number, number][] = [], shells: { base: number; lat: number; lon: number }[] = []
  ;([[mob ? 7 : 11, mob ? 14 : 24, 0], [mob ? 4 : 6, mob ? 8 : 12, 1]] as const).forEach(([lat, lon, s]) => {
    const base = nodes.length
    shells.push({ base, lat, lon })
    for (let i = 0; i < lat; i++) for (let j = 0; j < lon; j++) nodes.push({ th: (i + 1) / (lat + 1) * Math.PI, ph: j / lon * Math.PI * 2, s, sx: 0, sy: 0, d: 0, p: 1, hot: 0 })
    for (let i = 0; i < lat; i++) for (let j = 0; j < lon; j++) {
      const k = base + i * lon + j
      edges.push([k, base + i * lon + (j + 1) % lon])
      if (i < lat - 1) edges.push([k, base + (i + 1) * lon + j])
    }
  })
  const [O, I] = shells
  for (let i = 1; i < O.lat; i += 3) for (let j = 0; j < O.lon; j += 4) {
    const ii = Math.round(i * (I.lat - 1) / (O.lat - 1)), jj = Math.round(j * I.lon / O.lon) % I.lon
    edges.push([O.base + i * O.lon + j, I.base + ii * I.lon + jj])
  }
  return { nodes, edges, pulses: [] }
}

function useClock() {
  const [clock, setClock] = useState('--:--')
  useEffect(() => {
    const update = () => {
      const opts: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' }
      try { setClock(new Date().toLocaleTimeString([], { ...opts, timeZone: TIMEZONE })) }
      catch { setClock(new Date().toLocaleTimeString([], opts)) }
    }
    update()
    const t = setInterval(update, 20000)
    return () => clearInterval(t)
  }, [])
  return clock
}

export default function Hero() {
  const clock = useClock()
  const section = useRef<HTMLElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const net = useRef<Net | null>(null)
  const size = useRef({ w: 0, h: 0 })
  const smooth = useRef({ x: 0, y: 0 })
  const reduced = useRef(prefersReduced())

  // intro: headline lines slide up, the rest fades in
  useEffect(() => {
    const root = section.current
    if (!root || reduced.current) return
    const lines = [...root.querySelectorAll<HTMLElement>('[data-line]')], fades = [...root.querySelectorAll<HTMLElement>('[data-intro]')]
    lines.forEach(el => { el.style.transition = 'none'; el.style.transform = 'translate3d(0,110%,0)' })
    fades.forEach(el => { el.style.transition = 'none'; el.style.opacity = '0'; el.style.transform = 'translate3d(0,16px,0)' })
    root.getBoundingClientRect()
    const id = requestAnimationFrame(() => {
      lines.forEach((el, i) => { el.style.transition = `transform 1.3s ${EASE} ${150 + i * 95}ms`; el.style.transform = 'none' })
      fades.forEach((el, i) => { el.style.transition = `opacity 1s ${EASE} ${650 + i * 90}ms, transform 1.1s ${EASE} ${650 + i * 90}ms`; el.style.opacity = '1'; el.style.transform = 'none' })
    })
    return () => cancelAnimationFrame(id)
  }, [])

  // canvas setup + resize
  useEffect(() => {
    const c = canvas.current
    if (!c) return
    const ctx = c.getContext('2d')!
    net.current = buildNet(innerWidth < 820)
    const fit = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2)
      size.current = { w: c.clientWidth, h: c.clientHeight }
      c.width = c.clientWidth * dpr; c.height = c.clientHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (reduced.current) draw(ctx, 0, 16)
    }
    fit()
    addEventListener('resize', fit)
    const show = setTimeout(() => { c.style.opacity = '1' }, reduced.current ? 0 : 250)
    return () => { removeEventListener('resize', fit); clearTimeout(show) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function draw(ctx: CanvasRenderingContext2D, now: number, dt: number) {
    const n = net.current
    if (!n) return
    const { w, h } = size.current
    ctx.clearRect(0, 0, w, h)
    const mob = w < 820
    const S = mob ? Math.min(w * 0.38, h * 0.24) : Math.min(w * 0.22, h * 0.36)
    const cx = mob ? w * 0.7 : w * 0.75, cy = mob ? h * 0.28 : h * 0.45
    const sp = scrollY / Math.max(1, innerHeight), t = now * 0.001
    const sm = smooth.current
    sm.x += (mouse.nx - sm.x) * 0.04; sm.y += (mouse.ny - sm.y) * 0.04
    const ry = t * 0.07 + sm.x * 0.7 + sp * 0.6, rx = 0.35 + sm.y * 0.35
    const cY = Math.cos(ry), sY = Math.sin(ry), cX = Math.cos(rx), sX = Math.sin(rx), F = 3.6, grow = 1 + sp * 0.35
    const mX = mouse.x, mY = mouse.y + scrollY
    for (const p of n.nodes) {
      let r: number, ph = p.ph
      if (p.s) { ph -= t * 0.18; r = 0.46 * (1 + 0.14 * Math.sin(2 * p.ph + p.th * 3 - t * 0.9)) }
      else r = 1 + 0.17 * Math.sin(3 * p.th + t * 0.55) * Math.cos(2 * p.ph + t * 0.38) + 0.06 * Math.sin(5 * p.ph - t * 0.7)
      r *= grow
      const st = Math.sin(p.th), x = r * st * Math.cos(ph), y = r * Math.cos(p.th), z = r * st * Math.sin(ph)
      const x1 = x * cY - z * sY, z1 = x * sY + z * cY, y2 = y * cX - z1 * sX, z2 = y * sX + z1 * cX, pr = F / (F + z2)
      p.sx = cx + x1 * pr * S; p.sy = cy + y2 * pr * S; p.d = clamp((1.3 - z2) / 2.6); p.p = pr
      p.hot = mob ? 0 : clamp(1 - Math.hypot(p.sx - mX, p.sy - mY) / 140)
    }
    const buckets: [number, number][][] = [[], [], []]
    for (const e of n.edges) { const a = n.nodes[e[0]], b = n.nodes[e[1]]; buckets[Math.min(2, Math.floor((a.d + b.d) / 2 * 3))].push(e) }
    ctx.lineWidth = 1
    ;[0.04, 0.09, 0.17].forEach((al, bi) => {
      ctx.strokeStyle = `rgba(237,233,226,${al})`; ctx.beginPath()
      for (const [i, j] of buckets[bi]) { const a = n.nodes[i], b = n.nodes[j]; ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy) }
      ctx.stroke()
    })
    ctx.beginPath(); ctx.strokeStyle = hexA(ACCENT, 0.6)
    for (const [i, j] of n.edges) { const a = n.nodes[i], b = n.nodes[j]; if (a.hot > 0.2 && b.hot > 0.2) { ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy) } }
    ctx.stroke()
    for (const p of n.nodes) {
      const s = (p.s ? 1.2 : 1.5) + p.p * 1.1
      if (p.hot > 0.05) { const hs = s + p.hot * 2.5; ctx.fillStyle = hexA(ACCENT, 0.4 + p.hot * 0.6); ctx.fillRect(p.sx - hs / 2, p.sy - hs / 2, hs, hs) }
      else { ctx.fillStyle = `rgba(237,233,226,${0.18 + p.d * 0.62})`; ctx.fillRect(p.sx - s / 2, p.sy - s / 2, s, s) }
    }
    if (!reduced.current) {
      const P = n.pulses, max = mob ? 6 : 14
      if (P.length < max && Math.random() < 0.08) P.push({ e: n.edges[(Math.random() * n.edges.length) | 0], t: 0, v: 0.008 + Math.random() * 0.01, f: Math.random() < 0.5 })
      ctx.lineWidth = 1.5; ctx.strokeStyle = hexA(ACCENT, 0.9); ctx.fillStyle = ACCENT
      for (let k = P.length - 1; k >= 0; k--) {
        const q = P[k]; q.t += q.v * dt / 16
        if (q.t > 1) { P.splice(k, 1); continue }
        let a = n.nodes[q.e[0]], b = n.nodes[q.e[1]]
        if (q.f) [a, b] = [b, a]
        const t0 = Math.max(0, q.t - 0.3), x = a.sx + (b.sx - a.sx) * q.t, y = a.sy + (b.sy - a.sy) * q.t
        ctx.beginPath(); ctx.moveTo(a.sx + (b.sx - a.sx) * t0, a.sy + (b.sy - a.sy) * t0); ctx.lineTo(x, y); ctx.stroke()
        ctx.fillRect(x - 1.75, y - 1.75, 3.5, 3.5)
      }
    }
  }

  useRaf((now, dt) => {
    if (reduced.current) return
    const y = scrollY, vh = innerHeight
    const el = content.current
    if (el && y < vh * 1.2) { el.style.transform = `translate3d(0,${(y * 0.25).toFixed(1)}px,0)`; el.style.opacity = (1 - clamp(y / (vh * 0.9))).toFixed(3) }
    const c = canvas.current
    if (c && y < size.current.h) draw(c.getContext('2d')!, now, dt)
  })

  const line = { display: 'block', overflow: 'hidden', paddingBottom: '0.07em', marginBottom: '-0.07em' } as const
  const meta = { display: 'flex', flexWrap: 'wrap', gap: '12px 32px', justifyContent: 'space-between', ...mono, textTransform: 'uppercase', color: '#a39d93' } as const
  return (
    <section ref={section} aria-label="Introduction" style={{ position: 'relative', minHeight: '100svh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <canvas ref={canvas} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, transition: 'opacity 1.8s ease' }} />
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(90deg,#0e0d0c 0%,rgba(14,13,12,0.88) 36%,rgba(14,13,12,0.35) 58%,rgba(14,13,12,0) 76%)' }} />
      <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '30%', pointerEvents: 'none', background: 'linear-gradient(0deg,#0e0d0c,rgba(14,13,12,0))' }} />
      <div ref={content} style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 48, padding: `clamp(110px,14vh,150px) ${gutter} clamp(28px,4vh,44px)`, maxWidth: 1600, width: '100%', margin: '0 auto', pointerEvents: 'none' }}>
        <div data-intro="" style={{ ...meta, fontSize: 12, letterSpacing: '0.08em' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#ede9e2' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#78dc96', animation: 'pulse 2.4s infinite' }} />Open to remote work</span>
          <span>Islamabad, PK — {clock}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(32px,5vh,56px)' }}>
          <h1 style={{ margin: 0, fontSize: 'clamp(54px,9.4vw,172px)', fontWeight: 600, letterSpacing: '-0.05em', lineHeight: 0.92 }}>
            <span style={line}><span data-line="" style={{ display: 'block' }}>Hi, I'm Saleem.</span></span>
            <span style={line}><span data-line="" style={{ display: 'block' }}>I build Laravel</span></span>
            <span style={line}><span data-line="" style={{ display: 'block' }}>&amp; Vue apps<span style={{ color: 'var(--accent)' }}>.</span></span></span>
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px 64px', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <p data-intro="" style={{ margin: 0, maxWidth: 520, fontSize: 'clamp(17px,1.35vw,20px)', lineHeight: 1.5, color: '#cfc9bf', textWrap: 'pretty' }}>For the past five years I've worked on e-commerce, fintech and SaaS products, mostly on the backend and often on the frontend too. Right now I'm at PriceOye in Islamabad.</p>
            <div data-intro="" style={{ display: 'flex', flexWrap: 'wrap', gap: 14, pointerEvents: 'auto' }}>
              <a href="#work" style={{ display: 'inline-flex', alignItems: 'center', gap: 14, background: '#ede9e2', color: '#0e0d0c', padding: '18px 26px', minHeight: 56, fontWeight: 600, fontSize: 15, letterSpacing: '-0.01em' }}>See my work<span style={mono}>↓</span></a>
              <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 14, border: '1px solid rgba(237,233,226,0.3)', padding: '18px 26px', minHeight: 56, fontWeight: 500, fontSize: 15 }}>Get in touch</a>
            </div>
          </div>
          <div data-intro="" style={{ ...meta, alignItems: 'center', borderTop: '1px solid rgba(237,233,226,0.12)', paddingTop: 18, fontSize: 11, letterSpacing: '0.1em' }}>
            <span style={{ display: 'flex', gap: 14, alignItems: 'center' }}><span style={{ width: 28, height: 1, background: '#a39d93' }} />Currently Software Engineer at PriceOye</span>
            <span>Previously Peek International</span>
          </div>
        </div>
      </div>
    </section>
  )
}
