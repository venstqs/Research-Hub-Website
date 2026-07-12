import React, { useEffect, useState } from 'react'
import {
  X, ExternalLink, Bookmark, BookmarkCheck,
  Users, Calendar, Award, FileText, Tag, Eye, Copy, Check
} from 'lucide-react'
import { getPdfUrl } from '../lib/supabaseClient'
import { incrementViews } from '../lib/api'

const CATEGORY_STYLE = {
  'Life Science':          { color: 'var(--life-science)',     bg: 'var(--life-science-dim)' },
  'Physical Science':      { color: 'var(--physical-science)', bg: 'var(--physical-science-dim)' },
  'Robotics':              { color: 'var(--robotics)',         bg: 'var(--robotics-dim)' },
  'Mathematics':           { color: 'var(--mathematics)',      bg: 'var(--mathematics-dim)' },
}

function generateAPA(paper) {
  const year = paper.year || 'n.d.'
  const authors = Array.isArray(paper.authors)
    ? paper.authors.map(a => {
        const parts = a.trim().split(' ')
        const lastName = parts[parts.length - 1]
        const initials = parts.slice(0, -1).map(n => n[0] + '.').join(' ')
        return `${lastName}, ${initials}`
      }).join(', ')
    : paper.authors || 'Unknown'
  return `${authors} (${year}). ${paper.title}. School Research Hub.`
}

export default function PaperModal({ paper, onClose, isSaved, onSave, onRemove }) {
  const [copied, setCopied] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)

  useEffect(() => {
    if (!paper) return
    document.body.style.overflow = 'hidden'
    incrementViews(paper.id).catch(() => {}) // non-blocking
    return () => { document.body.style.overflow = '' }
  }, [paper])

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!paper) return null

  const cat = CATEGORY_STYLE[paper.category] || { color: 'var(--gold)', bg: 'var(--gold-dim)' }
  const pdfUrl = getPdfUrl(paper.pdf_url)
  const apa = generateAPA(paper)

  const handleCopyCitation = async () => {
    try {
      await navigator.clipboard.writeText(apa)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback — select text
    }
  }

  return (
    <div
      id="paper-modal-overlay"
      className="animate-fade-in"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(10, 14, 26, 0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        id="paper-modal"
        className="animate-scale-in"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 680,
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          overflow: 'hidden',
          maxHeight: '90vh',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Category stripe */}
        <div style={{ height: 4, background: cat.color }} />

        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '3px 8px',
              borderRadius: 5, color: cat.color, background: cat.bg,
            }}>
              {paper.category}
            </span>
            {paper.program && (
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 5,
                color: paper.program === 'STE' ? '#60A5FA' : '#A78BFA',
                background: paper.program === 'STE' ? 'rgba(96,165,250,0.10)' : 'rgba(167,139,250,0.10)',
              }}>
                {paper.program === 'STE' ? 'JHS STE' : 'SHS STEM'}
              </span>
            )}
            {paper.year && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                <Calendar size={11} strokeWidth={1.8} />
                {paper.year}
              </span>
            )}
            {paper.views > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                <Eye size={11} strokeWidth={1.8} />
                {paper.views.toLocaleString()} views
              </span>
            )}
          </div>
          <button
            id="modal-close"
            onClick={onClose}
            style={{
              flexShrink: 0,
              width: 30, height: 30,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 8,
              cursor: 'pointer',
              color: 'var(--text-muted)',
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '24px' }}>

          {/* Award */}
          {paper.award && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 14px', borderRadius: 8,
              background: 'var(--gold-dim)',
              border: '1px solid rgba(201,168,76,0.20)',
              marginBottom: 20,
            }}>
              <Award size={14} color="var(--gold)" strokeWidth={2} />
              <span style={{ fontSize: 12.5, color: 'var(--gold-light)', fontWeight: 500 }}>
                {paper.award}
              </span>
            </div>
          )}

          {/* Title */}
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            lineHeight: 1.35,
            color: 'var(--text-primary)',
            marginBottom: 16,
          }}>
            {paper.title}
          </h2>

          {/* Authors */}
          {Array.isArray(paper.authors) && paper.authors.length > 0 && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '12px 14px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 10, marginBottom: 20,
            }}>
              <Users size={14} color="var(--text-muted)" strokeWidth={1.8} style={{ marginTop: 2, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 4 }}>
                  Authors
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {paper.authors.join(' · ')}
                </p>
              </div>
            </div>
          )}

          {/* Abstract */}
          {paper.abstract && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>
                Abstract
              </p>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {paper.abstract}
              </p>
            </div>
          )}

          {/* Keywords */}
          {Array.isArray(paper.keywords) && paper.keywords.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>
                Keywords
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {paper.keywords.map((kw, i) => (
                  <span
                    key={i}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      padding: '4px 10px', borderRadius: 6,
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-default)',
                      fontSize: 12, color: 'var(--text-secondary)',
                    }}
                  >
                    <Tag size={10} strokeWidth={1.8} color="var(--text-muted)" />
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* APA Citation */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 10,
            overflow: 'hidden',
            marginBottom: 24,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 14px',
              borderBottom: '1px solid var(--border-subtle)',
            }}>
              <p style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                APA Citation
              </p>
              <button
                id="copy-citation"
                onClick={handleCopyCitation}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '4px 10px', borderRadius: 6,
                  background: copied ? 'rgba(52,199,136,0.10)' : 'var(--bg-elevated)',
                  border: `1px solid ${copied ? 'rgba(52,199,136,0.25)' : 'var(--border-default)'}`,
                  cursor: 'pointer',
                  fontSize: 11.5, fontWeight: 500,
                  color: copied ? 'var(--life-science)' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                {copied ? <Check size={11} strokeWidth={2.5} /> : <Copy size={11} strokeWidth={1.8} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p style={{ padding: '12px 14px', fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>
              {apa}
            </p>
          </div>

          {/* Embedded Google Drive PDF Viewer Frame */}
          {pdfUrl && (pdfUrl.includes('drive.google.com') || pdfUrl.includes('docs.google.com')) && (
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>
                Research Document Preview
              </p>
              <div style={{
                width: '100%',
                height: '420px',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid var(--border-default)',
                background: '#FFFFFF'
              }}>
                <iframe
                  src={
                    pdfUrl.includes('/view')
                      ? pdfUrl.replace('/view', '/preview')
                      : pdfUrl.includes('id=')
                        ? `https://drive.google.com/file/d/${pdfUrl.split('id=')[1]}/preview`
                        : pdfUrl
                  }
                  width="100%"
                  height="100%"
                  allow="autoplay"
                  style={{ border: 'none' }}
                  title="Google Drive PDF Document Viewer"
                />
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex', gap: 10,
          background: 'var(--bg-elevated)',
        }}>
          {pdfUrl ? (
            <a
              id="open-pdf"
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '11px 20px',
                borderRadius: 10,
                background: cat.color,
                color: '#0A0E1A',
                fontWeight: 600, fontSize: 13.5,
                textDecoration: 'none',
                transition: 'opacity 0.15s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <FileText size={15} strokeWidth={2.2} />
              Open PDF
              <ExternalLink size={13} strokeWidth={2} />
            </a>
          ) : (
            <div style={{
              flex: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '11px 20px', borderRadius: 10,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-muted)', fontSize: 13.5,
            }}>
              <FileText size={15} strokeWidth={1.8} />
              No PDF attached
            </div>
          )}

          <button
            id={isSaved ? 'remove-bookmark' : 'add-bookmark'}
            onClick={() => isSaved ? onRemove(paper.id) : onSave(paper)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '11px 16px', borderRadius: 10,
              border: `1px solid ${isSaved ? 'rgba(201,168,76,0.30)' : 'var(--border-default)'}`,
              background: isSaved ? 'var(--gold-dim)' : 'var(--bg-surface)',
              color: isSaved ? 'var(--gold-light)' : 'var(--text-secondary)',
              cursor: 'pointer', fontSize: 13, fontWeight: 500,
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {isSaved
              ? <><BookmarkCheck size={15} strokeWidth={2} /> Saved</>
              : <><Bookmark size={15} strokeWidth={1.8} /> Save</>
            }
          </button>
        </div>

      </div>
    </div>
  )
}
