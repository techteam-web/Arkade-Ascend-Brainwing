// The menu's click (client, 18 Nov 2026): public/sound/Click.mp3, played when a
// menu pill is pressed. It loads once; each press restarts it, so quick presses
// each sound. A blocked or failed play is ignored: the sound is a nicety.
let audio = null

export function playClick() {
  if (typeof Audio === 'undefined') return
  try {
    if (!audio) {
      audio = new Audio('/sound/Click.mp3')
      audio.preload = 'auto'
      audio.volume = 0.6
    }
    audio.currentTime = 0
    audio.play()?.catch(() => {})
  } catch { /* no sound */ }
}

// Fetch it ahead of the first press, so that press is not silent.
export function preloadClick() {
  if (typeof Audio === 'undefined' || audio) return
  audio = new Audio('/sound/Click.mp3')
  audio.preload = 'auto'
  audio.volume = 0.6
}
