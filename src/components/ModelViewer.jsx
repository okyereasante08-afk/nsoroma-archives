import { useEffect, useRef, useState } from 'react'
import { assetUrl } from '../utils/format.js'

// Shows the 3D model when one exists. Otherwise shows a clear message, never a broken box.
export default function ModelViewer({ item }) {
  const [state, setState] = useState(item.model ? 'loading' : 'none')
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
        ></model-viewer>
      </div>
      <p className="viewer__help">
        {state === 'loading' ? 'Loading 3D model…' : 'Drag or swipe to rotate. Pinch or scroll to zoom. With the keyboard, focus the model, then use the arrow keys to rotate and Page Up and Page Down to zoom.'}
      </p>
      {item.modelSource && <p className="viewer__help">Model source: {item.modelSource}</p>}
    </div>
  )
}
