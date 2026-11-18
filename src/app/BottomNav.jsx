import { useEffect, useRef } from 'react'
import { sections, sectionIndex } from './routes.js'
import { playClick, preloadClick } from './clickSound.js'

// The foot of the screen (client, 18 Nov 2026), in the site's plum and gold
// (`.nav-bar`, `.nav-chip` in index.css). The home screen carries the menu:
// one bar of the sections, scrolling sideways where it does not fit, keeping
// the current item in view. Every other page carries only a Home button in
// the same place. A soft plum gradient rises behind either so it reads over
// any page.
export default function BottomNav({ currentId, onNavigate }) {
  const list = useRef(null)
  const currentIndex = sectionIndex(currentId)
  const home = currentId === 'tower'
  useEffect(() => { preloadClick() }, [])

  useEffect(() => {
    const row = list.current
    const pill = row?.querySelector('[aria-current="page"]')
    if (!row || !pill || row.scrollWidth <= row.clientWidth) return
    const left = pill.offsetLeft - (row.clientWidth - pill.offsetWidth) / 2
    row.scrollTo({ left, behavior: 'smooth' })
  }, [currentIndex, home])

  return <>
    {/* The website's plum, rising from the foot, with a faint warmth of gold under the bar. */}
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[35] h-[calc(var(--credit-space)+4rem)] bg-[radial-gradient(ellipse_45%_70%_at_50%_100%,rgba(176,133,82,.22),transparent_70%),linear-gradient(to_top,rgba(26,17,20,.9),rgba(33,22,26,.62)_38%,rgba(61,42,47,.22)_70%,transparent)]" />

    {home
      ? <nav aria-label="Sections" data-tone="dark"
        className="absolute inset-x-(--gutter) bottom-(--foot-clear) z-40 flex justify-center">
        <div className="nav-bar min-w-0 max-w-full rounded-full">
          <ol ref={list} className="nav-row flex items-center gap-1 overflow-x-auto overscroll-x-contain rounded-full p-1.5">
            {sections.map((route, index) => <li key={route.id} className="shrink-0">
              <button type="button" className="chip nav-chip whitespace-nowrap" aria-current={index === currentIndex ? 'page' : undefined}
                onClick={() => { playClick(); onNavigate(route.path) }}>{route.label}</button>
            </li>)}
          </ol>
        </div>
      </nav>
      : <nav aria-label="Home" data-tone="dark"
        className="absolute inset-x-(--gutter) bottom-(--foot-clear) z-40 flex justify-center">
        <div className="nav-bar rounded-full p-1.5">
          <button type="button" className="chip nav-chip flex items-center gap-2.5 whitespace-nowrap pl-4" onClick={() => { playClick(); onNavigate('/') }}>
            <svg viewBox="0 0 24 24" className="size-[1.05rem] fill-none stroke-current" strokeWidth="1.3" strokeLinejoin="round" aria-hidden="true"><path d="M3.5 11 12 4l8.5 7M6 9v10.5h4.5V14h3v5.5H18V9" /></svg>
            Home
          </button>
        </div>
      </nav>}
  </>
}
