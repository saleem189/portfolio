import { useEffect, useRef, useState, type RefObject } from 'react'

export const EASE = 'cubic-bezier(.22,1,.36,1)'
export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v))
export const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
export const hexA = (hex: string, a: number) => {
  let h = hex.replace('#', '')
  if (h.length === 3) h = h.split('').map(c => c + c).join('')
  const n = parseInt(h, 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}

export const prefersReduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches
export const finePointer = () => matchMedia('(pointer: fine)').matches

/** Shared pointer position, updated once for the whole page. */
export const mouse = { x: 0, y: 0, nx: 0, ny: 0 }
if (typeof window !== 'undefined') {
  mouse.x = innerWidth / 2
  mouse.y = innerHeight / 2
  addEventListener('pointermove', e => {
    mouse.x = e.clientX; mouse.y = e.clientY
    mouse.nx = e.clientX / innerWidth - 0.5; mouse.ny = e.clientY / innerHeight - 0.5
  }, { passive: true })
}

export function useRaf(cb: (now: number, dt: number) => void) {
  const ref = useRef(cb)
  useEffect(() => { ref.current = cb })
  useEffect(() => {
    let id = 0, last = 0
    const frame = (now: number) => {
      id = requestAnimationFrame(frame)
      const dt = Math.min(50, now - (last || now)) || 16
      last = now
      ref.current(now, dt)
    }
    id = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(id)
  }, [])
}

export function useMobile() {
  const [mobile, setMobile] = useState(() => innerWidth < 820)
  useEffect(() => {
    const on = () => setMobile(innerWidth < 820)
    addEventListener('resize', on)
    return () => removeEventListener('resize', on)
  }, [])
  return mobile
}

/** Fades in every [data-reveal] element inside `root` as it scrolls into view. */
export function useReveals(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const host = root.current
    if (!host || prefersReduced()) return
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return
      const el = e.target as HTMLElement
      el.style.opacity = '1'; el.style.transform = 'none'; io.unobserve(el)
    }), { rootMargin: '0px 0px -8% 0px' })
    host.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
      const d = +(el.dataset.reveal || 0)
      el.style.opacity = '0'; el.style.transform = 'translate3d(0,36px,0)'
      el.style.transition = `opacity 1s ${EASE} ${d}ms, transform 1.2s ${EASE} ${d}ms`
      io.observe(el)
    })
    return () => io.disconnect()
  }, [root])
}
