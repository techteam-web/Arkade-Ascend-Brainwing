import { lazy, Suspense, useState } from 'react'
import { ChevronIcon } from '../components/Brand.jsx'
import { neuGen, orbit } from '../content/project.js'

const OrbitView = lazy(() => import('../scenes/orbit/OrbitView.jsx'))

// Day, evening and night, each as a symbol: the sun, the sun setting on the
// horizon, the moon (drawn on a 24 px grid in the line weight of the site's icons).
const LIGHTS = [
  { id: 'day', label: 'Day', icon: <><circle cx="12" cy="12" r="4" /><path d="M12 2.75v2.1M12 19.15v2.1M2.75 12h2.1M19.15 12h2.1M5.46 5.46l1.48 1.48M17.06 17.06l1.48 1.48M5.46 18.54l1.48-1.48M17.06 6.94l1.48-1.48" /></> },
  { id: 'evening', label: 'Evening', icon: <path d="M7.25 17a4.75 4.75 0 0 1 9.5 0M12 8.25v2.1M6.2 11.2l1.48 1.48M17.8 11.2l-1.48 1.48M2.75 17h18.5M8 20.25h8" /> },
  { id: 'night', label: 'Night', icon: <path d="M19.75 14.6A7.9 7.9 0 1 1 9.4 4.25a6.3 6.3 0 0 0 10.35 10.35z" /> },
]

// The home screen: the tower's rendered orbit fills the page under its own
// sky. Drag, swipe, scroll or use the arrow keys to turn it; the sun, sunset
// and moon at the right middle change its light (the gold 'flow' sweep).
export default function TowerPage() {
  const [moved, setMoved] = useState(false)
  const [light, setLight] = useState('day')

  return <section className="absolute inset-0 overflow-hidden" aria-label="The Tower">
    <div data-reveal="fade" className="absolute inset-0">
      <Suspense fallback={<img src={orbit.poster[light === 'day' ? 'day' : 'night']} alt="" className="absolute inset-0 size-full object-cover" />}>
        {/* Zoomed in, so the tower reads larger (client, 14 Oct 2026). */}
        <OrbitView light={light} keys zoom={1.32} onFirstMove={() => setMoved(true)}
          label="Rendered 360 degree orbit of Arkade Ascend in its neighbourhood. Drag, swipe or use the left and right arrow keys to turn it." />
      </Suspense>
    </div>
    {/* Shade the corner and edge that carry text, so it reads over sky. */}
    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(18,11,13,.62),rgba(18,11,13,.12)_34%,transparent_55%,rgba(18,11,13,.25)_78%,rgba(18,11,13,.8))]" />
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_65%_at_0%_0%,rgba(18,11,13,.7),rgba(18,11,13,.25)_55%,transparent)]" />

    {/* About the project (client, 18 Nov 2026): a small, quiet card beside
        the tower, cream frosted glass with deep wine and teal lettering, in the
        Neu Gen type (Billie Eilish headline, Gotham text). The words are the
        brochure's own (neuGen in project.js). Left of the tower on laptops,
        at the top on portrait screens. */}
    <div className="page pointer-events-none flex flex-col justify-center-safe max-lg:justify-start">
      <div data-reveal="fade" className="w-[min(21rem,100%)] rounded-[1.1rem] border border-wine-700/15 bg-cream-50/80 p-[clamp(1.1rem,2vw,1.75rem)] shadow-[0_24px_60px_-30px_rgba(18,11,13,.7)] backdrop-blur-md short:w-[min(18rem,46%)] short:p-4">
        <p data-reveal className="text-[0.6rem] font-medium uppercase tracking-[0.32em] text-teal-700">Malad West &middot; Mumbai</p>
        <h1 tabIndex={-1} data-reveal="lines" className="mt-3 font-display text-[clamp(1.6rem,min(2.4vw,4.4vh),2.3rem)] uppercase leading-[1] text-wine-700 outline-none short:text-[1.35rem]">
          Neu Gen life has arrived
        </h1>
        <span data-reveal="line" aria-hidden="true" className="mt-4 block h-px w-10 bg-teal-600/60 short:mt-2.5" />
        <p data-reveal className="mt-4 text-[0.82rem] leading-[1.7] text-teal-800 short:mt-2.5 short:text-[0.75rem]">{neuGen.landmark.label}.</p>
      </div>

      {/* Day / Evening / Night (client, 20 Nov 2026): three symbols stacked
          at the right middle, in the menu bar's plum glass, the chosen one in
          its gold pill; 44 px targets. On portrait screens the card spans the
          top, so the panel sits at the right in the middle of the space below it. */}
      <div data-reveal="fade" role="group" aria-label="Time of day" data-tone="dark"
        className="nav-bar pointer-events-auto absolute right-(--gutter) top-1/2 flex -translate-y-1/2 flex-col gap-0.5 rounded-full p-1 stack:static stack:my-auto stack:shrink-0 stack:translate-y-0 stack:self-end">
        {LIGHTS.map(item => <button key={item.id} type="button" aria-label={item.label} title={item.label} aria-pressed={light === item.id}
          className="nav-chip grid size-11 shrink-0 place-items-center rounded-full" onClick={() => setLight(item.id)}>
          <svg viewBox="0 0 24 24" className="size-[1.35rem] fill-none stroke-current" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{item.icon}</svg>
        </button>)}
      </div>
    </div>

    {/* The drag hint, until the first move: below the building, just above
        the menu bar (client, 18 Nov 2026), so it reads clear of the tower. */}
    <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 bottom-[calc(var(--credit-space)+clamp(0.6rem,2.2vh,1.4rem))] z-[36] flex justify-center transition-opacity duration-700 ${moved ? 'opacity-0' : 'opacity-100'}`}>
      <p className="flex items-center gap-4 text-ivory [text-shadow:0_1px_10px_rgba(0,0,0,.75)]">
        <ChevronIcon direction="left" className="h-3.5 w-3 stroke-current stroke-[1.4]" />
        <span className="text-[0.64rem] font-medium uppercase tracking-[0.3em]"><span className="pointer-coarse:hidden">Drag to orbit</span><span className="hidden pointer-coarse:inline">Swipe to orbit</span></span>
        <ChevronIcon className="h-3.5 w-3 stroke-current stroke-[1.4]" />
      </p>
    </div>

    {/* Bottom right (client, 16 Oct 2026): the BrainWing credit holds the bottom left. */}
    <p className="pointer-events-none absolute bottom-(--credit-bottom) right-(--gutter) z-[36] text-[0.52rem] uppercase tracking-[0.22em] text-ivory/75 [text-shadow:0_1px_6px_rgba(0,0,0,.5)]">Architect’s impression</p>
  </section>
}
