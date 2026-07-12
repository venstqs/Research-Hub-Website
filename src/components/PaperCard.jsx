import React from 'react'
import { FileText, Users, Calendar, Award, Eye } from 'lucide-react'
import { getPdfUrl } from '../lib/supabaseClient'

// Category accent config
const CATEGORY_STYLE = {
  'Life Science': { color: 'var(--life-science)', bg: 'var(--life-science-dim)', border: 'rgba(52,199,136,0.20)' },
  'Physical Science': { color: 'var(--physical-science)', bg: 'var(--physical-science-dim)', border: 'rgba(77,168,218,0.20)' },
  'Robotics': { color: 'var(--robotics)', bg: 'var(--robotics-dim)', border: 'rgba(255,149,0,0.20)' },
  'Mathematics': { color: 'var(--mathematics)', bg: 'var(--mathematics-dim)', border: 'rgba(255,59,48,0.20)' },
}

const PROGRAM_STYLE = {
  STE: { color: '#60A5FA', bg: 'rgba(96,165,250,0.10)', border: 'rgba(96,165,250,0.20)' },
  STEM: { color: '#A78BFA', bg: 'rgba(167,139,250,0.10)', border: 'rgba(167,139,250,0.20)' },
}

export default function PaperCard({ paper, onClick }) {
  const cat = CATEGORY_STYLE[paper.category] || { color: 'var(--gold)', bg: 'var(--gold-dim)', border: 'rgba(201,168,76,0.20)' }
  const prog = PROGRAM_STYLE[paper.program] || {}
  const pdfUrl = getPdfUrl(paper.pdf_url)

  const authors = Array.isArray(paper.authors) ? paper.authors : []
  const displayAuthors = authors.length > 2
    ? `${authors[0]}, ${authors[1]} +${authors.length - 2} more`
    : authors.join(', ')

  return (
    <article
      id={`paper-card-${paper.id}`}
      onClick={onClick}
      className="card-hover"
      style={{
        background: 'var(--bg-surface)',
        border: `1px solid var(--border-subtle)`,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = cat.border
        e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.35)`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: 3, background: cat.color, opacity: 0.7 }} />

      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>

        {/* Tags row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 10.5, fontWeight: 600,
            padding: '3px 8px', borderRadius: 5,
            border: `1px solid ${cat.border}`,
            color: cat.color, background: cat.bg,
            letterSpacing: '0.02em',
          }}>
            {paper.category}
          </span>
          {paper.program && (
            <span style={{
              fontSize: 10.5, fontWeight: 600,
              padding: '3px 8px', borderRadius: 5,
              border: `1px solid ${prog.border}`,
              color: prog.color, background: prog.bg,
            }}>
              JHS {paper.program === 'STE' ? 'STE' : 'SHS STEM'}
            </span>
          )}
          {paper.award && (
            <span style={{
              fontSize: 10.5, fontWeight: 600,
              padding: '3px 8px', borderRadius: 5,
              border: '1px solid rgba(201,168,76,0.25)',
              color: 'var(--gold-light)', background: 'var(--gold-dim)',
            }}>
              {paper.award}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 15,
          lineHeight: 1.4,
          color: 'var(--text-primary)',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1,
        }}>
          {paper.title}
        </h3>

        {/* Authors + Year */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {displayAuthors && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Users size={12} color="var(--text-muted)" strokeWidth={1.8} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                {displayAuthors}
              </span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Calendar size={11} color="var(--text-muted)" strokeWidth={1.8} />
              <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{paper.year || '—'}</span>
            </div>
            {paper.views > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Eye size={11} color="var(--text-muted)" strokeWidth={1.8} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{paper.views.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Footer action */}
      <div style={{
        padding: '10px 20px 14px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
          View details
        </span>
        {pdfUrl && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <FileText size={11} color={cat.color} strokeWidth={2} />
            <span style={{ fontSize: 11, color: cat.color, fontWeight: 600 }}>PDF available</span>
          </div>
        )}
      </div>

    </article>
  )
}
