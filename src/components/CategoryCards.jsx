import React from 'react'
import { FileText, FlaskConical, Atom, Cpu, ArrowUpRight, Binary } from 'lucide-react'

const CATEGORIES = [
  {
    id:    'life',
    label: 'Life Science',
    key:   'Life Science',
    icon:  FlaskConical,
    color: 'var(--life-science)',
    dim:   'var(--life-science-dim)',
    border:'rgba(16, 185, 129, 0.1)',
    desc:  'Biology, ecology, agriculture, and health sciences studies.',
  },
  {
    id:    'physical',
    label: 'Physical Science',
    key:   'Physical Science',
    icon:  Atom,
    color: 'var(--physical-science)',
    dim:   'var(--physical-science-dim)',
    border:'rgba(88, 86, 214, 0.1)',
    desc:  'Physics, chemistry, materials science, and environment studies.',
  },
  {
    id:    'robotics',
    label: 'Robotics',
    key:   'Robotics',
    icon:  Cpu,
    color: 'var(--robotics)',
    dim:   'var(--robotics-dim)',
    border:'rgba(255, 149, 0, 0.1)',
    desc:  'Embedded microcontrollers, autonomous machines, and automation.',
  },
  {
    id:    'math',
    label: 'Mathematics',
    key:   'Mathematics',
    icon:  Binary,
    color: 'var(--mathematics)',
    dim:   'var(--mathematics-dim)',
    border:'rgba(255, 59, 48, 0.1)',
    desc:  'Applied numerical computations, statistics, and mathematical modeling.',
  },
]

export default function CategoryCards({ counts = {}, onSelect }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 16,
    }}>
      {CATEGORIES.map(({ id, label, key, icon: Icon, color, dim, border, desc }) => {
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              textAlign: 'left',
              transition: 'all 0.2s var(--ease-out)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.15)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.06)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {/* Header Icon */}
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: dim,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={16} color={color} strokeWidth={2} />
            </div>

            {/* Title / Description */}
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontSize: 14.5, fontWeight: 600,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)',
                marginBottom: 4,
              }}>
                {label}
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {desc}
              </p>
            </div>

            {/* Action text link */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500, color: 'var(--accent-blue)', marginTop: 8 }}>
              <span>Browse category</span>
              <ArrowUpRight size={12} />
            </div>
          </button>
        )
      })}
    </div>
  )
}
