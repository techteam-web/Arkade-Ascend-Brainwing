import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import SilkScene from './scenes/silk/SilkScene.jsx'
import { sceneStore, setScenePreset } from './scenes/sceneStore.js'
import FullscreenGate from './app/FullscreenGate.jsx'
import IntroVideo from './app/IntroVideo.jsx'
import SiteHeader from './app/SiteHeader.jsx'
import BottomNav from './app/BottomNav.jsx'
import TransitionStage from './app/TransitionStage.jsx'
import { ShellContext } from './app/ShellContext.js'
import { routeForPath } from './app/routes.js'
import useFullscreen from './hooks/useFullscreen.js'
import useMediaQuery from './hooks/useMediaQuery.js'

// Development-only escape hatch for automated screenshots: ?fullscreen=off
const bypassGate = import.meta.env.DEV && new URLSearchParams(location.search).get('fullscreen') === 'off'
if (import.meta.env.DEV) window.__sceneStore = sceneStore   // for automated checks

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const route = routeForPath(location.pathname)
  const compact = useMediaQuery('(max-width: 900px), (pointer: coarse)')
  const fullscreen = useFullscreen()
  const [started, setStarted] = useState(false)
  const [everStarted, setEverStarted] = useState(false)
  // A page can set the header's tone while it shows a light ground (About
  // Us on gold); it clears it again as it leaves.
  const [tone, setTone] = useState(null)

  // Where the Fullscreen API exists it is required; where it does not (for
  // example iPhone Safari) the gate becomes a one-time start screen.
  const gated = !bypassGate && (fullscreen.supported ? !fullscreen.active : !started)
  useEffect(() => { if (!gated) setEverStarted(true) }, [gated])
  useLayoutEffect(() => { setScenePreset(route.scene) }, [route.scene])

  // The opening film plays once per visit, from the first tap on the gate;
  // the page underneath makes its entrance as the film fades (IntroVideo).
  const [intro, setIntro] = useState(bypassGate ? 'done' : 'ready')
  const film = useRef(null)
  // Leaving full screen during the film ends it; the gate takes over.
  const wasGated = useRef(gated)
  useEffect(() => {
    if (gated && !wasGated.current && intro === 'playing') film.current?.stop()
    wasGated.current = gated
  }, [gated, intro])

  const enter = async () => {
    // Inside the tap, so the film may play with its sound.
    if (intro === 'ready') { setIntro('playing'); film.current?.start() }
    if (!fullscreen.supported || !(await fullscreen.request())) setStarted(true)
  }
  const introOver = intro === 'fading' || intro === 'done'

  // The menu is the bar at the foot of every page (BottomNav); it never
  // covers a page, so `menuOpen` stays false for the pages that read it.
  const go = useCallback(path => {
    if (path !== location.pathname) navigate(path)
  }, [navigate, location.pathname])
  const shell = useMemo(() => ({ openMenu: () => {}, go, menuOpen: false, setTone, gated }), [go, gated])

  return <ShellContext.Provider value={shell}>
    <main className="fixed inset-0 overflow-hidden bg-espresso">
      <SilkScene quality={compact ? 'low' : 'high'} />
      <div className={`page-frame transition-opacity duration-700 ${gated ? 'opacity-0' : 'opacity-100'}`}
        inert={gated ? '' : undefined} aria-hidden={gated || undefined}>
        <div className="absolute inset-0">
          <TransitionStage active={!gated && introOver} />
        </div>
        <SiteHeader route={route} tone={tone} />
        <BottomNav currentId={route.id} onNavigate={go} />
      </div>
      <div className="grain" aria-hidden="true" />
      {/* The BrainWing credit: small, at the foot of every screen, above
          everything (menu, overlays, the gate), in the tone of what is under
          it so it always reads. The logo is a mask filled with that tone. */}
      <div data-credit data-tone="dark" className="credit pointer-events-none fixed z-[110]">
        <div role="img" aria-label="Developed by BrainWing Innovations" className="credit-mark aspect-[800/214] bg-fg opacity-85" />
      </div>
      {intro !== 'done' && <IntroVideo ref={film} state={intro} onFade={() => setIntro('fading')} onDone={() => setIntro('done')} />}
      <FullscreenGate open={gated} resumed={everStarted} supported={fullscreen.supported}
        keyboardLocked={fullscreen.keyboardLocked} onEnter={enter} />
    </main>
  </ShellContext.Provider>
}
