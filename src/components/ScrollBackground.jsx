import { useEffect, useRef } from 'react'
import backgrounds from '../data/backgrounds.json'
import { assetUrl } from '../utils/format.js'

// A fixed backdrop. It starts solid blue, then each picture in backgrounds.json fades in
// (darkened so text stays readable) as the visitor scrolls, one screen of scrolling per picture.
// With reduced motion on, it stays solid blue. In high contrast it is always solid.
export default function ScrollBackground({ prefs, startStage = 0 }) {
  const layers = useRef([])

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const reduce = document.documentElement.dataset.motion === 'reduce'
      const stage = reduce ? 0 : startStage + window.scrollY / Math.max(window.innerHeight, 1)
      layers.current.forEach((el, i) => {
        if (el) el.style.opacity = String(Math.min(1, Math.max(0, stage - i)))
      })
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    frame = requestAnimationFrame(update)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [prefs.motion, startStage])

  return (
    <div className="bg" aria-hidden="true">
      {backgrounds.map((bg, i) => (
        <div
          key={bg.src}
          className="bg__layer"
          ref={(el) => { layers.current[i] = el }}
          style={{
            opacity: 0,
            backgroundImage: `linear-gradient(rgb(4 6 28 / .45), rgb(4 6 28 / .45)), url("${assetUrl(bg.src)}")`,
          }}
        />
      ))}
    </div>
  )
}
