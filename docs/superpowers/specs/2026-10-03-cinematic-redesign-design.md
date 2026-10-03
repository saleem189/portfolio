# Cinematic redesign: design spec

Date: 2026-10-03
Status: approved by the owner in chat, awaiting review of this written spec.
Restore point: say "starting point" (see `STARTING-POINT.md`).

## Intent

Make the portfolio simpler, more elegant and classy, with a cinematic feel and smooth, refined motion.
Cinematic here means pacing and restraint: slow easing, large calm type, warm light against a deep dark
background. It does not mean heavy effects.

Audience (assumed): recruiters and clients judging the owner's work.
Success: the site feels calm and expensive, is easy to scan, stays accessible, and runs lighter than today.

Out of scope: changing facts or wording of project and experience content, new pages, a CMS, a backend.

## 1. Foundation

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0b0d12` | page background |
| `--ink` | `#ebe7df` | primary text |
| `--ink-2` | `#a8a49b` | secondary text (4.5:1 or better on `--bg`) |
| `--line` | `rgba(235,231,223,.12)` | hairlines |
| `--accent` | `#e6c48a` | key light: hero glow, hover, focus ring |

- Titles: Newsreader (light weights, optical size on), large, tight tracking. Body: Schibsted Grotesk.
- No monospace labels, no all-caps eyebrows. Small text is sentence case.
- Scale: hero title clamp to about 9vw; section titles about 6vw; body 16 to 18px; line length under 70 characters.
- Remove: grain overlay, the light sections (Stack and Experience become dark), the blue accent, JetBrains Mono.
- Fonts load from Google Fonts with `display=swap`; the title font is preloaded.

## 2. Hero

- Left-aligned type on `--bg`: name, "Software engineer.", one intro line, a single "Selected work" link.
- Proposed copy (owner to confirm): "Saleem Ayoub / Software engineer. / Laravel, Vue and the systems behind e-commerce and AI."
- One soft radial amber glow behind the title, drifting very slowly (CSS animation, 40s+ loop), low opacity.
- Title reveals line by line over about 1.6s with the shared easing; the intro and link follow.
- Removed: point-cloud canvas, clock, "open to work" pulse, parallax fade of the hero.
- Availability ("Open to remote work") moves to a quiet line in Contact.

## 3. Motion

- One easing, `cubic-bezier(.22,1,.36,1)`, durations 1.2 to 1.6s for entrances, 0.4 to 0.6s for hover.
- Three signature moments get care: hero title, project list, case-study opening.
- Everything else: a gentle fade and 16px rise when first scrolled into view, once.
- Sections dissolve into each other (no hard colour breaks); light parallax only, native scrolling stays.
- Hover on the project list: other rows dim, the hovered row brightens and takes the accent.
- `prefers-reduced-motion`: no movement; opacity-only fades at most; the glow is static.
- Implementation: CSS transitions and keyframes plus one small `IntersectionObserver` hook. No animation library, no per-frame JS loops.

## 4. Page structure

Sections, in order: Hero, About, Work, Stack, Experience, Contact (eight sections become six).

- About: the current paragraph and facts, with the five principles folded in as a short list. No scroll-lit word effect.
- Stack: one quiet list grouped by area. No filter buttons, no hover-to-switch.
- Systems: removed from the page and from the nav. Recoverable from the starting point.
- Nav: About, Work, Stack, Experience, Contact. Keep the hide-on-scroll-down behaviour and the thin progress line.

## 5. Work and case studies

- Work is the centre of the page: large serif project titles with type and year.
- Hover (fine pointer): the project image fades in beside the title; projects without an image show nothing extra.
- Touch: no hover; rows are tappable and the image shows inside the case study.
- Case study: a full-screen dialog that dissolves in (opacity plus a slight scale), with a large image, the three story blocks, the architecture strip, the gallery and "Next project". Blocks that have no content stay hidden, as today.
- Content and images stay as they are (including TransPro gallery, Breaker19 crop).

## 6. Guardrails

- Contrast: 4.5:1 for text, 3:1 for UI and focus ring, checked on every colour pair.
- Visible `:focus-visible` ring in `--accent`; dialogs keep focus handling and make the page behind inert.
- Native scrolling only. No scroll-jacking.
- Headings stay in order; images keep alt text; tap targets stay at least 44px.
- Performance: remove the canvas loop and the grain layer; the Hero script and `useRaf` usage shrink accordingly.

## Files affected

`index.html` (fonts, meta), `src/index.css` (tokens, keyframes), `src/motion.ts` (easing, reveal hook),
`src/ui.ts`, `src/data.ts` (Systems/Principles content moves), and the components: Nav, Hero, About, Work,
Stack, Experience, Contact, CaseStudy. Delete: `Systems.tsx`, `Principles.tsx` after their content moves.

## Verification

Per section: `npm run build`, `npm run lint`, then a browser check at desktop and 390px width, a contrast
re-measure, a reduced-motion pass, and a keyboard pass through the nav and a case study.

## Open items

- Hero copy to confirm.
- Whether the Systems interaction should live on somewhere else later (not planned).
