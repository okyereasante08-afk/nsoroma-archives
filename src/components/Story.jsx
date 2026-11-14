import { useState } from 'react'
import story from '../data/story.json'
import { assetUrl } from '../utils/format.js'

// The explainer video with captions, an audio-described version, a sign-language video and a transcript.
// Everything is driven by src/data/story.json. Missing pieces are handled gracefully.
export default function Story() {
  const [described, setDescribed] = useState(false)
  const [showSign, setShowSign] = useState(true)

  const hasSign = Boolean(story.signLanguageVideo)
  const mainSrc = described && story.audioDescribedVideo ? story.audioDescribedVideo : story.video
  const transcript = Array.isArray(story.transcript) ? story.transcript : []

  return (
    <div className="story">
      <p>{story.intro}</p>

      {story.video ? (
        <>
          <div className="story__options">
            {story.audioDescribedVideo && (
              <label className="choice">
                <input type="checkbox" checked={described} onChange={(e) => setDescribed(e.target.checked)} />
                <span>Play the audio-described version</span>
              </label>
            )}
            {hasSign && (
              <label className="choice">
                <input type="checkbox" checked={showSign} onChange={(e) => setShowSign(e.target.checked)} />
                <span>Show the sign-language video</span>
              </label>
            )}
          </div>

          <div className={`story__media${hasSign && showSign ? ' story__media--signed' : ''}`}>
            <div>
              <video key={mainSrc} controls preload="metadata" poster={assetUrl(story.poster) || undefined} aria-label="The Space Story explainer video">
                <source src={assetUrl(mainSrc)} />
                {story.captions.map((track, i) => (
                  <track key={track.src} kind="captions" src={assetUrl(track.src)} srcLang={track.lang} label={track.label} default={i === 0} />
                ))}
                Your browser cannot play this video. Please read the transcript below instead.
              </video>
            </div>
            {hasSign && showSign && (
              <div>
                <p className="story__label">Sign-language interpretation</p>
                <video controls preload="metadata" src={assetUrl(story.signLanguageVideo)} aria-label="Sign-language interpretation of The Space Story" />
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="story__soon">
          <p><strong>The video is still in production.</strong></p>
          <p>When it is ready, it will appear here with captions, an audio-described version, a sign-language video and the full transcript. Until then, every machine in the archive has a written story you can read or hear aloud.</p>
        </div>
      )}

      <details className="details transcript">
        <summary>Read the full transcript</summary>
        {transcript.length ? transcript.map((p, i) => <p key={i}>{p}</p>) : <p>The transcript will be published together with the video.</p>}
      </details>
    </div>
  )
}
