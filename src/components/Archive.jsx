import { useMemo, useState } from 'react'
import StatusBadge from './StatusBadge.jsx'
import { formatDate } from '../utils/format.js'
import SafeImage from './SafeImage.jsx'

const ALL = 'all'
const FIELDS = [
  { key: 'environment', label: 'Environment' },
  { key: 'category', label: 'Category' },
  { key: 'launchEra', label: 'Launch era' },
  { key: 'status', label: 'Status' },
]
const INITIAL = { environment: ALL, category: ALL, launchEra: ALL, status: ALL }

const unique = (items, key) => [...new Set(items.map((i) => i[key]).filter(Boolean))].sort()

export default function Archive({ items }) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState(INITIAL)

  const options = useMemo(() => {
    const result = {}
    FIELDS.forEach(({ key }) => { result[key] = unique(items, key) })
    return result
  }, [items])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((item) => {
      const matchesFilters = FIELDS.every(({ key }) => filters[key] === ALL || item[key] === filters[key])
      const text = [item.name, item.mission, item.category, item.purpose, item.simpleExplanation].join(' ').toLowerCase()
      return matchesFilters && (!q || text.includes(q))
    })
  }, [items, query, filters])

  const clear = () => { setQuery(''); setFilters(INITIAL) }
  const filtered = query || FIELDS.some(({ key }) => filters[key] !== ALL)

  return (
    <div>
      <form className="filters" role="search" aria-label="Search and filter the archive" onSubmit={(e) => e.preventDefault()}>
        <div className="field field--search">
          <label htmlFor="archive-search">Search the archive</label>
          <input id="archive-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try rover, Jupiter or Apollo" />
        </div>
        {FIELDS.map(({ key, label }) => (
          <div className="field" key={key}>
            <label htmlFor={`filter-${key}`}>{label}</label>
            <select id={`filter-${key}`} value={filters[key]} onChange={(e) => setFilters((f) => ({ ...f, [key]: e.target.value }))}>
              <option value={ALL}>All</option>
              {options[key].map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
        {filtered && <button type="button" className="btn btn--ghost" onClick={clear}>Clear search and filters</button>}
      </form>

      <p className="count" role="status">Showing {results.length} of {items.length} machines</p>

      {results.length === 0 ? (
        <p className="empty">No machines match. Clear the search or choose different filters.</p>
      ) : (
        <ul className="index">
          {results.map((item) => (
            <li key={item.id} className="entry">
              <p className="entry__year" aria-hidden="true">{item.launchDate.slice(0, 4)}</p>
              <article className="entry__main" aria-labelledby={`title-${item.id}`}>
                {item.image && <SafeImage className="entry__img" path={item.image} alt={item.imageAltText} loading="lazy" />}
                <h3 id={`title-${item.id}`}>{item.name}</h3>
                <p className="meta-line">{item.category}</p>
                <p className="meta-line">Launched {formatDate(item.launchDate)}</p>
                <p className="meta-line">Worked in: {item.environment}</p>
                <p>{item.simpleExplanation}</p>
              </article>
              <div className="entry__side">
                <StatusBadge status={item.status} />
                <a className="btn" href={`#/machine/${item.id}`}>
                  View full page<span className="sr-only"> for {item.name}</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
