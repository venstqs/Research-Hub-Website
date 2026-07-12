import React, { useState, useEffect, useCallback } from 'react'
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react'
import PaperCard from '../components/PaperCard'
import { EmptyState, ErrorState, SkeletonGrid } from '../components/States'
import { fetchPapers } from '../lib/api'

const SORT_OPTIONS = [
  { value: 'created_at:desc', label: 'Newest First' },
  { value: 'created_at:asc',  label: 'Oldest First' },
  { value: 'views:desc',      label: 'Most Viewed' },
  { value: 'title:asc',       label: 'Title A–Z' },
]

const YEAR_OPTIONS = ['All Years', '2025', '2024', '2023', '2022']

export default function BrowseView({ program, onPaperClick }) {
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)
  const [localSearch, setLocalSearch] = useState('')
  const [yearFilter, setYearFilter]   = useState('All Years')
  const [sortBy, setSortBy]           = useState('created_at:desc')
  const [showFilters, setShowFilters] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchPapers({
        program: program !== 'All' ? program : undefined,
        search: localSearch || undefined,
        limit: 50,
      })
      setPapers(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [program, localSearch])

  useEffect(() => {
    const t = setTimeout(load, localSearch ? 400 : 0)
    return () => clearTimeout(t)
  }, [load, localSearch])

  // Client-side sort + year filter (since sort is complex for DB)
  const displayed = papers
    .filter(p => yearFilter === 'All Years' || String(p.year) === yearFilter)
    .sort((a, b) => {
      const [field, dir] = sortBy.split(':')
      const av = a[field] ?? ''
      const bv = b[field] ?? ''
      if (dir === 'desc') return av < bv ? 1 : av > bv ? -1 : 0
      return av > bv ? 1 : av < bv ? -1 : 0
    })

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 4 }}>
          Browse All Papers
        </h1>
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
          All research papers across Life Science, Physical Science, and Robotics & Mathematics.
        </p>
      </div>

      {/* Filter bar */}
      <div style={{
        display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center',
      }}>
        {/* Local search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            id="browse-search"
            type="text"
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            placeholder="Search titles, keywords, authors..."
            style={{
              width: '100%', height: 38,
              paddingLeft: 34, paddingRight: 12,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, outline: 'none',
            }}
          />
        </div>

        {/* Year filter */}
        <div style={{ position: 'relative' }}>
          <select
            id="year-filter"
            value={yearFilter}
            onChange={e => setYearFilter(e.target.value)}
            style={{
              height: 38, padding: '0 32px 0 12px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, outline: 'none',
              cursor: 'pointer', appearance: 'none',
            }}
          >
            {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <ChevronDown size={13} color="var(--text-muted)" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        </div>

        {/* Sort */}
        <div style={{ position: 'relative' }}>
          <select
            id="sort-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              height: 38, padding: '0 32px 0 12px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, outline: 'none',
              cursor: 'pointer', appearance: 'none',
            }}
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <ChevronDown size={13} color="var(--text-muted)" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        </div>

        {/* Count badge */}
        {!loading && (
          <span style={{ fontSize: 12.5, color: 'var(--text-muted)', whiteSpace: 'nowrap', paddingLeft: 4 }}>
            {displayed.length} {displayed.length === 1 ? 'result' : 'results'}
          </span>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <SkeletonGrid count={8} />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : displayed.length === 0 ? (
        <EmptyState
          title="No papers found"
          description={localSearch
            ? `No results for "${localSearch}". Try a different search term.`
            : 'No research papers have been uploaded yet. Check back later.'}
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 20,
        }}>
          {displayed.map(paper => (
            <PaperCard key={paper.id} paper={paper} onClick={() => onPaperClick(paper)} />
          ))}
        </div>
      )}
    </div>
  )
}
