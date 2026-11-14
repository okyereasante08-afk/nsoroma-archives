// Turns "1969-07-16" into "16 July 1969". Dates are read as UTC so they never shift a day.
export function formatDate(value, fallback = 'Not recorded') {
  if (!value) return fallback
  const date = new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}

// Gives each source link a descriptive name instead of a bare URL.
export function sourceLabel(url) {
  try {
    const { hostname } = new URL(url)
    if (hostname.includes('nssdc')) return 'NASA NSSDCA record'
    if (hostname.includes('science.nasa.gov')) return 'NASA Science mission page'
    return hostname
  } catch {
    return url
  }
}

// Asset paths in hardware.json start with "/assets/...". This makes them work on any host.
export function assetUrl(path) {
  return path ? `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}` : null
}
