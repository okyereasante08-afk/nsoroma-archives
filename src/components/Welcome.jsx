import { useEffect, useRef } from 'react'
import { PRESETS } from '../hooks/usePreferences.js'

// Optional first-visit dialog. Always skippable, and nobody is asked to identify as anything.
export default function Welcome({ open, onChoose, onCustomize, onSkip }) {
  const ref = useRef(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  return (
    <dialog ref={ref} className="dialog" aria-labelledby="welcome-title" onClose={onSkip}>
      <div className="dialog__body">
        <h2 id="welcome-title">Welcome to NSOROMA ARCHIVES</h2>
        <p className="lede">Space exploration belongs to everyone. How would you like to experience the universe?</p>
        <div className="preset-list">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button key={key} type="button" className="preset" onClick={() => onChoose(key)}>
              <span className="preset__label">{preset.label}</span>
              <span className="preset__hint">{preset.hint}</span>
            </button>
          ))}
          <button type="button" className="preset" onClick={onCustomize}>
            <span className="preset__label">Customize accessibility preferences</span>
            <span className="preset__hint">Choose text size, contrast, motion and more.</span>
          </button>
        </div>
        <p>You can change any of this at any time with the Accessibility button.</p>
        <button type="button" className="btn btn--ghost" onClick={onSkip}>Skip for now</button>
      </div>
    </dialog>
  )
}
