import React, { useState, useEffect } from 'react'
import { Bookmark, FileText } from 'lucide-react'
import PaperCard from '../components/PaperCard'
import { EmptyState } from '../components/States'

const STORAGE_KEY = 'research_hub_saved'

export function useSavedPapers() {
  const [saved, setSaved] = useState([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setSaved(JSON.parse(raw))
    } catch {}
  }, [])

  const save = (paper) => {
    setSaved(prev => {
      if (prev.some(p => p.id === paper.id)) return prev
      const next = [...prev, paper]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const remove = (id) => {
    setSaved(prev => {
      const next = prev.filter(p => p.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const isSaved = (id) => saved.some(p => p.id === id)

  return { saved, save, remove, isSaved }
}

export default function SavedView({ saved, onPaperClick, onBrowse }) {
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 4 }}>
          Saved Papers
        </h1>
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
          Papers you have bookmarked are stored locally on this device.
        </p>
      </div>

      {saved.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved papers"
          description="Bookmark research papers from any view by clicking the Save button in the paper details panel."
          action={onBrowse}
          actionLabel="Browse papers"
        />
      ) : (
        <>
          <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 20 }}>
            {saved.length} {saved.length === 1 ? 'paper' : 'papers'} saved
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 20,
          }}>
            {saved.map(paper => (
              <PaperCard key={paper.id} paper={paper} onClick={() => onPaperClick(paper)} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
