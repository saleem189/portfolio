import type { CSSProperties } from 'react'

export const mono: CSSProperties = { fontFamily: "'JetBrains Mono',monospace" }
export const wrap: CSSProperties = { maxWidth: 1600, margin: '0 auto' }
export const gutter = 'clamp(20px,4vw,48px)'
export const sectionPad = `clamp(110px,15vw,220px) ${gutter}`
export const eyebrow = (color = '#a39d93'): CSSProperties => ({ ...mono, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color })
export const ghostBtn: CSSProperties = { background: 'none', border: '1px solid rgba(237,233,226,0.25)', padding: '12px 18px', minHeight: 44, ...mono, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }
