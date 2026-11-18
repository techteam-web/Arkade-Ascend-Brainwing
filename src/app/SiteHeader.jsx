import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router'
import { gsap } from './reveal.js'
import { BrandLockup } from '../components/Brand.jsx'
import { pad, sectionIndex, sections } from './routes.js'
import { prefersReducedMotion } from '../hooks/useMediaQuery.js'

// The logo and the section counter; the menu is the bar at the foot (BottomNav).
export default function SiteHeader({ route, tone, hidden = false }) {
  const index = sectionIndex(route.id)
  const root = useRef(null)
  useLayoutEffect(() => {
    const duration = prefersReducedMotion() ? 0 : 0.8
    if (hidden) {
      gsap.to(root.current, { autoAlpha: 0, y: -12, duration, ease: 'silk', overwrite: true })
    } else {
      gsap.set(root.current, { visibility: 'visible' })
      gsap.to(root.current, { opacity: 1, y: 0, duration, ease: 'silk', delay: duration ? 0.35 : 0, overwrite: true })
    }
  }, [hidden])

  return <header ref={root} data-tone={tone || route.tone || 'dark'} inert={hidden ? '' : undefined}
    className="site-header pointer-events-none absolute inset-x-0 top-0 z-30 flex h-(--header-h) items-center justify-between px-(--gutter)">
    <Link to="/" className="relative pointer-events-auto -m-2 rounded-sm p-2 transition-opacity duration-500 hover:opacity-80" aria-label="Arkade Ascend, home">
      <BrandLockup />
    </Link>
    <div className="relative pointer-events-auto flex items-center gap-4 sm:gap-7">
      {index >= 0 && <p className="num hidden items-center gap-2 text-[0.72rem] text-muted sm:flex" aria-label={`Section ${index + 1} of ${sections.length}`}>
        <span className="text-fg">{pad(index + 1)}</span><span className="opacity-60">/</span><span>{pad(sections.length)}</span>
      </p>}
    </div>
  </header>
}
