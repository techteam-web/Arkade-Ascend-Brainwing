import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from './reveal.js'
import { sections, sectionIndex } from './routes.js'
import { playClick, preloadClick } from './clickSound.js'
import { prefersReducedMotion } from '../hooks/useMediaQuery.js'

// The layer not in use: out of the flow and out of sight, until a morph shows it.
const GHOST = 'pointer-events-none invisible absolute left-0 top-0'

// The foot of the screen (client, 18 Nov 2026), in the site's plum and gold
// (`.nav-bar`, `.nav-chip` in index.css). The home screen carries the menu:
// one bar of the sections, scrolling sideways where it does not fit. Every
// other page carries only a Home button in the same place. It is one bar
// holding both, so a change of page morphs it (client, 20 Nov 2026): leaving
// home, the menu shrinks into the Home button towards the middle; coming back,
// the Home button opens out into the menu. A soft plum gradient rises behind
// it so it reads over any page.
export default function BottomNav({ currentId, onNavigate }) {
  const bar = useRef(null)
  const list = useRef(null)
  const homeRow = useRef(null)
  const drawn = useRef(0)      // the bar's width as last drawn, where a morph starts
  const scrolled = useRef(0)   // the menu row's sideways scroll, kept through a morph
  const currentIndex = sectionIndex(currentId)
  const home = currentId === 'tower'
  useEffect(() => { preloadClick() }, [])

  // Follow the bar's drawn width (resizes, and each frame of a morph), so an
  // interrupted morph carries on from where it was.
  useEffect(() => {
    const element = bar.current
    const measure = () => { drawn.current = element.getBoundingClientRect().width }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  // The morph. By now the new layer is in the flow, so the bar's natural width
  // is where it ends; the old one, now a ghost, is held at its width, centred,
  // and fades as the bar's edges close in (or open out) round the middle.
  const shown = useRef(home)
  useLayoutEffect(() => {
    if (shown.current === home) return
    shown.current = home
    const element = bar.current, from = drawn.current, to = element.getBoundingClientRect().width
    if (prefersReducedMotion() || !from || Math.abs(from - to) < 2) return
    const incoming = home ? list.current : homeRow.current
    const outgoing = home ? homeRow.current : list.current
    const inner = width => width - 2   // inside the bar's 1px border
    const ctx = gsap.context(() => {
      gsap.set(element, { width: from, height: element.offsetHeight, overflow: 'hidden' })
      gsap.set([incoming, outgoing], { position: 'absolute', top: 0, left: '50%' })
      gsap.set(outgoing, { width: inner(from), marginLeft: -inner(from) / 2, visibility: 'visible' })
      gsap.set(incoming, { width: inner(to), marginLeft: -inner(to) / 2, autoAlpha: 0 })
      if (outgoing === list.current) list.current.scrollLeft = scrolled.current
      // Opening out, the menu shows as the bar grows; closing in, the Home
      // button arrives as the bar comes down to its size.
      const opening = to > from
      gsap.timeline({ onComplete: () => gsap.set([element, incoming, outgoing], { clearProps: 'all' }) })
        .to(element, { width: to, duration: 0.8, ease: 'silk' }, 0)
        .to(outgoing, { opacity: 0, duration: opening ? 0.2 : 0.3, ease: 'power1.out' }, 0)
        .to(incoming, { autoAlpha: 1, duration: opening ? 0.5 : 0.45, ease: 'power1.inOut' }, opening ? 0.1 : 0.3)
    })
    return () => ctx.revert()
  }, [home])

  return <>
    {/* The website's plum, rising from the foot, with a faint warmth of gold under the bar. */}
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[35] h-[calc(var(--credit-space)+4rem)] bg-[radial-gradient(ellipse_45%_70%_at_50%_100%,rgba(176,133,82,.22),transparent_70%),linear-gradient(to_top,rgba(26,17,20,.9),rgba(33,22,26,.62)_38%,rgba(61,42,47,.22)_70%,transparent)]" />

    <nav aria-label={home ? 'Sections' : 'Home'} data-tone="dark"
      className="absolute inset-x-(--gutter) bottom-(--foot-clear) z-40 flex justify-center">
      <div ref={bar} className="nav-bar relative min-w-0 max-w-full rounded-full">
        <ol ref={list} inert={home ? undefined : ''} aria-hidden={home ? undefined : true}
          onScroll={event => { scrolled.current = event.currentTarget.scrollLeft }}
          className={`nav-row flex items-center gap-1 overflow-x-auto overscroll-x-contain rounded-full p-1.5 ${home ? '' : GHOST}`}>
          {sections.map((route, index) => <li key={route.id} className="shrink-0">
            <button type="button" className="chip nav-chip whitespace-nowrap" aria-current={index === currentIndex ? 'page' : undefined}
              onClick={() => { playClick(); onNavigate(route.path) }}>{route.label}</button>
          </li>)}
        </ol>
        <div ref={homeRow} inert={home ? '' : undefined} aria-hidden={home || undefined}
          className={`flex justify-center p-1.5 ${home ? GHOST : ''}`}>
          <button type="button" className="chip nav-chip flex items-center gap-2.5 whitespace-nowrap pl-4" onClick={() => { playClick(); onNavigate('/') }}>
            <svg viewBox="0 0 24 24" className="size-[1.05rem] fill-none stroke-current" strokeWidth="1.3" strokeLinejoin="round" aria-hidden="true"><path d="M3.5 11 12 4l8.5 7M6 9v10.5h4.5V14h3v5.5H18V9" /></svg>
            Home
          </button>
        </div>
      </div>
    </nav>
  </>
}
