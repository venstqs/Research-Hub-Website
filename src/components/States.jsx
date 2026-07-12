import React from 'react'
import { FileText, AlertCircle, RefreshCw } from 'lucide-react'

export function EmptyState({ title, description, icon: Icon = FileText, action, actionLabel }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center',
      padding: '64px 24px',
      border: '1px dashed var(--border-default)',
      borderRadius: 'var(--radius-xl)',
      background: 'var(--bg-surface)',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-default)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 16,
      }}>
        <Icon size={24} color="var(--text-muted)" strokeWidth={1.5} />
      </div>
      <h3 style={{
        fontSize: 16, fontWeight: 600,
        color: 'var(--text-primary)',
        marginBottom: 6,
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: 13.5, color: 'var(--text-secondary)',
        lineHeight: 1.6, maxWidth: 360, marginBottom: action ? 20 : 0,
      }}>
        {description}
      </p>
      {action && (
        <button
          onClick={action}
          style={{
            padding: '9px 20px', borderRadius: 8,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-strong)',
            color: 'var(--text-primary)',
            fontSize: 13, fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center',
      padding: '48px 24px',
      border: '1px solid rgba(239,68,68,0.20)',
      borderRadius: 'var(--radius-xl)',
      background: 'rgba(239,68,68,0.04)',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: 'rgba(239,68,68,0.10)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 14,
      }}>
        <AlertCircle size={22} color="#F87171" strokeWidth={1.8} />
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
        Something went wrong
      </h3>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 320, marginBottom: 18 }}>
        {message || 'Failed to load data. Check your connection or Supabase configuration.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 18px', borderRadius: 8,
            background: 'var(--bg-elevated)',
            border: '1px solid rgba(239,68,68,0.30)',
            color: '#F87171',
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}
        >
          <RefreshCw size={13} strokeWidth={2} />
          Retry
        </button>
      )}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ height: 3 }} className="skeleton" />
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <div className="skeleton" style={{ height: 22, width: 90, borderRadius: 5 }} />
          <div className="skeleton" style={{ height: 22, width: 60, borderRadius: 5 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className="skeleton" style={{ height: 16, width: '100%', borderRadius: 4 }} />
          <div className="skeleton" style={{ height: 16, width: '85%', borderRadius: 4 }} />
          <div className="skeleton" style={{ height: 16, width: '60%', borderRadius: 4 }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <div className="skeleton" style={{ height: 13, width: 130, borderRadius: 4 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="skeleton" style={{ height: 12, width: 60, borderRadius: 4 }} />
          <div className="skeleton" style={{ height: 12, width: 50, borderRadius: 4 }} />
        </div>
      </div>
      <div style={{ padding: '10px 20px 14px', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="skeleton" style={{ height: 12, width: 80, borderRadius: 4 }} />
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: 20,
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
