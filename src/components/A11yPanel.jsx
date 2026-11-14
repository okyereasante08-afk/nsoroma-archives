import { useEffect, useRef } from 'react'
import { PRESETS } from '../hooks/usePreferences.js'

function Choice({ name, value, current, onChange, label }) {
  return (
    <label className="choice">
      <input type="radio" name={name} value={value} checked={current === value} onChange={() => onChange(value)} />
      <span>{label}</span>
    </label>
  )
}

export default function A11yPanel({ open, onClose, prefs, update, reset, onPreset }) {
  const ref = useRef(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  return (
    <dialog ref={ref} className="dialog" aria-labelledby="a11y-title" onClose={onClose}>
      <div className="dialog__body">
        <div className="dialog__head">
          <h2 id="a11y-title">Accessibility settings</h2>
          <button type="button" className="btn btn--ghost" onClick={onClose}>Close</button>
        </div>
        <p>Settings are saved on this device. By default we follow your device's own contrast and motion settings.</p>

        <fieldset>
          <legend>Text size</legend>
          <Choice name="textSize" value="100" current={prefs.textSize} onChange={(v) => update({ textSize: v })} label="Standard" />
          <Choice name="textSize" value="125" current={prefs.textSize} onChange={(v) => update({ textSize: v })} label="Large" />
          <Choice name="textSize" value="150" current={prefs.textSize} onChange={(v) => update({ textSize: v })} label="Extra large" />
        </fieldset>

        <fieldset>
          <legend>Contrast</legend>
          <Choice name="contrast" value="auto" current={prefs.contrast} onChange={(v) => update({ contrast: v })} label="Follow my device" />
          <Choice name="contrast" value="high" current={prefs.contrast} onChange={(v) => update({ contrast: v })} label="High contrast" />
        </fieldset>

        <fieldset>
          <legend>Motion</legend>
          <Choice name="motion" value="auto" current={prefs.motion} onChange={(v) => update({ motion: v })} label="Follow my device" />
          <Choice name="motion" value="reduce" current={prefs.motion} onChange={(v) => update({ motion: v })} label="Reduce motion" />
        </fieldset>

        <fieldset>
          <legend>Descriptions</legend>
          <label className="choice">
            <input type="checkbox" checked={prefs.autoRead} onChange={(e) => update({ autoRead: e.target.checked })} />
            <span>Read each machine's description aloud when I open it</span>
          </label>
          <label className="choice">
            <input type="checkbox" checked={prefs.expandVisual} onChange={(e) => update({ expandVisual: e.target.checked })} />
            <span>Open the visual explanation ("How it worked") by default</span>
          </label>
        </fieldset>

        <fieldset>
          <legend>Quick presets</legend>
          <div className="preset-list">
            {Object.entries(PRESETS).map(([key, preset]) => (
              <button key={key} type="button" className="preset" onClick={() => onPreset(key)}>
                <span className="preset__label">{preset.label}</span>
                <span className="preset__hint">{preset.hint}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <h3>Keyboard help</h3>
        <ul>
          <li>Tab and Shift+Tab move between controls.</li>
          <li>Enter or Space presses a button.</li>
          <li>Escape closes a window.</li>
          <li>On a 3D model, use the arrow keys to rotate and Page Up and Page Down to zoom.</li>
        </ul>

        <button type="button" className="btn btn--ghost" onClick={reset}>Reset to defaults</button>
      </div>
    </dialog>
  )
}
