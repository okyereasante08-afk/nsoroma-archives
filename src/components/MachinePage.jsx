import { useEffect, useRef } from 'react'
import StatusBadge from './StatusBadge.jsx'
import ModelViewer from './ModelViewer.jsx'
import ReadAloud from './ReadAloud.jsx'
import SafeImage from './SafeImage.jsx'
import Brand from './Brand.jsx'
import { formatDate, sourceLabel, assetUrl } from '../utils/format.js'

function buildReadText(item) {
  const state = item.status === 'ACTIVE' ? 'This machine is still active.' : 'This machine is no longer active.'
  return `${item.name}. ${item.simpleExplanation} ${state} ${item.audioDescription || item.modelDescription || ''}`
}

// A machine's own full-screen page. Reached at #/machine/<id>, so it can be opened in its own tab.
export default function MachinePage({ item, prefs }) {
  const titleRef = useRef(null)

  useEffect(() => {
    if (!item) return
    window.scrollTo(0, 0)
    if (titleRef.current) titleRef.current.focus()
    const previous = document.title
    document.title = `${item.name} | NSOROMA ARCHIVES`
    return () => { document.title = previous }
  }, [item])

  const bar = (
    <header className="machine-bar">
      <div className="container machine-bar__inner">
        <a className="back" href="#archive">Back to the archive</a>
        <Brand />
      </div>
    </header>
  )

  if (!item) {
    return (
      <>
        {bar}
        <main id="main" className="machine">
          <div className="container">
            <h1 className="machine__title">Machine not found</h1>
            <p>We could not find that machine. Go back to the archive and choose another.</p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      {bar}
      <main id="main" className="machine">
        <div className="container">
          <p className="meta-line">{item.category}</p>
          <h1 className="machine__title" ref={titleRef} tabIndex={-1}>{item.name}</h1>
          <div className="machine__status">
            <StatusBadge status={item.status} />
            <span className="meta-line">Mission: {item.mission}</span>
          </div>
          <p className="lede">{item.simpleExplanation}</p>
          <ReadAloud key={item.id} text={buildReadText(item)} audioFile={assetUrl(item.audioFile)} auto={prefs.autoRead} />
          {!item.verified && (
            <p className="notice">This entry is still being checked against NASA sources, so details may change.</p>
          )}

          <div className="machine__grid">
            <div>
              {item.image && (
                <figure className="machine__figure">
                  <SafeImage path={item.image} alt={item.imageAltText} />
                </figure>
              )}
              <section aria-labelledby="m-3d">
                <h2 id="m-3d">3D model</h2>
                <ModelViewer item={item} prefs={prefs} />
              </section>
              <section aria-labelledby="m-look">
                <h2 id="m-look">What it looks like</h2>
                <p>{item.audioDescription || item.modelDescription}</p>
              </section>
              {item.visualExplanation && (
                <details className="details" open={prefs.expandVisual}>
                  <summary>How it worked</summary>
                  <p>{item.visualExplanation}</p>
                </details>
              )}
            </div>

            <div>
              <section aria-labelledby="m-did">
                <h2 id="m-did">What it did</h2>
                <p>{item.purpose}</p>
                <p>{item.scientificContribution}</p>
              </section>
              <section aria-labelledby="m-why">
                <h2 id="m-why">Why it matters</h2>
                <p>{item.historicalSignificance}</p>
              </section>
              <section aria-labelledby="m-facts">
                <h2 id="m-facts">Mission facts</h2>
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
              <section aria-labelledby="m-src">
                <h2 id="m-src">Sources</h2>
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
          </div>
          <p className="machine__back"><a className="btn" href="#archive">Back to the archive</a></p>
        </div>
      </main>
    </>
  )
}
