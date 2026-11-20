'use client'

import { useEffect, useRef } from 'react'

export type TechItem = {
  name: string
  // simpleicons slug, e.g. "netlify" — used when no local src
  icon?: string
  // Local or absolute image path — preferred for AWS / Azure / OpenAI
  src?: string
}

type BlocksTechCarouselProps = {
  items: TechItem[]
  label?: string
}

function iconSrc(item: TechItem): string | null {
  if (item.src) return item.src
  if (item.icon) return `https://cdn.simpleicons.org/${item.icon}/b7d4ef`
  return null
}

// Slow horizontal marquee of the tech stack — pauses when the user hovers.
export default function BlocksTechCarousel({
  items,
  label = 'Tech stack',
}: BlocksTechCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let offset = 0
    let paused = false
    const speed = 0.35

    const tick = () => {
      if (!paused) {
        offset -= speed
        const half = track.scrollWidth / 2
        if (Math.abs(offset) >= half) offset = 0
        track.style.transform = `translateX(${offset}px)`
      }
      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)

    const onEnter = () => {
      paused = true
    }
    const onLeave = () => {
      paused = false
    }
    track.addEventListener('mouseenter', onEnter)
    track.addEventListener('mouseleave', onLeave)
    track.addEventListener('focusin', onEnter)
    track.addEventListener('focusout', onLeave)

    return () => {
      window.cancelAnimationFrame(frame)
      track.removeEventListener('mouseenter', onEnter)
      track.removeEventListener('mouseleave', onLeave)
      track.removeEventListener('focusin', onEnter)
      track.removeEventListener('focusout', onLeave)
    }
  }, [])

  const loop = [...items, ...items]

  return (
    <section className="blocks-site__tech" aria-label={label}>
      <div className="blocks-site__wrap">
        <h2>{label}</h2>
      </div>
      <div className="blocks-site__tech-viewport">
        <div ref={trackRef} className="blocks-site__tech-track">
          {loop.map((item, index) => {
            const src = iconSrc(item)
            return (
              <div
                key={`${item.name}-${index}`}
                className="blocks-site__tech-item"
                aria-hidden={index >= items.length ? true : undefined}
              >
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt="" width={28} height={28} loading="lazy" />
                ) : null}
                <span>{item.name}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
