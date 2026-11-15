import { useEffect, useRef, useState } from 'react'
import { assetUrl } from '../utils/format.js'

// Shows the 3D model when one exists. It turns slowly by itself so it is obvious it is 3D.
// Rotation starts off when reduced motion is on, and there is always a button to stop or start it.
export default function ModelViewer({ item, prefs }) {
  const reduceMotion = prefs.motion === 'reduce' || window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [state, setState] = useState(item.model ? 'loading' : 'none')
  const [playing, setPlaying] = useState(!reduceMotion)
  const ref = useRef(null)

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
      <div className="viewer">
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
        <p className="viewer__help">
          {state === 'loading'
            ? 'Loading 3D model…'
            : 'The model turns slowly by itself. Drag or swipe to rotate it yourself, and pinch or scroll to zoom. With the keyboard, focus the model, then use the arrow keys to rotate and Page Up and Page Down to zoom.'}
        </p>
      </div>
      {item.modelSource && <p className="viewer__help">Model source: {item.modelSource}</p>}
    </div>
  )
}
