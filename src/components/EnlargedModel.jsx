import { useEffect, useRef } from 'react'
import { assetUrl } from '../utils/format.js'

// The 3D model in a big window over the middle of the page. Escape or Close returns to the page.
export default function EnlargedModel({ item, open, onClose, rotating }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog ref={ref} className="dialog dialog--model" aria-labelledby="enlarged-title" onClose={onClose}>
      {open && (
        <div className="dialog__body">
          <div className="dialog__head">
            <h2 id="enlarged-title">{item.name}: 3D model</h2>
            <button type="button" className="btn btn--ghost" onClick={onClose}>Close</button>
          </div>
          <div className="enlarged">
            <model-viewer
              src={assetUrl(item.model)}
              alt={item.modelDescription || item.name}
              camera-controls=""
              touch-action="pan-y"
              shadow-intensity="1"
              interaction-prompt="none"
              auto-rotate={rotating ? '' : undefined}
              rotation-per-second="12deg"
              auto-rotate-delay="500"
            ></model-viewer>
          </div>
          <p className="viewer__help">Drag to rotate. Scroll or pinch to zoom. Press Escape to close.</p>
        </div>
      )}
    </dialog>
  )
}
