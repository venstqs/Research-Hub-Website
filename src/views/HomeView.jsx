import React, { useState, useEffect, useCallback } from 'react'
import { FileText, Award, ArrowUpRight, ShieldAlert, BookOpen } from 'lucide-react'
import StatsBar from '../components/StatsBar'
import CategoryCards from '../components/CategoryCards'
import PaperCard from '../components/PaperCard'
import { SkeletonGrid, EmptyState, ErrorState } from '../components/States'
import { fetchStats, fetchTrending, fetchAwardWinners } from '../lib/api'

export default function HomeView({ program, onPaperClick, onCategorySelect, onBrowseAll }) {
  const [stats, setStats]         = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [trending, setTrending]   = useState([])
  const [trendLoading, setTrendLoading] = useState(true)
  const [awards, setAwards]       = useState([])
  const [awardsLoading, setAwardsLoading] = useState(true)
  const [error, setError]         = useState(null)

  const loadAll = useCallback(async () => {
    setError(null)
    try {
      const [s, t, a] = await Promise.all([
        fetchStats().finally(() => setStatsLoading(false)),
        fetchTrending(6).finally(() => setTrendLoading(false)),
        fetchAwardWinners(6).finally(() => setAwardsLoading(false)),
      ])
      setStats(s)
      setTrending(program === 'All' ? t : t.filter(p => p.program === program))
      setAwards(program === 'All' ? a : a.filter(p => p.program === program))
    } catch (e) {
      setError(e.message)
    }
  }, [program])

  useEffect(() => { loadAll() }, [loadAll])

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      
      {/* Title & Page Header */}
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', tracking: '-0.02em', fontFamily: 'var(--font-display)', marginBottom: 4 }}>
          Research Hub Papers
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
          High school academic research repository and publication catalog.
        </p>
      </div>

      {/* Stats row */}
      <StatsBar stats={stats} loading={statsLoading} />

      {/* Main dashboard columns structure */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 24,
      }} className="home-dashboard-grid">
        
        {/* Left Column: Categories and Trending Papers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          
          {/* Categories */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'var(--font-body)' }}>
                Disciplines
              </h2>
            </div>
            <CategoryCards counts={{}} onSelect={onCategorySelect} />
          </div>

          {/* Trending list */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'var(--font-body)' }}>
                Featured Publications
              </h2>
              <button
                onClick={onBrowseAll}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-body)' }}
              >
                <span>Browse Catalog</span>
                <ArrowUpRight size={14} />
              </button>
            </div>

            {trendLoading ? (
              <SkeletonGrid count={3} />
            ) : error ? (
              <ErrorState message={error} onRetry={loadAll} />
            ) : trending.length === 0 ? (
              <EmptyState title="No publications found" description="Publications will appear here once loaded." />
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: 16,
              }}>
                {trending.map(paper => (
                  <PaperCard key={paper.id} paper={paper} onClick={() => onPaperClick(paper)} />
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Awards & Information */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Award/Recognition Panel */}
          <div className="panel-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'var(--font-body)' }}>
              Awards & Citations
            </h2>
            
            {awardsLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 50, borderRadius: 8 }} />)}
              </div>
            ) : awards.length === 0 ? (
              <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>No awards listed.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {awards.slice(0, 4).map(paper => (
                  <div
                    key={paper.id}
                    onClick={() => onPaperClick(paper)}
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      background: 'var(--bg-body)',
                      cursor: 'pointer',
                      border: '1px solid var(--border-default)',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--text-primary)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
                  >
                    <span className="custom-badge badge-gold" style={{ fontSize: 9, padding: '2px 8px', marginBottom: 6 }}>
                      {paper.award}
                    </span>
                    <h4 style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontFamily: 'var(--font-body)', lineHeight: 1.4 }}>
                      {paper.title}
                    </h4>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scope classifications */}
          <div className="panel-card" style={{ padding: 20, background: 'var(--bg-surface)' }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12, fontFamily: 'var(--font-body)' }}>
              Classifications
            </h3>
            <ul style={{ paddingLeft: 0, listStyle: 'none', fontSize: 12.5, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 10, fontFamily: 'var(--font-body)' }}>
              <li style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--life-science)', marginTop: 6 }} />
                <span><strong style={{ color: 'var(--text-primary)' }}>Life Science:</strong> Ecological & botanical sciences</span>
              </li>
              <li style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--physical-science)', marginTop: 6 }} />
                <span><strong style={{ color: 'var(--text-primary)' }}>Physical Science:</strong> Chemistry & physical innovations</span>
              </li>
              <li style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--robotics)', marginTop: 6 }} />
                <span><strong style={{ color: 'var(--text-primary)' }}>Robotics:</strong> Embedded hardware designs, machinery & automation</span>
              </li>
              <li style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--mathematics)', marginTop: 6 }} />
                <span><strong style={{ color: 'var(--text-primary)' }}>Mathematics:</strong> Applied computations, numerical algorithms & statistical models</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .home-dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
