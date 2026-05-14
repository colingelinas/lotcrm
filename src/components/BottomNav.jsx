import { todayStr, tomorrowStr } from '../data/demo.js'

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: IconDashboard },
  { id: 'leads', label: 'Leads', icon: IconLeads },
  { id: 'followups', label: 'Follow-Ups', icon: IconClock },
  { id: 'metrics', label: 'Metrics', icon: IconMetrics },
  { id: 'profile', label: 'Profile', icon: IconProfile },
]

export default function BottomNav({ active, onChange, leads }) {
  const today = todayStr()
  const tomorrow = tomorrowStr()
  const urgentCount = leads.filter(l =>
    l.followUpDate && l.followUpDate <= tomorrow &&
    !['Sold', 'Lost'].includes(l.status)
  ).length

  return (
    <nav className="bottom-nav">
      {TABS.map(({ id, label, icon: Icon }) => {
        const badge = id === 'followups' && urgentCount > 0 ? urgentCount : null
        return (
          <button
            key={id}
            className={`nav-item ${active === id ? 'active' : ''}`}
            onClick={() => onChange(id)}
          >
            <div className="nav-icon-wrap">
              <Icon />
              {badge && <span className="nav-badge">{badge}</span>}
            </div>
            <span className="nav-label">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}

function IconDashboard() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}

function IconLeads() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      <path d="M21 20c0-3.1-2-5.7-4.7-6.7" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 15" />
    </svg>
  )
}

function IconMetrics() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  )
}

function IconProfile() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}
