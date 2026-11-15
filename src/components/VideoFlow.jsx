import { useEffect, useRef, useState } from 'react'
import { assetUrl } from '../utils/format.js'

// Two steps in one dialog: first ask "watch the video, or was that a mistake?", then play the
// video that belongs to this machine (with captions, a transcript and an optional sign-language video).
// mode is 'ask', 'play' or null (closed).
export default function VideoFlow({ item, mode, setMode }) {
  const ref = useRef(null)
  const titleRef = useRef(null)
  const yesRef = useRef(null)
  const [showSign, setShowSign] = useState(true)
  const open = mode !== null

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  useEffect(() => {
    if (mode === 'ask' && yesRef.current) yesRef.current.focus()
    if (mode === 'play' && titleRef.current) titleRef.current.focus()
  }, [mode])

  const captions = Array.isArray(item.videoCaptions) ? item.videoCaptions : []
  const transcript = Array.isArray(item.videoTranscript) ? item.videoTranscript : []
  const hasSign = Boolean(item.signLanguageResource)

  return (
    <dialog ref={ref} className="dialog dialog--video" aria-labelledby="video-title" onClose={() => setMode(null)}>
      <div className="dialog__body">
        {mode === 'ask' && (
          <>
            <h2 id="video-title" ref={titleRef} tabIndex={-1}>Watch the video about {item.name}?</h2>
            <p>You clicked or tapped the model twice. Would you like to watch a video about this machine?</p>
            <div className="dialog__actions">
              <button type="button" className="btn" ref={yesRef} onClick={() => setMode('play')}>Yes, watch the video</button>
              <button type="button" className="btn btn--ghost" onClick={() => setMode(null)}>No, it was a mistake</button>
            </div>
          </>
        )}

        {mode === 'play' && (
          <>
            <div className="dialog__head">
              <h2 id="video-title" ref={titleRef} tabIndex={-1}>{item.name}: video</h2>
              <button type="button" className="btn btn--ghost" onClick={() => setMode(null)}>Close</button>
            </div>

            {item.video ? (
              <>
                {hasSign && (
                  <label className="choice">
                    <input type="checkbox" checked={showSign} onChange={(e) => setShowSign(e.target.checked)} />
                    <span>Show the sign-language video</span>
                  </label>
                )}
                <div className={`story__media${hasSign && showSign ? ' story__media--signed' : ''}`}>
                  <video controls autoPlay playsInline preload="metadata" aria-label={`Video about ${item.name}`}>
                    <source src={assetUrl(item.video)} />
                    {captions.map((track, i) => (
                      <track key={track.src} kind="captions" src={assetUrl(track.src)} srcLang={track.lang} label={track.label} default={i === 0} />
                    ))}
                    Your browser cannot play this video. Please read the transcript below instead.
                  </video>
                  {hasSign && showSign && (
                    <div>
                      <p className="story__label">Sign-language interpretation</p>
                      <video controls playsInline preload="metadata" src={assetUrl(item.signLanguageResource)} aria-label={`Sign-language interpretation of the video about ${item.name}`} />
                    </div>
                  )}
                </div>
                <details className="details">
                  <summary>Read the transcript</summary>
                  {transcript.length ? transcript.map((p, i) => <p key={i}>{p}</p>) : <p>The transcript will be published together with the video.</p>}
                </details>
              </>
            ) : (
              <p>The video for this machine is coming soon. Everything about it is also available as text on its page.</p>
            )}
          </>
        )}
      </div>
    </dialog>
  )
}
