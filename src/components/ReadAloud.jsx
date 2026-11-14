import { useEffect, useState } from 'react'
import { speak, stopSpeaking, speechSupported } from '../utils/speech.js'

// Plays a human voiceover file if one exists, and always offers browser read-aloud as the baseline.
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
      {audioFile && (
        <div className="readaloud__voice">
          <p>Human voiceover</p>
          <audio controls src={audioFile}>Your browser does not support audio playback.</audio>
        </div>
      )}
      {speechSupported ? (
        <div className="readaloud__row">
          <button type="button" className="btn" onClick={toggle}>
            {reading ? 'Stop reading' : 'Read description aloud'}
          </button>
          <span role="status" className="readaloud__status">{reading ? 'Reading aloud…' : ''}</span>
        </div>
      ) : (
        <p>Read-aloud is not supported in this browser. Everything is also available as text on this page.</p>
      )}
    </div>
  )
}
