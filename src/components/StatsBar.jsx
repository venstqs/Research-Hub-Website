import React from 'react'
import { FileText, Users, Award, ShieldAlert } from 'lucide-react'

export default function StatsBar({ stats, loading }) {
  const STATS_CARDS = [
    { key: 'total',  label: 'Total Papers',   icon: FileText,    color: 'var(--accent-blue)',      dim: 'var(--accent-blue-dim)' },
    { key: 'ste',    label: 'JHS STE program',  icon: Users,       color: 'var(--life-science)',     dim: 'var(--life-science-dim)' },
    { key: 'stem',   label: 'SHS STEM program', icon: ShieldAlert, color: 'var(--physical-science)', dim: 'var(--physical-science-dim)' },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: 16,
    }}>
      {STATS_CARDS.map(({ key, label, icon: Icon, color, dim }) => (
        <div
          className="panel-card"
          key={key}
          style={{
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            boxShadow: 'none', /* Flat design */
            background: 'var(--bg-surface)',
          }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: dim,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon size={18} color={color} strokeWidth={2} />
          </div>
          <div>
            {loading ? (
              <div className="skeleton" style={{ height: 24, width: 48, borderRadius: 4 }} />
            ) : (
              <h3 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.1, fontFamily: 'var(--font-display)' }}>
                {stats?.[key] ?? 0}
              </h3>
            )}
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 400, marginTop: 2 }}>
              {label}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
