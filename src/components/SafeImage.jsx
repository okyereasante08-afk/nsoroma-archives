import { useState } from 'react'
import { assetUrl } from '../utils/format.js'

// Shows a picture from hardware.json. If the file cannot be loaded, it shows a plain message
// (including the exact path while developing) instead of a broken-image icon.
export default function SafeImage({ path, alt, className, loading }) {
  const [failed, setFailed] = useState(false)
  const src = assetUrl(path)

  if (failed) {
    return (
      <div className={`image-missing ${className || ''}`} role="img" aria-label={alt || 'Image unavailable'}>
        <p>{import.meta.env.DEV ? `Image not found: ${path}` : 'Photo coming soon'}</p>
      </div>
    )
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt || ''}
      loading={loading}
      onError={() => {
        console.warn(`NSOROMA: image not found at ${src}. Check the "image" path in hardware.json and the file in public/.`)
        setFailed(true)
      }}
    />
  )
}
