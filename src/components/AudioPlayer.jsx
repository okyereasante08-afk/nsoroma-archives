import { useId, useRef, useState } from 'react'
import AudioShell from './AudioShell.jsx'

const RATES = [1, 1.25, 1.5, 0.75]

function fmt(seconds) {
  if (!Number.isFinite(seconds)) return '0:00'
  const s = Math.floor(seconds)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

// Custom player for the human voiceover. Built on a normal <audio> element, with real buttons and a slider.
export default function AudioPlayer({ src, title = 'Human voiceover' }) {
  const audio = useRef(null)
  const id = useId()
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [rateIndex, setRateIndex] = useState(0)
  const [failed, setFailed] = useState(false)

  const toggle = () => {
    const el = audio.current
    if (!el) return
    if (el.paused) el.play().catch(() => setFailed(true))
    else el.pause()
  }
  const seek = (e) => {
    const value = Number(e.target.value)
    audio.current.currentTime = value
    setCurrent(value)
  }
  const cycleRate = () => {
    const next = (rateIndex + 1) % RATES.length
    setRateIndex(next)
    audio.current.playbackRate = RATES[next]
  }
  const pct = duration ? `${(current / duration) * 100}%` : '0%'

  if (failed) {
    return (
      <AudioShell active={false} label={title} title={title}>
        <p className="audio__status">The voiceover could not be loaded. The written description below says the same thing.</p>
      </AudioShell>
    )
  }

  return (
    <AudioShell active={playing} label={title} title={title}>
      <audio
        ref={audio}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
        onTimeUpdate={(e) => setCurrent(e.target.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => setFailed(true)}
      />
      <div className="audio__row">
        <button type="button" className="audio__play" onClick={toggle}>
          <svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            {playing ? <path d="M3 2h4v12H3zM9 2h4v12H9z" /> : <path d="M3 1.5v13l11-6.5z" />}
          </svg>
          {playing ? 'Pause' : 'Play voiceover'}
        </button>
        <div className="audio__track">
          <label className="sr-only" htmlFor={id}>Seek through the voiceover</label>
          <input
            id={id}
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={current}
            onChange={seek}
            style={{ '--pct': pct }}
            aria-valuetext={`${fmt(current)} of ${fmt(duration)}`}
          />
          <div className="audio__time"><span>{fmt(current)}</span><span>{fmt(duration)}</span></div>
        </div>
        <button type="button" className="audio__speed" onClick={cycleRate}>Speed {RATES[rateIndex]}×</button>
      </div>
    </AudioShell>
  )
}
