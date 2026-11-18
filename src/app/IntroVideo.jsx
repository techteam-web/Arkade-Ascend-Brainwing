import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '../hooks/useMediaQuery.js'

// The opening film (client, 18 Nov 2026): the visitor's tap on the start gate
// plays public/video/intro-1920.mp4 (a web copy of Transition_sketch-2.mp4:
// the tower drawn as a sketch on paper turning into the render), full screen
// with its sound. When it ends, the home screen opens out of the middle of the
// film (client, 18 Nov 2026): a soft-edged opening grows from the centre to
// the corners while the film pushes in a little, and the page beneath makes
// its entrance through it. Once per visit, with a Skip button.
//
// `state`: 'ready' (hidden under the gate, loading), 'playing', 'fading',
// 'done' (unmounted by the shell). `start()` must be called inside the tap,
// so browsers allow the sound.
const SRC = '/video/intro-1920.mp4'
const OPEN = 1.5   // seconds for the opening to reach the corners

const IntroVideo = forwardRef(function IntroVideo({ state, onFade, onDone }, ref) {
  const root = useRef(null)
  const video = useRef(null)
  const finishing = useRef(false)

  const finish = (instant = false) => {
    if (finishing.current) return
    finishing.current = true
    onFade()
    const done = () => { video.current?.pause(); onDone() }
    if (instant || prefersReducedMotion()) { gsap.set(root.current, { autoAlpha: 0 }); done(); return }
    // A radial mask whose clear centre (--hole) widens past the corners; the
    // feather keeps its edge soft, like light coming through the film.
    const element = root.current
    const mask = 'radial-gradient(circle farthest-corner at 50% 50%, transparent var(--hole), #000 calc(var(--hole) + 22%))'
    element.style.setProperty('--hole', '-22%')
    element.style.webkitMaskImage = mask
    element.style.maskImage = mask
    gsap.timeline({ onComplete: done })
      .to(element, { '--hole': '100%', duration: OPEN, ease: 'power2.inOut' }, 0)
      .to(video.current, { scale: 1.08, duration: OPEN, ease: 'power1.in' }, 0)
  }

  useImperativeHandle(ref, () => ({
    // Called inside the visitor's tap. With sound if the browser allows it,
    // else muted; if it cannot play at all, the home screen comes at once.
    start() {
      const element = video.current
      if (!element) { finish(true); return }
      element.muted = false
      element.currentTime = 0
      element.play()?.catch(() => {
        element.muted = true
        element.play()?.catch(() => finish(true))
      })
    },
    stop: () => finish(true),
  }))

  // A safety net: if the film stalls, the home screen still comes.
  useEffect(() => {
    if (state !== 'playing') return
    const element = video.current
    const limit = (Number.isFinite(element?.duration) ? element.duration : 8) + 6
    const timer = setTimeout(() => finish(), limit * 1000)
    return () => clearTimeout(timer)
  }, [state])

  useLayoutEffect(() => () => { gsap.killTweensOf(root.current); gsap.killTweensOf(video.current) }, [])

  return <div ref={root} aria-hidden={state === 'ready' || undefined}
    className={`fixed inset-0 z-[105] bg-black ${state === 'ready' ? 'invisible' : ''}`}>
    {/* Wide screens fill with the film; tall ones show it whole. */}
    <video ref={video} src={SRC} preload="auto" playsInline disablePictureInPicture
      onEnded={() => finish()} onError={() => { if (state === 'playing') finish(true) }}
      className="absolute inset-0 size-full object-contain landscape:object-cover" aria-label="Arkade Ascend opening film" />
    {state === 'playing' && <button type="button" onClick={() => finish()}
      className="absolute bottom-[max(env(safe-area-inset-bottom),clamp(1rem,4vh,2rem))] right-(--gutter) flex min-h-11 items-center gap-3 rounded-full border border-ivory/30 bg-ink/40 px-5 text-[0.62rem] font-medium uppercase tracking-[0.3em] text-ivory/85 backdrop-blur-sm transition-colors duration-500 hover:border-gold-400 hover:text-gold-200 focus-visible:border-gold-400 focus-visible:text-gold-200">
      Skip
      <svg viewBox="0 0 24 24" className="size-3.5 fill-none stroke-current" strokeWidth="1.4" aria-hidden="true"><path d="m6 5 7 7-7 7M14 5l7 7-7 7" /></svg>
    </button>}
  </div>
})

export default IntroVideo
