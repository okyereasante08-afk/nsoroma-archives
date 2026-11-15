import { useEffect, useRef, useState } from 'react'
import { assetUrl } from '../utils/format.js'
import EnlargedModel from './EnlargedModel.jsx'

// Shows the 3D model when one exists. It turns slowly by itself so it is obvious it is 3D.
// Rotation starts off when reduced motion is on, and there is always a button to stop or start it.
// Two quick taps: ask about the video. Three quick taps (or the Enlarge button): big view.
export default function ModelViewer({ item, prefs, onDoubleTap }) {
  const reduceMotion = prefs.motion === 'reduce' || window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [state, setState] = useState(item.model ? 'loading' : 'none')
  const [playing, setPlaying] = useState(!reduceMotion)
  const [enlarged, setEnlarged] = useState(false)
  const ref = useRef(null)
  const taps = useRef({ down: null, last: null, count: 0, timer: null })

  useEffect(() => {
    if (!item.model) return
    import('@google/model-viewer').catch(() => setState('error'))
  }, [item.model])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onLoad = () => setState('ready')
    const onError = () => setState('error')
    el.addEventListener('load', onLoad)
    el.addEventListener('error', onError)
    return () => {
      el.removeEventListener('load', onLoad)
      el.removeEventListener('error', onError)
    }
  }, [item.model, state === 'error'])

  useEffect(() => () => clearTimeout(taps.current.timer), [])

  // Count quick taps in nearly the same spot (dragging does not count).
  const onPointerDown = (e) => { taps.current.down = { x: e.clientX, y: e.clientY, t: Date.now() } }
  const onPointerUp = (e) => {
    const t = taps.current
    const down = t.down
    t.down = null
    if (!down) return
    clearTimeout(t.timer)
    const quick = Math.hypot(e.clientX - down.x, e.clientY - down.y) <= 10 && Date.now() - down.t <= 400
    if (!quick) { t.count = 0; t.last = null; return }
    const near = t.last && Math.hypot(e.clientX - t.last.x, e.clientY - t.last.y) < 30
    t.count = near ? t.count + 1 : 1
    t.last = { x: e.clientX, y: e.clientY }
    if (t.count >= 3) {
      t.count = 0
      t.last = null
      setEnlarged(true)
      return
    }
    t.timer = setTimeout(() => {
      const count = t.count
      t.count = 0
      t.last = null
      if (count === 2 && onDoubleTap) onDoubleTap()
    }, 400)
  }
  const onKeyDown = (e) => { if (e.key === 'Enter' && onDoubleTap) onDoubleTap() }

  if (state === 'none' || state === 'error') {
    return (
      <div className="viewer viewer--empty">
        <p>
          {state === 'error'
            ? 'The 3D model could not be loaded. The description below covers the same information.'
            : '3D model coming soon. The description below covers the same information.'}
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="viewer" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onKeyDown={onKeyDown}>
        <model-viewer
          ref={ref}
          src={assetUrl(item.model)}
          alt={item.modelDescription || item.name}
          camera-controls=""
          touch-action="pan-y"
          shadow-intensity="1"
          interaction-prompt="none"
          auto-rotate={playing ? '' : undefined}
          rotation-per-second="12deg"
          auto-rotate-delay="500"
        ></model-viewer>
      </div>
      <div className="viewer__bar">
        <button type="button" className="btn btn--ghost" onClick={() => setPlaying((p) => !p)}>
          {playing ? 'Stop rotation' : 'Start rotation'}
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => setEnlarged(true)}>Enlarge 3D model</button>
      </div>
      <p className="viewer__help">
        {state === 'loading'
          ? 'Loading 3D model…'
          : 'The model turns slowly by itself. Drag or swipe to rotate it, and pinch or scroll to zoom. Click or tap it twice (or press Enter on it) to be asked about its video. Click or tap it three times, or use the Enlarge button, for a big view. With the keyboard, focus the model, then use the arrow keys to rotate and Page Up and Page Down to zoom.'}
      </p>
      {item.modelSource && <p className="viewer__help">Model source: {item.modelSource}</p>}
      <EnlargedModel item={item} open={enlarged} onClose={() => setEnlarged(false)} rotating={playing} />
    </div>
  )
}
