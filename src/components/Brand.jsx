import { assetUrl } from '../utils/format.js'

// The logo (white, so it sits on a blue tile) next to the site name.
export default function Brand({ href = '#top' }) {
  return (
    <a className="brand" href={href}>
      <span className="brand__mark" aria-hidden="true">
        <img src={assetUrl('/nsoroma-logo.png')} alt="" />
      </span>
      NSOROMA ARCHIVES
    </a>
  )
}
