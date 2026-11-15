import { useEffect, useState } from 'react'
import { speak, stopSpeaking, speechSupported } from '../utils/speech.js'
import AudioShell from './AudioShell.jsx'
import AudioPlayer from './AudioPlayer.jsx'

// Plays a human voiceover file if one exists, and always offers the device's own voice as the baseline.
export default function ReadAloud({ text, audioFile, auto }) {
  const [reading, setReading] = useState(false)

  useEffect(() => {
    if (auto && speechSupported) {
      setReading(true)
      speak(text, () => setReading(false))
    }
    return () => stopSpeaking()
  }, [text, auto])

  const toggle = () => {
    if (reading) {
      stopSpeaking()
      setReading(false)
    } else {
      setReading(true)
      speak(text, () => setReading(false))
    }
  }

  return (
    <div className="readaloud">
      {audioFile && <AudioPlayer src={audioFile} />}
      {speechSupported ? (
        <AudioShell active={reading} label="Read aloud with your device's voice" title="Device voice">
          <div className="audio__row">
            <button type="button" className="audio__play" onClick={toggle}>
              <svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                {reading ? <path d="M3 3h10v10H3z" /> : <path d="M3 1.5v13l11-6.5z" />}
              </svg>
              {reading ? 'Stop reading' : 'Read description aloud'}
            </button>
            <span role="status" className="audio__status">{reading ? 'Reading aloud…' : ''}</span>
          </div>
        </AudioShell>
      ) : (
        <p>Read-aloud is not supported in this browser. Everything is also available as text on this page.</p>
      )}
    </div>
  )
}
