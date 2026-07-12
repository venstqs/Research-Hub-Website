import React, { useState } from 'react'
import {
  BookOpen, Search, X, Home, FlaskConical, Atom, Cpu, Grid, Bookmark,
  ChevronRight, Compass, ShieldCheck, Key, Lock, CheckCircle, Minimize2, Maximize2, Binary
} from 'lucide-react'

const NAV_LINKS = [
  { id: 'home',     label: 'Overview',              icon: Compass },
  { id: 'life',     label: 'Life Science',          icon: FlaskConical },
  { id: 'physical', label: 'Physical Science',      icon: Atom },
  { id: 'robotics', label: 'Robotics',              icon: Cpu },
  { id: 'math',     label: 'Mathematics',           icon: Binary },
  { id: 'browse',   label: 'Research Catalog',      icon: Grid },
]

export default function Navbar({ activeTab, setActiveTab, searchQuery, setSearchQuery, program, setProgram, savedCount }) {
  const [lrnCode, setLrnCode] = useState('')
  const [accessGranted, setAccessGranted] = useState(false)
  const [isSidebarCompact, setIsSidebarCompact] = useState(false)

  const handleNav = (id) => {
    setActiveTab(id)
    setSearchQuery('')
  }

  const handleAccessCheck = (e) => {
    e.preventDefault()
    if (lrnCode.trim().length >= 5) {
      setAccessGranted(true)
    }
  }

  return (
    <aside style={{
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-default)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      width: isSidebarCompact ? 80 : 270,
      padding: isSidebarCompact ? '24px 10px' : '24px 18px',
      gap: 24,
      flexShrink: 0,
      transition: 'width 0.2s var(--ease-out), padding 0.2s var(--ease-out)',
    }} className="sidebar-container">
      
      {/* Brand Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: isSidebarCompact ? 'center' : 'space-between',
        gap: 12, 
        padding: '0 6px',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent-blue) 0%, #005BB5 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 113, 227, 0.2)',
            flexShrink: 0
          }}>
            <BookOpen size={18} color="white" strokeWidth={2.2} />
          </div>
          {!isSidebarCompact && (
            <div style={{ transition: 'opacity 0.2s' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', tracking: '-0.02em', fontFamily: 'var(--font-display)' }}>
                Research Hub
              </span>
              <span style={{ display: 'block', fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em', fontFamily: 'var(--font-body)' }}>
                STE & STEM DATABASE
              </span>
            </div>
          )}
        </div>

        {/* Dynamic Compact Toggle Button placed on the right side */}
        <button
          onClick={() => setIsSidebarCompact(!isSidebarCompact)}
          title={isSidebarCompact ? "Expand Sidebar" : "Collapse Sidebar"}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 4,
            borderRadius: '6px',
            transition: 'background 0.2s',
            alignSelf: 'center'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          {isSidebarCompact ? <Maximize2 size={15} /> : <Minimize2 size={15} />}
        </button>
      </div>

      {/* Program Selector Switch */}
      <div style={{
        display: isSidebarCompact ? 'none' : 'flex',
        background: 'rgba(0, 0, 0, 0.04)',
        borderRadius: '10px',
        padding: 3,
        gap: 2,
        transition: 'opacity 0.2s',
      }}>
        {['All', 'STE', 'STEM'].map(p => (
          <button
            key={p}
            onClick={() => setProgram(p)}
            style={{
              flex: 1,
              padding: '7px 0',
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
              color: program === p ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: program === p ? 'var(--bg-surface)' : 'transparent',
              boxShadow: program === p ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Navigation list */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {NAV_LINKS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id && !searchQuery
          return (
            <button
              key={id}
              onClick={() => handleNav(id)}
              title={isSidebarCompact ? label : undefined}
              style={{
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: isSidebarCompact ? 'center' : 'flex-start',
                gap: 12,
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: active ? 600 : 500,
                fontFamily: 'var(--font-body)',
                color: active ? 'var(--accent-blue)' : 'var(--text-secondary)',
                background: active ? 'var(--accent-blue-dim)' : 'transparent',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                width: '100%',
              }}
            >
              <Icon size={16} strokeWidth={2.2} color={active ? 'var(--accent-blue)' : 'var(--text-secondary)'} />
              {!isSidebarCompact && <span style={{ flex: 1 }}>{label}</span>}
              {!isSidebarCompact && <ChevronRight size={12} style={{ opacity: active ? 0.8 : 0.3, transform: active ? 'translateX(2px)' : 'none', transition: 'all 0.2s' }} />}
            </button>
          )
        })}

        <button
          onClick={() => handleNav('saved')}
          title={isSidebarCompact ? "Bookmarks" : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isSidebarCompact ? 'center' : 'flex-start',
            gap: 12,
            padding: '10px 14px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: activeTab === 'saved' ? 600 : 500,
            fontFamily: 'var(--font-body)',
            color: activeTab === 'saved' ? 'var(--accent-blue)' : 'var(--text-secondary)',
            background: activeTab === 'saved' ? 'var(--accent-blue-dim)' : 'transparent',
            textAlign: 'left',
            transition: 'all 0.15s ease',
            width: '100%',
            marginTop: 8,
          }}
        >
          <Bookmark size={16} strokeWidth={2.2} color={activeTab === 'saved' ? 'var(--accent-blue)' : 'var(--text-secondary)'} />
          {!isSidebarCompact && <span style={{ flex: 1 }}>Bookmarks</span>}
          {!isSidebarCompact && savedCount > 0 && (
            <span style={{
              background: activeTab === 'saved' ? 'var(--bg-surface)' : 'rgba(0, 0, 0, 0.05)',
              color: activeTab === 'saved' ? 'var(--accent-blue)' : 'var(--text-secondary)',
              fontSize: 11,
              fontWeight: 600,
              padding: '1px 6px',
              borderRadius: '6px',
            }}>
              {savedCount}
            </span>
          )}
        </button>
      </nav>

      {/* LRN / Access Verification Form */}
      <div style={{
        display: isSidebarCompact ? 'none' : 'flex',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: '16px',
        padding: '16px',
        flexDirection: 'column',
        gap: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {accessGranted ? (
            <CheckCircle size={15} color="var(--life-science)" />
          ) : (
            <Lock size={15} color="var(--text-muted)" />
          )}
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
            {accessGranted ? 'Access Unlocked' : 'Student Access'}
          </span>
        </div>
        
        {accessGranted ? (
          <p style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.45, fontFamily: 'var(--font-body)' }}>
            Student validation complete. Full research indexing authorized.
          </p>
        ) : (
          <form onSubmit={handleAccessCheck} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ fontSize: 11.5, color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', lineHeight: 1.4 }}>
              Enter LRN code:
            </p>
            <input
              type="text"
              placeholder="e.g. 123456789"
              value={lrnCode}
              onChange={e => setLrnCode(e.target.value)}
              style={{
                width: '100%',
                height: '32px',
                padding: '0 10px',
                borderRadius: '8px',
                border: '1px solid var(--border-default)',
                background: 'var(--bg-body)',
                fontSize: 12,
                outline: 'none',
                fontFamily: 'var(--font-body)',
              }}
            />
            <button
              type="submit"
              style={{
                width: '100%', height: '32px', fontSize: 12,
                background: 'var(--text-primary)', color: 'var(--bg-surface)',
                border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer',
                fontFamily: 'var(--font-body)',
              }}
            >
              Verify Code
            </button>
          </form>
        )}
      </div>

    </aside>
  )
}
