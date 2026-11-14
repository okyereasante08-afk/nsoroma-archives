import { useEffect, useRef } from 'react'
import StatusBadge from './StatusBadge.jsx'
import ModelViewer from './ModelViewer.jsx'
import ReadAloud from './ReadAloud.jsx'
import { formatDate, sourceLabel, assetUrl } from '../utils/format.js'
import { stopSpeaking } from '../utils/speech.js'

function buildReadText(item) {
  const state = item.status === 'ACTIVE' ? 'This machine is still active.' : 'This machine is no longer active.'
  return `${item.name}. ${item.simpleExplanation} ${state} ${item.audioDescription || item.modelDescription || ''}`
}

export default function Inspector({ item, prefs, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  const close = () => ref.current && ref.current.close()
  const handleClose = () => {
    stopSpeaking()
    onClose()
  }

  return (
    <dialog
      ref={ref}
      className="dialog dialog--wide"
      aria-labelledby="inspector-title"
      onClose={handleClose}
      onClick={(e) => { if (e.target === ref.current) close() }}
    >
      <div className="dialog__body">
        <div className="dialog__head">
          <div>
            <h2 id="inspector-title">{item.name}</h2>
            <p className="meta-line">{item.category}</p>
            <p className="meta-line">Mission: {item.mission}</p>
            <StatusBadge status={item.status} />
          </div>
          <button type="button" className="btn btn--ghost" onClick={close}>
            Close<span className="sr-only"> {item.name} details</span>
          </button>
        </div>

        <p className="lede">{item.simpleExplanation}</p>
        <ReadAloud key={item.id} text={buildReadText(item)} audioFile={assetUrl(item.audioFile)} auto={prefs.autoRead} />

        {!item.verified && (
          <p className="notice">This entry is still being checked against NASA sources, so details may change.</p>
        )}

        <section aria-labelledby="insp-3d">
          <h3 id="insp-3d">3D model</h3>
          <ModelViewer item={item} />
        </section>

        <section aria-labelledby="insp-look">
          <h3 id="insp-look">What it looks like</h3>
          <p>{item.audioDescription || item.modelDescription}</p>
        </section>

        {item.visualExplanation && (
          <details className="details" open={prefs.expandVisual}>
            <summary>How it worked</summary>
            <p>{item.visualExplanation}</p>
          </details>
        )}

        <section aria-labelledby="insp-did">
          <h3 id="insp-did">What it did</h3>
          <p>{item.purpose}</p>
          <p>{item.scientificContribution}</p>
        </section>

        <section aria-labelledby="insp-why">
          <h3 id="insp-why">Why it matters</h3>
          <p>{item.historicalSignificance}</p>
        </section>

        <section aria-labelledby="insp-facts">
          <h3 id="insp-facts">Mission facts</h3>
          <dl className="facts">
            <div><dt>Launched</dt><dd>{formatDate(item.launchDate)}</dd></div>
            <div><dt>Mission ended</dt><dd>{formatDate(item.missionEndDate, item.status === 'ACTIVE' ? 'Ongoing' : 'Not recorded')}</dd></div>
            {item.lastContactDate && <div><dt>Last contact</dt><dd>{formatDate(item.lastContactDate)}</dd></div>}
            <div><dt>Where it is now</dt><dd>{item.physicalLocation}</dd></div>
            <div><dt>Where it worked</dt><dd>{item.environment}</dd></div>
            <div><dt>Launch era</dt><dd>{item.launchEra}</dd></div>
          </dl>
          <p>{item.statusDetail}</p>
        </section>

        <section aria-labelledby="insp-src">
          <h3 id="insp-src">Sources</h3>
          {item.sourceLinks.length ? (
            <ul>
              {item.sourceLinks.map((url) => (
                <li key={url}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {sourceLabel(url)}<span className="sr-only"> for {item.name} (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>Source links are being added.</p>
          )}
        </section>
      </div>
    </dialog>
  )
}
