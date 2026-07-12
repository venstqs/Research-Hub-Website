import React, { useState, useEffect, useCallback } from 'react'
import { Search } from 'lucide-react'
import PaperCard from '../components/PaperCard'
import { SkeletonGrid, EmptyState, ErrorState } from '../components/States'
import { fetchPapers } from '../lib/api'

export default function SearchView({ query, program, onPaperClick }) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const load = useCallback(async () => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchPapers({
        search: query,
        program: program !== 'All' ? program : undefined,
        limit: 40,
      })
      setResults(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [query, program])

  useEffect(() => { load() }, [load])

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Search size={16} color="var(--text-muted)" strokeWidth={1.8} />
          <h1 style={{ fontSize: 18, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Results for <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>"{query}"</em>
          </h1>
        </div>
        {!loading && !error && (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 24 }}>
            {results.length} {results.length === 1 ? 'paper' : 'papers'} found
          </p>
        )}
      </div>

      {loading ? (
        <SkeletonGrid count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : results.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No results found"
          description={`We could not find any papers matching "${query}". Try searching for a different title, author name, or keyword.`}
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 20,
        }}>
          {results.map(paper => (
            <PaperCard key={paper.id} paper={paper} onClick={() => onPaperClick(paper)} />
          ))}
        </div>
      )}
    </div>
  )
}
