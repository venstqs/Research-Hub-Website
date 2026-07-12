import React, { useState, useMemo } from 'react'
import Navbar from './components/Navbar'
import PaperModal from './components/PaperModal'
import HomeView from './views/HomeView'
import CategoryView from './views/CategoryView'
import BrowseView from './views/BrowseView'
import SearchView from './views/SearchView'
import SavedView, { useSavedPapers } from './views/SavedView'
import { Search, Bell, User, X, BookOpen, Compass, FlaskConical, Atom, Cpu, Bookmark, Grid } from 'lucide-react'

const CATEGORY_TABS = ['life', 'physical', 'robotics', 'math']

export default function App() {
  const [activeTab, setActiveTab]   = useState('home')
  const [program, setProgram]       = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPaper, setSelectedPaper] = useState(null)

  const { saved, save, remove, isSaved } = useSavedPapers()

  const activeView = useMemo(() => {
    if (searchQuery.trim()) return 'search'
    return activeTab
  }, [searchQuery, activeTab])

  const handleOpenPaper = (paper) => setSelectedPaper(paper)
  const handleCloseModal = () => setSelectedPaper(null)

  const handleNavTab = (tab) => {
    setActiveTab(tab)
    setSearchQuery('')
  }

  return (
    <div className="dashboard-layout" style={{ transition: 'grid-template-columns 0.2s var(--ease-out)' }}>
      {/* Side Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        program={program}
        setProgram={setProgram}
        savedCount={saved.length}
      />

      {/* Mobile Sticky Header */}
      <header className="mobile-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '6px',
            background: 'linear-gradient(135deg, var(--accent-blue) 0%, #005BB5 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BookOpen size={14} color="white" />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Research Hub
          </span>
        </div>
        
        {/* Simple program selector for mobile header */}
        <div style={{
          display: 'flex',
          background: 'rgba(0, 0, 0, 0.05)',
          borderRadius: '6px',
          padding: 2,
        }}>
          {['STE', 'STEM'].map(p => (
            <button
              key={p}
              onClick={() => setProgram(program === p ? 'All' : p)}
              style={{
                padding: '3px 8px',
                borderRadius: '4px',
                border: 'none',
                fontSize: 10.5,
                fontWeight: 700,
                color: program === p ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: program === p ? 'var(--bg-surface)' : 'transparent',
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </header>

      {/* Main Panel Content Area */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowX: 'hidden' }}>
        
        {/* Top Control Bar with search and user controls (Desktop Only) */}
        <header className="top-header-desktop" style={{
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-default)',
          height: 64,
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 90,
        }}>
          {/* Main search bar */}
          <div style={{ position: 'relative', width: 320 }}>
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search paper titles, keywords..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: 38,
                paddingLeft: 36,
                paddingRight: searchQuery ? 30 : 12,
                borderRadius: '20px',
                border: '1px solid var(--border-default)',
                background: 'var(--bg-body)',
                fontSize: 13,
                outline: 'none',
                transition: 'all 0.15s ease',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--text-primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* User profile controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'var(--bg-body)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 600, fontSize: 13, color: 'var(--text-primary)',
              }}>
                <User size={15} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Student Portal</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Research Hub</span>
              </div>
            </div>
          </div>
        </header>

        {/* View content panel */}
        <main style={{
          flex: 1,
          padding: '32px 32px 64px',
          maxWidth: 1200,
          width: '100%',
          margin: '0 auto',
        }}>
          {activeView === 'search' && (
            <SearchView
              query={searchQuery}
              program={program}
              onPaperClick={handleOpenPaper}
            />
          )}

          {activeView === 'home' && (
            <HomeView
              program={program}
              onPaperClick={handleOpenPaper}
              onCategorySelect={handleNavTab}
              onBrowseAll={() => handleNavTab('browse')}
            />
          )}

          {CATEGORY_TABS.includes(activeView) && (
            <CategoryView
              categoryId={activeView}
              program={program}
              onPaperClick={handleOpenPaper}
            />
          )}

          {activeView === 'browse' && (
            <BrowseView
              program={program}
              onPaperClick={handleOpenPaper}
            />
          )}

          {activeView === 'saved' && (
            <SavedView
              saved={saved}
              onPaperClick={handleOpenPaper}
              onBrowse={() => handleNavTab('browse')}
            />
          )}
        </main>
      </div>

      {/* Mobile Sticky Navigation Bar */}
      <nav className="mobile-nav-bar">
        <button
          onClick={() => handleNavTab('home')}
          style={{
            background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: activeTab === 'home' ? 'var(--accent-blue)' : 'var(--text-secondary)', fontSize: 10, fontWeight: 600, cursor: 'pointer'
          }}
        >
          <Compass size={18} />
          <span>Overview</span>
        </button>
        <button
          onClick={() => handleNavTab('browse')}
          style={{
            background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: activeTab === 'browse' ? 'var(--accent-blue)' : 'var(--text-secondary)', fontSize: 10, fontWeight: 600, cursor: 'pointer'
          }}
        >
          <Grid size={18} />
          <span>Catalog</span>
        </button>
        <button
          onClick={() => handleNavTab('saved')}
          style={{
            background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: activeTab === 'saved' ? 'var(--accent-blue)' : 'var(--text-secondary)', fontSize: 10, fontWeight: 600, cursor: 'pointer'
          }}
        >
          <Bookmark size={18} />
          <span>Bookmarks</span>
        </button>
      </nav>

      {/* Paper Modal detail popup */}
      <PaperModal
        paper={selectedPaper}
        onClose={handleCloseModal}
        isSaved={selectedPaper ? isSaved(selectedPaper.id) : false}
        onSave={save}
        onRemove={remove}
      />
    </div>
  )
}
