// Shared look for audio controls. Idle: neo-brutalist (flat, thick border, hard shadow).
// Active (playing or reading aloud): it morphs into frosted glass over a colourful backdrop.
export default function AudioShell({ active, label, title, children }) {
  return (
    <div className={`audio${active ? ' audio--active' : ''}`} role="group" aria-label={label}>
      <div className="audio__bg" aria-hidden="true"><span></span><span></span></div>
      <div className="audio__card">
        <p className="audio__title">{title}</p>
        {children}
      </div>
    </div>
  )
}
