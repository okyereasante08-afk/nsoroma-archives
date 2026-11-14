// Status is shown with a word AND a shape AND a colour, never colour alone.
export default function StatusBadge({ status }) {
  const active = status === 'ACTIVE'
  return (
    <span className={`status ${active ? 'status--active' : 'status--inactive'}`}>
      <svg aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 14 14">
        {active ? (
          <circle cx="7" cy="7" r="6" fill="currentColor" />
        ) : (
          <rect x="1.5" y="1.5" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" />
        )}
      </svg>
      {active ? 'ACTIVE' : 'INACTIVE'}
    </span>
  )
}
