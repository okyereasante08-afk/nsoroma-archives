import { useEffect, useState } from 'react'
import StatusBadge from './StatusBadge.jsx'
import SafeImage from './SafeImage.jsx'

// Rotating showcase. Each slide links to that machine's own full-screen page.
// Rotation can be paused, stops on hover or focus, and is off when reduced motion is on.
export default function Carousel({ items, prefs }) {
  const reduceMotion = prefs.motion === 'reduce' || window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(!reduceMotion)
  const [hovering, setHovering] = useState(false)
  const [focusing, setFocusing] = useState(false)

  const count = items.length
  const go = (i) => setIndex((i + count) % count)
  const rotating = playing && !hovering && !focusing && !reduceMotion

  useEffect(() => {
    if (!rotating) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), 6000)
    return () => clearInterval(timer)
  }, [rotating, count])

  return (
    <div
      className="carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured machines"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setFocusing(true)}
      onBlur={() => setFocusing(false)}
    >
      <div className="carousel__viewport" aria-live={rotating ? 'off' : 'polite'}>
        <div className="carousel__track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {items.map((item, i) => {
            const active = i === index
            return (
              <div
                key={item.id}
                className="slide"
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
                {...(active ? {} : { inert: '' })}
              >
                <div className="slide__art">
                  {item.image ? (
                    <SafeImage path={item.image} alt={item.imageAltText} />
                  ) : (
                    <div className="slide__placeholder" aria-hidden="true">
                      <span className="slide__year">{item.launchDate.slice(0, 4)}</span>
                      <span>Photo coming soon</span>
                    </div>
                  )}
                </div>
                <div className="slide__body">
                  <p className="meta-line">{item.category}</p>
                  <h3>
                    <a className="slide__link" href={`#/machine/${item.id}`}>{item.name}</a>
                  </h3>
                  <p>{item.simpleExplanation}</p>
                  <StatusBadge status={item.status} />
                  <p className="slide__cta">Open the full page</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="carousel__controls">
        <button type="button" className="btn btn--ghost" onClick={() => go(index - 1)}>Previous</button>
        <button type="button" className="btn btn--ghost" onClick={() => go(index + 1)}>Next</button>
        <button type="button" className="btn btn--ghost" onClick={() => setPlaying((p) => !p)} disabled={reduceMotion}>
          {playing && !reduceMotion ? 'Pause rotation' : 'Start rotation'}
        </button>
        <ul className="dots">
          {items.map((item, i) => (
            <li key={item.id}>
              <button type="button" className="dot" aria-current={i === index ? 'true' : undefined} onClick={() => setIndex(i)}>
                <span aria-hidden="true"></span>
                <span className="sr-only">Show {item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
