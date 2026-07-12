import React, { useState, useEffect, useCallback } from 'react'
import { FlaskConical, Atom, Cpu, Binary } from 'lucide-react'
import PaperCard from '../components/PaperCard'
import { EmptyState, ErrorState, SkeletonGrid } from '../components/States'
import { fetchByCategory } from '../lib/api'

const CATEGORY_META = {
  life: {
    key:   'Life Science',
    label: 'Life Science',
    icon:  FlaskConical,
    color: 'var(--life-science)',
    dim:   'var(--life-science-dim)',
    border:'rgba(52,199,136,0.22)',
    desc:  'Biology, ecology, agriculture, biochemistry, and health sciences — exploring the living world.',
  },
  physical: {
    key:   'Physical Science',
    label: 'Physical Science',
    icon:  Atom,
    color: 'var(--physical-science)',
    dim:   'var(--physical-science-dim)',
    border:'rgba(77,168,218,0.22)',
    desc:  'Physics, chemistry, materials science, and environmental science investigations.',
  },
  robotics: {
    key:   'Robotics',
    label: 'Robotics',
    icon:  Cpu,
    color: 'var(--robotics)',
    dim:   'var(--robotics-dim)',
    border:'rgba(255,149,0,0.22)',
    desc:  'Embedded microcontrollers, autonomous machines, automation, and hardware engineering.',
  },
  math: {
    key:   'Mathematics',
    label: 'Mathematics',
    icon:  Binary,
    color: 'var(--mathematics)',
    dim:   'var(--mathematics-dim)',
    border:'rgba(255,59,48,0.22)',
    desc:  'Applied numerical computations, statistics, algorithms, and mathematical modeling.',
  },
}

export default function CategoryView({ categoryId, program, onPaperClick }) {
  const meta = CATEGORY_META[categoryId]
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)
  const [programFilter, setProgramFilter] = useState(program || 'All')

  const load = useCallback(async () => {
    if (!meta) return
    setLoading(true)
    setError(null)
    try {
      let data = await fetchByCategory(meta.key, 60)
      if (programFilter !== 'All') {
        data = data.filter(p => p.program === programFilter)
      }
      setPapers(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [meta, programFilter])

  useEffect(() => { load() }, [load])

  if (!meta) return null

  const Icon = meta.icon

  return (
    <div className="animate-fade-in">
      {/* Category header */}
      <div style={{
        padding: '28px 32px',
        background: 'var(--bg-surface)',
        border: `1px solid ${meta.border}`,
        borderRadius: 'var(--radius-xl)',
        marginBottom: 32,
        display: 'flex', alignItems: 'flex-start', gap: 20,
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: meta.dim,
          border: `1px solid ${meta.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={26} color={meta.color} strokeWidth={1.8} />
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 26, color: 'var(--text-primary)',
            marginBottom: 6, lineHeight: 1.2,
          }}>
            {meta.label}
          </h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 560, marginBottom: 16 }}>
            {meta.desc}
          </p>
          {/* Program filter pills */}
          <div style={{ display: 'flex', gap: 6 }}>
            {['All', 'STE', 'STEM'].map(p => (
              <button
                key={p}
                id={`category-program-${p.toLowerCase()}`}
                onClick={() => setProgramFilter(p)}
                style={{
                  padding: '5px 14px', borderRadius: 7,
                  border: `1px solid ${programFilter === p ? meta.border : 'var(--border-default)'}`,
                  background: programFilter === p ? meta.dim : 'var(--bg-elevated)',
                  color: programFilter === p ? meta.color : 'var(--text-secondary)',
                  fontSize: 12.5, fontWeight: programFilter === p ? 600 : 400,
                  cursor: 'pointer', transition: 'all 0.15s ease',
                }}
              >
                {p === 'All' ? 'All Programs' : p === 'STE' ? 'JHS STE' : 'SHS STEM'}
              </button>
            ))}
            {!loading && (
              <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center', marginLeft: 6 }}>
                {papers.length} {papers.length === 1 ? 'paper' : 'papers'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Papers grid */}
      {loading ? (
        <SkeletonGrid count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : papers.length === 0 ? (
        <EmptyState
          title={`No ${meta.label} papers yet`}
          description="Papers in this category will appear here once they are uploaded to the repository."
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 20,
        }}>
          {papers.map(paper => (
            <PaperCard key={paper.id} paper={paper} onClick={() => onPaperClick(paper)} />
          ))}
        </div>
      )}
    </div>
  )
}
