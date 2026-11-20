import { useEffect, useLayoutEffect, useRef, useSyncExternalStore } from 'react'

// Back in the menu bar, beside Home (client, 20 Nov 2026). A page offers it
// while it has something open in place of a close (×) button; pressing Back
// closes it. Offers nest by `depth`, the deepest open one closing first: on
// Residences, 1 is Visual selection or the unit finder, 2 the comparison,
// 3 a drone view. An offer belongs to the page it was made on, so leaving the
// page takes Back away at once, even while that page is still fading out.
const offers = new Set()
const listeners = new Set()
let snapshot = []
const emit = () => { snapshot = [...offers]; listeners.forEach(listener => listener()) }
const subscribe = listener => { listeners.add(listener); return () => listeners.delete(listener) }

export function useBack(active, run, depth = 1) {
  const latest = useRef(run)
  useLayoutEffect(() => { latest.current = run })
  useEffect(() => {
    if (!active) return
    const offer = { depth, path: window.location.pathname, run: () => latest.current() }
    offers.add(offer)
    emit()
    return () => { offers.delete(offer); emit() }
  }, [active, depth])
}

// The Back on offer for the page at `path` (the deepest), or null.
export function useBackFor(path) {
  const list = useSyncExternalStore(subscribe, () => snapshot)
  return list.reduce((top, offer) => offer.path !== path || (top && top.depth > offer.depth) ? top : offer, null)
}
