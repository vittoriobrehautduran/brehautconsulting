'use client'

import { useEffect, useRef, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import BlocksNav from '@/components/blocks/BlocksNav'
import { sitePath } from '@/components/blocks/serviceRoutes'

const FPS = 24
const END = 20.458333
const SPEED_FWD = 2.5
const SPEED_REV = 2.6
// Second flick mid-transition nudges rate up a bit — still moderate, not turbo.
const SPEED_BOOST_PER_EXTRA = 0.35
const SPEED_MAX = 3.3
// Last stop is AI automation — no outro floating-blocks scene after that.
const STOPS = [1.541667, 4.291667, 8.208333, 11.291667, 14.708333, 18.125]
// Need a real notch/swipe — trackpads won't skip scenes on a light flick.
const WHEEL_ACCUM = 48
// While a scene is playing, require a clearer second flick to queue ahead.
const WHEEL_ACCUM_BUSY = 90
const WHEEL_IDLE_RESET_MS = 320
// 0.6s between accepted flicks — can queue the next stop while a transition is still playing.
const QUEUE_MIN_GAP_MS = 600
const STEP_COOLDOWN_MS = 0
const TOUCH_SWIPE_MIN = 22
const STOP_SLACK = 0.5 / FPS
// Below this width: no scroll-step story — just a looping intro of the blocks.
const COMPACT_MQ = '(max-width: 999px)'

const FWD_SRC = '/media/hero/brehaut_blocks_scroll.mp4'
const REV_SRC = '/media/hero/brehaut_blocks_scroll_rev.mp4'
// Full / mid / small stills — pick lighter files on phone.
const stillIndex = (n: number) => Math.min(5, Math.max(0, n))
const STILL = (n: number) => `/media/hero/scroll_stills/stop_${stillIndex(n)}.jpg`
const STILL_SRCSET = (n: number) => {
  const i = stillIndex(n)
  return `/media/hero/scroll_stills/stop_${i}-960.jpg 960w, /media/hero/scroll_stills/stop_${i}-1280.jpg 1280w, /media/hero/scroll_stills/stop_${i}.jpg 1920w`
}
const STILL_FOR_VIEWPORT = (n: number) => {
  if (typeof window === 'undefined') return STILL(n)
  const width = window.innerWidth
  const i = stillIndex(n)
  if (width <= 960) return `/media/hero/scroll_stills/stop_${i}-960.jpg`
  if (width <= 1280) return `/media/hero/scroll_stills/stop_${i}-1280.jpg`
  return STILL(n)
}

const SCENE_NAMES = [
  'Floating blocks',
  'Websites',
  'Found first on search',
  'Ads that convert',
  'Analytics',
  'AI automation',
]

// Service copy on the left (0 = intro; last = AI automation).
const SERVICE_AT_STOP = [
  null,
  'service1',
  'service3',
  'service4',
  'service5',
  'service6',
] as const

function rev(t: number) {
  return +(END - t).toFixed(6)
}

function clampStop(n: number) {
  return Math.min(STOPS.length - 1, Math.max(0, n))
}

type Direction = 1 | -1

function playbackRateFor(dir: Direction, fromStop: number, toStop: number) {
  const span = Math.max(1, Math.abs(toStop - fromStop))
  const base = dir === 1 ? SPEED_FWD : SPEED_REV
  return Math.min(SPEED_MAX, base + (span - 1) * SPEED_BOOST_PER_EXTRA)
}

// Scroll-stepped hero: one gesture = one scene. Forward + reverse MP4s, exact stop times.
// Extra flicks while a step is playing retarget + speed up toward the intended stop.
export default function HomeBlocksScroll() {
  const t = useTranslations('home')
  const tServices = useTranslations('home.services')
  const tCommon = useTranslations('common.buttons')
  const tBlocks = useTranslations('blocks')
  const heroRef = useRef<HTMLElement>(null)
  const fwdRef = useRef<HTMLVideoElement>(null)
  const revRef = useRef<HTMLVideoElement>(null)
  const stillARef = useRef<HTMLImageElement>(null)
  const stillBRef = useRef<HTMLImageElement>(null)
  const liveRef = useRef<HTMLDivElement>(null)

  const stopRef = useRef(0)
  const busyRef = useRef(false)
  const engagedRef = useRef(true)
  const lastWheelTsRef = useRef(0)
  const wheelAccumRef = useRef(0)
  const cooldownUntilRef = useRef(0)
  const revLoadedRef = useRef(false)
  const useStillsRef = useRef(false)
  const touchStartYRef = useRef<number | null>(null)
  const pendingTargetRef = useRef<number | null>(null)
  // Stop the current play started from / last fully settled on.
  const settledStopRef = useRef(0)
  // Where the user wants to land (can move ahead while a step is in flight).
  const intentStopRef = useRef(0)
  // Extra down-flick at the final stop → release into the page after we arrive.
  const releaseAfterRef = useRef(false)
  const lastQueueTsRef = useRef(0)
  const activeDirRef = useRef<Direction>(1)
  const cancelWatchRef = useRef<(() => void) | null>(null)

  const [stop, setStop] = useState(0)
  const [hintVisible, setHintVisible] = useState(true)
  // Start with the server's values (false) so hydration matches; the effect
  // below syncs the real media queries right after mount. The CSS already
  // switches the compact layout by media query, so nothing visibly jumps.
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isCompact, setIsCompact] = useState(false)
  const [activeLayer, setActiveLayer] = useState<'fwd' | 'rev'>('fwd')
  const [isStills, setIsStills] = useState(false)

  // Compact / reduced-motion: no stepped scenes — intro copy only.
  const serviceKey = isCompact || reducedMotion ? null : SERVICE_AT_STOP[stop]

  const announce = (index: number) => {
    if (liveRef.current) liveRef.current.textContent = SCENE_NAMES[index] ?? ''
  }

  const releaseLock = (scrollToNext = false) => {
    engagedRef.current = false
    busyRef.current = false
    cancelWatchRef.current?.()
    cancelWatchRef.current = null
    fwdRef.current?.pause()
    revRef.current?.pause()
    if (scrollToNext) {
      // Drop into the rest of the redesigned home (about / services).
      const next =
        document.getElementById('about') || document.getElementById('blocks-end')
      next?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const seekVideo = (video: HTMLVideoElement, time: number) =>
    new Promise<void>((resolve) => {
      const done = () => {
        video.removeEventListener('seeked', done)
        resolve()
      }
      video.addEventListener('seeked', done)
      try {
        video.currentTime = time
      } catch {
        resolve()
      }
    })

  const applyStopUI = (index: number) => {
    stopRef.current = index
    setStop(index)
    announce(index)
    if (index > 0) setHintVisible(false)
  }

  // Jump straight to a stop (dot / nav) — no intermediate scenes.
  const jumpToStop = async (target: number) => {
    if (reducedMotion || isCompact) return
    const next = clampStop(target)
    if (next === stopRef.current && !busyRef.current) return

    cancelWatchRef.current?.()
    cancelWatchRef.current = null
    busyRef.current = true
    wheelAccumRef.current = 0
    releaseAfterRef.current = false
    engagedRef.current = true
    window.scrollTo(0, 0)

    intentStopRef.current = next
    settledStopRef.current = next
    pendingTargetRef.current = next
    applyStopUI(next)

    const fwd = fwdRef.current
    const revVideo = revRef.current

    if (useStillsRef.current || !fwd) {
      setIsStills(true)
      if (stillARef.current) {
        stillARef.current.src = STILL_FOR_VIEWPORT(next)
        stillARef.current.srcset = STILL_SRCSET(next)
        stillARef.current.classList.add('is-front')
      }
      if (stillBRef.current) stillBRef.current.classList.remove('is-front')
      busyRef.current = false
      return
    }

    fwd.pause()
    revVideo?.pause()
    await seekVideo(fwd, STOPS[next])
    setActiveLayer('fwd')
    fwd.style.opacity = '1'
    if (revVideo) {
      revVideo.style.opacity = '0'
      if (!revLoadedRef.current) {
        revVideo.preload = 'auto'
        revVideo.load()
        revLoadedRef.current = true
      }
      await seekVideo(revVideo, rev(STOPS[next]))
    }
    busyRef.current = false
    cooldownUntilRef.current = performance.now() + STEP_COOLDOWN_MS
  }

  const syncHiddenVideo = async (atStop: number) => {
    const fwd = fwdRef.current
    const revVideo = revRef.current
    if (!fwd || !revVideo || useStillsRef.current) return

    const fwdTime = STOPS[atStop]
    const revTime = rev(STOPS[atStop])

    const seek = (video: HTMLVideoElement, time: number) =>
      new Promise<void>((resolve) => {
        const done = () => {
          video.removeEventListener('seeked', done)
          resolve()
        }
        video.addEventListener('seeked', done)
        try {
          video.currentTime = time
        } catch {
          resolve()
        }
      })

    if (activeDirRef.current === 1) {
      if (revLoadedRef.current) await seek(revVideo, revTime)
    } else {
      await seek(fwd, fwdTime)
    }
  }

  const watchUntil = (
    video: HTMLVideoElement,
    target: number,
    onHit: () => void
  ) => {
    let stopped = false
    let rvfcId = 0
    let rafId = 0
    const anyVideo = video as HTMLVideoElement & {
      requestVideoFrameCallback?: (
        cb: (now: number, meta: { mediaTime: number }) => void
      ) => number
      cancelVideoFrameCallback?: (id: number) => void
    }

    const clearTimers = () => {
      if (rvfcId && typeof anyVideo.cancelVideoFrameCallback === 'function') {
        anyVideo.cancelVideoFrameCallback(rvfcId)
        rvfcId = 0
      }
      if (rafId) {
        window.cancelAnimationFrame(rafId)
        rafId = 0
      }
      video.removeEventListener('timeupdate', onTimeUpdate)
    }

    const finish = () => {
      if (stopped) return
      stopped = true
      clearTimers()
      video.pause()
      const settle = () => {
        video.removeEventListener('seeked', settle)
        onHit()
      }
      video.addEventListener('seeked', settle)
      try {
        video.currentTime = target
      } catch {
        onHit()
      }
    }

    const check = (mediaTime: number) => {
      if (stopped) return
      if (mediaTime >= target - STOP_SLACK) finish()
    }

    const onTimeUpdate = () => check(video.currentTime)

    const onRvfc = (_now: number, meta: { mediaTime: number }) => {
      check(meta.mediaTime)
      if (!stopped && typeof anyVideo.requestVideoFrameCallback === 'function') {
        rvfcId = anyVideo.requestVideoFrameCallback(onRvfc)
      }
    }

    const onRaf = () => {
      check(video.currentTime)
      if (!stopped) rafId = window.requestAnimationFrame(onRaf)
    }

    video.addEventListener('timeupdate', onTimeUpdate)
    check(video.currentTime)
    if (typeof anyVideo.requestVideoFrameCallback === 'function') {
      rvfcId = anyVideo.requestVideoFrameCallback(onRvfc)
    } else {
      rafId = window.requestAnimationFrame(onRaf)
    }

    cancelWatchRef.current = () => {
      stopped = true
      clearTimers()
    }
  }

  const playStillsStep = (from: number, to: number) => {
    const a = stillARef.current
    const b = stillBRef.current
    if (!a || !b) {
      busyRef.current = false
      return
    }
    const showB = a.classList.contains('is-front')
    const front = showB ? b : a
    const back = showB ? a : b
    back.src = STILL_FOR_VIEWPORT(to)
    back.srcset = STILL_SRCSET(to)
    back.onload = () => {
      front.classList.remove('is-front')
      back.classList.add('is-front')
      // Shorter crossfade when skipping multiple stops.
      const span = Math.max(1, Math.abs(to - from))
      const delay = span > 1 ? 90 : 220
      window.setTimeout(() => {
        void finishArrive(to)
      }, delay)
    }
    if (back.complete) back.onload?.(null as unknown as Event)
  }

  // Settle on a stop; if the user flicked further while we were playing, keep going.
  const finishArrive = async (arrived: number) => {
    const intent = clampStop(intentStopRef.current)
    settledStopRef.current = arrived
    pendingTargetRef.current = arrived
    applyStopUI(arrived)

    const fwd = fwdRef.current
    const revVideo = revRef.current
    if (!useStillsRef.current) {
      await syncHiddenVideo(arrived)
      if (!revLoadedRef.current && revVideo) {
        revVideo.preload = 'auto'
        revVideo.load()
        revLoadedRef.current = true
      }
    }

    if (intent !== arrived) {
      const dir: Direction = intent > arrived ? 1 : -1
      activeDirRef.current = dir
      // Continue from here toward the latest intent (may span multiple stops).
      void startPlay(arrived, intent, dir)
      return
    }

    busyRef.current = false
    cooldownUntilRef.current = performance.now() + STEP_COOLDOWN_MS

    // Landed on the last scene after an extra scroll: just unlock. No auto-scroll —
    // the page stays put and the visitor's next scroll moves it naturally.
    if (releaseAfterRef.current && arrived === STOPS.length - 1) {
      releaseAfterRef.current = false
      releaseLock(false)
    }
  }

  // Watch the active video until we hit `toStop`, speeding up for longer spans.
  const watchToStop = (dir: Direction, fromStop: number, toStop: number) => {
    const video = dir === 1 ? fwdRef.current : revRef.current
    if (!video) {
      busyRef.current = false
      return
    }
    const targetTime = dir === 1 ? STOPS[toStop] : rev(STOPS[toStop])
    video.playbackRate = playbackRateFor(dir, fromStop, toStop)
    pendingTargetRef.current = toStop
    watchUntil(video, targetTime, () => {
      void finishArrive(toStop)
    })
  }

  // Retarget an in-flight play toward a further stop in the same direction.
  const retargetInFlight = (toStop: number) => {
    const dir = activeDirRef.current
    const fromStop = settledStopRef.current
    const video = dir === 1 ? fwdRef.current : revRef.current
    if (!video) return

    cancelWatchRef.current?.()
    cancelWatchRef.current = null
    applyStopUI(toStop)
    pendingTargetRef.current = toStop
    video.playbackRate = playbackRateFor(dir, fromStop, toStop)

    const targetTime = dir === 1 ? STOPS[toStop] : rev(STOPS[toStop])
    // Already past the new target (e.g. flicked back one) — snap-settle.
    if (video.currentTime >= targetTime - STOP_SLACK) {
      video.pause()
      try {
        video.currentTime = targetTime
      } catch {
        /* ignore */
      }
      void finishArrive(toStop)
      return
    }

    watchUntil(video, targetTime, () => {
      void finishArrive(toStop)
    })
  }

  // Start playing from one stop to another (one or many scenes).
  const startPlay = async (fromStop: number, toStop: number, dir: Direction) => {
    busyRef.current = true
    activeDirRef.current = dir
    settledStopRef.current = fromStop
    pendingTargetRef.current = toStop

    if (useStillsRef.current) {
      setIsStills(true)
      playStillsStep(fromStop, toStop)
      return
    }

    const fwd = fwdRef.current
    const revVideo = revRef.current
    if (!fwd) {
      busyRef.current = false
      return
    }

    if (dir === 1) {
      const from = STOPS[fromStop]
      fwd.playbackRate = playbackRateFor(1, fromStop, toStop)
      if (Math.abs(fwd.currentTime - from) > 0.05) {
        await new Promise<void>((resolve) => {
          const done = () => {
            fwd.removeEventListener('seeked', done)
            resolve()
          }
          fwd.addEventListener('seeked', done)
          fwd.currentTime = from
        })
      }
      // Intent may have moved ahead during seek — aim at the latest target.
      const latest = clampStop(intentStopRef.current)
      if (activeDirRef.current !== 1 || latest <= fromStop) return
      setActiveLayer('fwd')
      fwd.style.opacity = '1'
      if (revVideo) revVideo.style.opacity = '0'
      fwd.playbackRate = playbackRateFor(1, fromStop, latest)
      try {
        await fwd.play()
      } catch {
        useStillsRef.current = true
        setIsStills(true)
        playStillsStep(fromStop, latest)
        return
      }
      if (activeDirRef.current !== 1) return
      watchToStop(1, fromStop, clampStop(intentStopRef.current))
      return
    }

    if (!revVideo) {
      busyRef.current = false
      return
    }
    if (!revLoadedRef.current) {
      revVideo.preload = 'auto'
      revVideo.load()
      revLoadedRef.current = true
      await new Promise<void>((resolve) => {
        if (revVideo.readyState >= 2) resolve()
        else revVideo.addEventListener('loadeddata', () => resolve(), { once: true })
      })
    }

    const fromR = rev(STOPS[fromStop])
    revVideo.playbackRate = playbackRateFor(-1, fromStop, toStop)
    await new Promise<void>((resolve) => {
      const done = () => {
        revVideo.removeEventListener('seeked', done)
        resolve()
      }
      revVideo.addEventListener('seeked', done)
      revVideo.currentTime = fromR
    })
    const latestRev = clampStop(intentStopRef.current)
    if (activeDirRef.current !== -1 || latestRev >= fromStop) return
    setActiveLayer('rev')
    revVideo.style.opacity = '1'
    fwd.style.opacity = '0'
    revVideo.playbackRate = playbackRateFor(-1, fromStop, latestRev)
    try {
      await revVideo.play()
    } catch {
      useStillsRef.current = true
      setIsStills(true)
      playStillsStep(fromStop, latestRev)
      return
    }
    if (activeDirRef.current !== -1) return
    watchToStop(-1, fromStop, clampStop(intentStopRef.current))
  }

  // One flick = one stop ahead. 1s gap between flicks; mid-transition scrolls retarget.
  const requestStep = (dir: Direction) => {
    if (reducedMotion || isCompact) return

    const now = performance.now()
    const atEnd = intentStopRef.current === STOPS.length - 1
    const atStart = intentStopRef.current === 0

    if (dir === 1 && atEnd) {
      if (busyRef.current) {
        releaseAfterRef.current = true
        return
      }
      engagedRef.current = false
      wheelAccumRef.current = 0
      return
    }
    if (dir === -1 && atStart && !busyRef.current) return

    // Gap is between user flicks — not waiting for the scene to finish.
    if (now - lastQueueTsRef.current < QUEUE_MIN_GAP_MS) return
    if (!busyRef.current && now < cooldownUntilRef.current) return

    const nextIntent = clampStop(intentStopRef.current + dir)
    if (nextIntent === intentStopRef.current) return

    intentStopRef.current = nextIntent
    lastQueueTsRef.current = now
    wheelAccumRef.current = 0
    applyStopUI(nextIntent)

    if (!busyRef.current) {
      const from = settledStopRef.current
      void startPlay(from, nextIntent, dir)
      return
    }

    // Already transitioning — aim further / reverse with a snap if needed.
    const travelSign = Math.sign(nextIntent - settledStopRef.current) as -1 | 0 | 1
    if (travelSign === 0) {
      void jumpToStop(nextIntent)
      return
    }
    if (travelSign !== activeDirRef.current) {
      void jumpToStop(nextIntent)
      return
    }

    if (useStillsRef.current) {
      playStillsStep(settledStopRef.current, nextIntent)
      return
    }

    retargetInFlight(nextIntent)
  }

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const compact = window.matchMedia(COMPACT_MQ)
    const syncMotion = () => setReducedMotion(motion.matches)
    const syncCompact = () => setIsCompact(compact.matches)
    syncMotion()
    syncCompact()
    motion.addEventListener('change', syncMotion)
    compact.addEventListener('change', syncCompact)
    return () => {
      motion.removeEventListener('change', syncMotion)
      compact.removeEventListener('change', syncCompact)
    }
  }, [])

  useEffect(() => {
    if (reducedMotion) {
      engagedRef.current = false
      busyRef.current = false
      return
    }

    const fwd = fwdRef.current
    if (!fwd) return

    let cancelled = false
    let started = false
    busyRef.current = true
    stopRef.current = 0
    settledStopRef.current = 0
    intentStopRef.current = 0
    pendingTargetRef.current = 0
    releaseAfterRef.current = false
    setStop(0)
    setHintVisible(!isCompact)
    // Compact: page scrolls normally; desktop: lock until the story finishes.
    engagedRef.current = !isCompact

    const seekVideoTo = (video: HTMLVideoElement, time: number) =>
      new Promise<void>((resolve) => {
        if (Math.abs(video.currentTime - time) < 0.01) {
          resolve()
          return
        }
        const done = () => {
          video.removeEventListener('seeked', done)
          resolve()
        }
        video.addEventListener('seeked', done)
        try {
          video.currentTime = time
        } catch {
          resolve()
        }
      })

    const seekTo = (time: number) => seekVideoTo(fwd, time)

    // Narrow screens: tiny forward/reverse sway of the opening blocks — not the full story.
    const startCompactLoop = async () => {
      if (cancelled || started) return
      started = true

      const revVideo = revRef.current
      const introEnd = STOPS[0]
      const revStart = rev(introEnd)
      const revEnd = rev(0)
      // Slow → a touch faster → slow reverse. Rates stay gentle.
      const cycle: Array<{ dir: Direction; rate: number }> = [
        { dir: 1, rate: 0.55 },
        { dir: -1, rate: 0.5 },
        { dir: 1, rate: 0.95 },
        { dir: -1, rate: 0.55 },
      ]

      setActiveLayer('fwd')
      fwd.style.opacity = '1'
      if (revVideo) {
        revVideo.style.opacity = '0'
        if (!revLoadedRef.current) {
          revVideo.preload = 'auto'
          revVideo.load()
          revLoadedRef.current = true
        }
        // Wait until reverse has enough data so the first swap doesn’t hitch.
        if (revVideo.readyState < 3) {
          await new Promise<void>((resolve) => {
            const done = () => {
              revVideo.removeEventListener('canplay', done)
              resolve()
            }
            revVideo.addEventListener('canplay', done, { once: true })
            window.setTimeout(done, 2500)
          })
        }
      }

      await seekTo(0)
      // Pre-warm reverse at the intro join so the first reverse pass is ready.
      if (revVideo) await seekVideoTo(revVideo, revStart)
      if (cancelled) return

      // Soft stop — pause at target, no extra seek (that seek was causing the skip).
      const playUntilSoft = (video: HTMLVideoElement, target: number) =>
        new Promise<void>((resolve) => {
          if (cancelled) {
            resolve()
            return
          }

          let stopped = false
          let rafId = 0
          const anyVideo = video as HTMLVideoElement & {
            requestVideoFrameCallback?: (
              cb: (now: number, meta: { mediaTime: number }) => void
            ) => number
            cancelVideoFrameCallback?: (id: number) => void
          }
          let rvfcId = 0

          const cleanup = () => {
            video.removeEventListener('timeupdate', onTimeUpdate)
            if (rafId) window.cancelAnimationFrame(rafId)
            if (rvfcId && typeof anyVideo.cancelVideoFrameCallback === 'function') {
              anyVideo.cancelVideoFrameCallback(rvfcId)
            }
          }

          const finish = () => {
            if (stopped) return
            stopped = true
            cleanup()
            video.pause()
            resolve()
          }

          const check = (mediaTime: number) => {
            if (stopped || cancelled) {
              finish()
              return
            }
            if (mediaTime >= target - STOP_SLACK) finish()
          }

          const onTimeUpdate = () => check(video.currentTime)
          const onRvfc = (_now: number, meta: { mediaTime: number }) => {
            check(meta.mediaTime)
            if (!stopped && typeof anyVideo.requestVideoFrameCallback === 'function') {
              rvfcId = anyVideo.requestVideoFrameCallback(onRvfc)
            }
          }
          const onRaf = () => {
            check(video.currentTime)
            if (!stopped) rafId = window.requestAnimationFrame(onRaf)
          }

          video.addEventListener('timeupdate', onTimeUpdate)
          if (typeof anyVideo.requestVideoFrameCallback === 'function') {
            rvfcId = anyVideo.requestVideoFrameCallback(onRvfc)
          } else {
            rafId = window.requestAnimationFrame(onRaf)
          }

          cancelWatchRef.current = () => {
            if (stopped) return
            stopped = true
            cleanup()
            resolve()
          }
        })

      // Two frames after play() so the first decoded frame is on screen before we swap.
      const waitPainted = () =>
        new Promise<void>((resolve) => {
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => resolve())
          })
        })

      // Prepare the next clip while the current one stays visible, then swap.
      const revealPlaying = async (
        dir: Direction,
        rate: number
      ): Promise<HTMLVideoElement | null> => {
        if (dir === 1) {
          fwd.playbackRate = rate
          await seekVideoTo(fwd, 0)
          if (cancelled) return null
          try {
            await fwd.play()
          } catch {
            return null
          }
          await waitPainted()
          if (cancelled) return null
          setActiveLayer('fwd')
          fwd.style.opacity = '1'
          if (revVideo) {
            revVideo.style.opacity = '0'
            revVideo.pause()
          }
          return fwd
        }

        if (!revVideo) return null
        revVideo.playbackRate = rate
        await seekVideoTo(revVideo, revStart)
        if (cancelled) return null
        try {
          await revVideo.play()
        } catch {
          return null
        }
        await waitPainted()
        if (cancelled) return null
        setActiveLayer('rev')
        revVideo.style.opacity = '1'
        fwd.style.opacity = '0'
        fwd.pause()
        return revVideo
      }

      // While one direction plays, pre-seek the other so the next pass is already decoded.
      const prewarmOpposite = (dir: Direction) => {
        if (dir === 1 && revVideo) {
          void seekVideoTo(revVideo, revStart)
        } else if (dir === -1) {
          void seekVideoTo(fwd, 0)
        }
      }

      busyRef.current = false
      announce(0)

      let step = 0
      while (!cancelled) {
        const { dir, rate } = cycle[step % cycle.length]
        step += 1

        try {
          const playing = await revealPlaying(dir, rate)
          if (!playing || cancelled) break
          prewarmOpposite(dir)
          await playUntilSoft(playing, dir === 1 ? introEnd : revEnd)
          playing.pause()
        } catch {
          if (cancelled) break
          useStillsRef.current = true
          setIsStills(true)
          busyRef.current = false
          break
        }
      }
    }

    const startIntro = async () => {
      if (cancelled || started) return
      started = true
      fwd.playbackRate = SPEED_FWD
      setActiveLayer('fwd')
      fwd.style.opacity = '1'
      if (revRef.current) revRef.current.style.opacity = '0'
      await seekTo(0)
      if (cancelled) return
      try {
        await fwd.play()
      } catch {
        if (cancelled) return
        useStillsRef.current = true
        setIsStills(true)
        busyRef.current = false
        announce(0)
        return
      }
      if (cancelled) return
      watchUntil(fwd, STOPS[0], async () => {
        if (cancelled) return
        stopRef.current = 0
        setStop(0)
        announce(0)
        await syncHiddenVideo(0)
        busyRef.current = false
        cooldownUntilRef.current = performance.now() + STEP_COOLDOWN_MS
      })
    }

    const onReady = () => {
      if (isCompact) void startCompactLoop()
      else void startIntro()
    }
    if (fwd.readyState >= 2) onReady()
    else {
      fwd.addEventListener('loadeddata', onReady, { once: true })
      fwd.addEventListener('canplay', onReady, { once: true })
    }

    fwd.addEventListener(
      'error',
      () => {
        useStillsRef.current = true
        setIsStills(true)
        busyRef.current = false
      },
      { once: true }
    )

    return () => {
      cancelled = true
      cancelWatchRef.current?.()
      cancelWatchRef.current = null
      fwd.pause()
      revRef.current?.pause()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, isCompact])

  // Input lock while engaged (desktop scroll-step story only).
  useEffect(() => {
    if (reducedMotion || isCompact) return

    const onWheel = (event: WheelEvent) => {
      const now = performance.now()
      const prevWheel = lastWheelTsRef.current
      lastWheelTsRef.current = now
      const goingDown = event.deltaY > 0

      if (!engagedRef.current) return
      if (window.scrollY > 1) return

      // At the final stop, the next downward scroll releases the lock and moves the page.
      // If we're still animating into that stop, remember to release when we land.
      if (stopRef.current === STOPS.length - 1 && goingDown) {
        wheelAccumRef.current = 0
        if (busyRef.current) {
          event.preventDefault()
          releaseAfterRef.current = true
          return
        }
        engagedRef.current = false
        return
      }

      event.preventDefault()

      // Reset accum if the user paused between gentle scrolls.
      if (now - prevWheel > WHEEL_IDLE_RESET_MS) {
        wheelAccumRef.current = 0
      }

      // One deliberate notch/swipe = one step; need more delta to queue mid-play.
      wheelAccumRef.current += event.deltaY
      const need = busyRef.current ? WHEEL_ACCUM_BUSY : WHEEL_ACCUM
      if (Math.abs(wheelAccumRef.current) < need) return
      // Cooldown only blocks a fresh step; queued flicks while busy still count.
      if (!busyRef.current && now < cooldownUntilRef.current) return

      const dir: Direction = wheelAccumRef.current > 0 ? 1 : -1
      wheelAccumRef.current = 0
      requestStep(dir)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (!engagedRef.current || window.scrollY > 1) return
      const nextKeys = ['ArrowDown', 'PageDown', ' ', 'Spacebar', 'End']
      const prevKeys = ['ArrowUp', 'PageUp', 'Home']
      const isNext =
        nextKeys.includes(event.key) && !(event.key === ' ' && event.shiftKey)
      const isPrev =
        prevKeys.includes(event.key) || (event.key === ' ' && event.shiftKey)
      if (!isNext && !isPrev) return
      event.preventDefault()
      if (!busyRef.current && performance.now() < cooldownUntilRef.current) return
      requestStep(isNext ? 1 : -1)
    }

    const onTouchStart = (event: TouchEvent) => {
      if (!engagedRef.current || window.scrollY > 1) return
      touchStartYRef.current = event.touches[0]?.clientY ?? null
    }

    const onTouchMove = (event: TouchEvent) => {
      if (!engagedRef.current || window.scrollY > 1) return
      event.preventDefault()
    }

    const onTouchEnd = (event: TouchEvent) => {
      if (!engagedRef.current || window.scrollY > 1) return
      const startY = touchStartYRef.current
      touchStartYRef.current = null
      if (startY == null) return
      const endY = event.changedTouches[0]?.clientY ?? startY
      const delta = startY - endY
      const goingNext = delta > 0
      if (Math.abs(delta) < TOUCH_SWIPE_MIN) return
      if (!busyRef.current && performance.now() < cooldownUntilRef.current) return
      // Swipe up (finger moves up) = next
      requestStep(goingNext ? 1 : -1)
    }

    const onScroll = () => {
      if (window.scrollY <= 1) {
        if (!engagedRef.current) {
          engagedRef.current = true
          const last = STOPS.length - 1
          stopRef.current = last
          settledStopRef.current = last
          intentStopRef.current = last
          pendingTargetRef.current = last
          releaseAfterRef.current = false
          setStop(last)
          announce(last)
          const fwd = fwdRef.current
          const revVideo = revRef.current
          if (fwd && !useStillsRef.current) {
            fwd.currentTime = STOPS[last]
            fwd.style.opacity = '1'
            if (revVideo) {
              revVideo.currentTime = rev(STOPS[last])
              revVideo.style.opacity = '0'
            }
            setActiveLayer('fwd')
          }
        }
      }
    }

    const onVisibility = () => {
      if (document.hidden) {
        fwdRef.current?.pause()
        revRef.current?.pause()
        return
      }
      if (!busyRef.current || pendingTargetRef.current == null) return
      const targetStop = pendingTargetRef.current
      const dir = activeDirRef.current
      const video = dir === 1 ? fwdRef.current : revRef.current
      if (!video) return
      const target = dir === 1 ? STOPS[targetStop] : rev(STOPS[targetStop])
      video.playbackRate = playbackRateFor(
        dir,
        settledStopRef.current,
        targetStop
      )
      void video.play().then(() => {
        watchUntil(video, target, () => {
          void finishArrive(targetStop)
        })
      })
    }

    const onFocusIn = (event: FocusEvent) => {
      const hero = heroRef.current
      if (!hero) return
      const target = event.target as Node | null
      if (target && !hero.contains(target)) releaseLock(false)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    document.addEventListener('focusin', onFocusIn)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
      document.removeEventListener('focusin', onFocusIn)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, isCompact])

  return (
    <div
      className={`blocks-scroll${isStills ? ' is-stills' : ''}${isCompact ? ' is-compact' : ''}`}
    >
      <a
        className="blocks-scroll__skip"
        href="#about"
        onClick={() => releaseLock(false)}
      >
        {tBlocks('skipToContent')}
      </a>

      <BlocksNav />

      <section
        ref={heroRef}
        id="blocks-story"
        className="blocks-scroll__hero"
        aria-label={tBlocks('productStory')}
      >
        {reducedMotion ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="blocks-scroll__video blocks-scroll__video--static"
            src={STILL(1)}
            srcSet={STILL_SRCSET(1)}
            sizes="100vw"
            alt=""
            aria-hidden="true"
          />
        ) : (
          <>
            <video
              ref={fwdRef}
              id="fwd"
              className="blocks-scroll__video"
              style={{ opacity: activeLayer === 'fwd' ? 1 : 0 }}
              src={FWD_SRC}
              muted
              playsInline
              preload="auto"
              poster={STILL(0)}
              disablePictureInPicture
              aria-hidden="true"
            />
            <video
              ref={revRef}
              id="rev"
              className="blocks-scroll__video"
              style={{ opacity: activeLayer === 'rev' ? 1 : 0 }}
              src={REV_SRC}
              muted
              playsInline
              preload="none"
              disablePictureInPicture
              aria-hidden="true"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={stillARef}
              className="blocks-scroll__still is-front"
              src={STILL(0)}
              srcSet={STILL_SRCSET(0)}
              sizes="100vw"
              alt=""
              aria-hidden="true"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={stillBRef}
              className="blocks-scroll__still"
              src={STILL(1)}
              srcSet={STILL_SRCSET(1)}
              sizes="100vw"
              alt=""
              aria-hidden="true"
            />
          </>
        )}

        <div className="blocks-scroll__scrim" aria-hidden="true" />

        <div className="blocks-scroll__copy">
          {serviceKey ? (
            <div className="blocks-scroll__service" key={serviceKey}>
              <h2>{tServices(`${serviceKey}.title`)}</h2>
              <p className="blocks-scroll__sub">
                {tServices(`${serviceKey}.subtitle`)}
              </p>
              <p>{tServices(`${serviceKey}.description`)}</p>
              <Link className="blocks-scroll__cta" href={sitePath('contact')}>
                {tCommon('contactUs')}
              </Link>
            </div>
          ) : (
            <div className="blocks-scroll__intro" key="intro">
              <h1>{t('hero.tagline')}</h1>
              <p>{t('hero.description')}</p>
              <Link className="blocks-scroll__cta" href={sitePath('contact')}>
                {tCommon('contactUs')}
              </Link>
            </div>
          )}
        </div>

        {!isCompact && !reducedMotion ? (
          <ol className="blocks-scroll__dots" aria-label={tBlocks('jumpToScene')}>
            {SCENE_NAMES.slice(1).map((name, index) => {
              const stopIndex = index + 1
              return (
                <li key={name}>
                  <button
                    type="button"
                    className={stop === stopIndex ? 'is-active' : undefined}
                    aria-label={name}
                    aria-current={stop === stopIndex ? 'true' : undefined}
                    onClick={() => void jumpToStop(stopIndex)}
                  />
                </li>
              )
            })}
          </ol>
        ) : null}

        {hintVisible && !reducedMotion && !isCompact ? (
          <p className="blocks-scroll__hint" aria-hidden="true">
            {tBlocks('scrollHint')}
          </p>
        ) : null}

        {!isCompact && !reducedMotion ? (
          <button
            type="button"
            className="blocks-scroll__skip-scene"
            onClick={() => releaseLock(true)}
          >
            {tBlocks('skipScene')}
          </button>
        ) : null}

        <div ref={liveRef} className="blocks-scroll__live" aria-live="polite" />
      </section>
    </div>
  )
}
