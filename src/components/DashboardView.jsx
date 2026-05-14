import { useState, useEffect } from 'react'
import LeadListItem from './LeadListItem.jsx'
import { todayStr, tomorrowStr } from '../data/demo.js'
import { getMonthCommission, getWeekdaysInMonth, getWeekdaysElapsed, getBestMonth, maybeUpdateBest } from '../data/commission.js'
import { readStreak } from '../data/streak.js'

function fmtNum(n) { return Math.round(n).toLocaleString('en-US') }

export default function DashboardView({ leads, openView, openNew, goToFollowUps, goToLeads }) {
  const today = todayStr()
  const tomorrow = tomorrowStr()

  // Commission
  const commission = getMonthCommission(leads)
  const wdTotal    = getWeekdaysInMonth()
  const wdElapsed  = getWeekdaysElapsed()
  const pace       = wdElapsed > 0 ? Math.round(commission / wdElapsed * wdTotal) : 0
  const [bestMonth, setBestMonth] = useState(getBestMonth)
  const isNewBest  = commission > 0 && commission >= bestMonth
  useEffect(() => { setBestMonth(maybeUpdateBest(commission)) }, [commission])

  // Streak
  const [streak, setStreak] = useState(0)
  useEffect(() => { setStreak(readStreak()) }, [])

  const overdue = leads.filter(l =>
    l.followUpDate && l.followUpDate < today && !['Sold', 'Lost'].includes(l.status)
  )
  const todayLeads = leads.filter(l =>
    l.followUpDate === today && !['Sold', 'Lost'].includes(l.status)
  )
  const tomorrowLeads = leads.filter(l =>
    l.followUpDate === tomorrow && !['Sold', 'Lost'].includes(l.status)
  )
  const urgentCount = overdue.length + todayLeads.length + tomorrowLeads.length
  const allClear = urgentCount === 0

  const stats = [
    { label: 'Active', value: leads.filter(l => !['Sold', 'Lost'].includes(l.status)).length, color: '#4a9eff' },
    { label: 'Overdue', value: overdue.length, color: overdue.length > 0 ? '#e53e3e' : '#8b949e' },
    { label: 'Today', value: todayLeads.length, color: '#4a9eff' },
    { label: 'Sold', value: leads.filter(l => l.status === 'Sold').length, color: '#4a9eff' },
  ]

  const nextUp = [...overdue, ...todayLeads, ...tomorrowLeads]
    .sort((a, b) => (a.followUpTime || '').localeCompare(b.followUpTime || ''))
    .slice(0, 6)

  const dateLabel = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <span className="logo">LotCRM</span>
        <div className="page-header-right">
          <span className="page-date">{dateLabel}</span>
          <button className="btn-icon" onClick={() => openNew()} title="New lead">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="hero-section">
        <div
          className={`hero-count${overdue.length > 0 ? ' hero-count--overdue' : ''}`}
          style={{
            color: urgentCount === 0
              ? '#484f58'
              : overdue.length > 0
                ? '#e53e3e'
                : 'var(--text)',
          }}
        >
          {urgentCount}
        </div>
        {streak > 0 && (
          <div className="hero-streak">🔥 {streak} day streak</div>
        )}
        <div className="hero-sub">
          {allClear ? 'No follow-ups due today' : (
            <>
              {overdue.length > 0 && <span style={{ color: '#e53e3e' }}>{overdue.length} overdue</span>}
              {overdue.length > 0 && todayLeads.length > 0 && ' · '}
              {todayLeads.length > 0 && `${todayLeads.length} today`}
              {(overdue.length > 0 || todayLeads.length > 0) && tomorrowLeads.length > 0 && ' · '}
              {tomorrowLeads.length > 0 && `${tomorrowLeads.length} tomorrow`}
            </>
          )}
        </div>
      </div>

      <div className="dashboard-body">
        {/* CTA */}
        <button
          className="cta-btn"
          onClick={allClear ? goToLeads : () => goToFollowUps([...overdue, ...todayLeads])}
        >
          {allClear ? 'VIEW ALL LEADS' : 'START FOLLOW-UPS'}
        </button>

        {/* Commission block — only renders when there's earned commission */}
        {commission > 0 && (
          <div className="commission-block">
            <div className="commission-amount">$ {fmtNum(commission)}</div>
            <div className="commission-pace">On pace for ${fmtNum(pace)} this month</div>
            {wdElapsed >= 10 && (
              isNewBest
                ? <div className="commission-best commission-best--hot">ON PACE FOR YOUR BEST MONTH</div>
                : bestMonth > 0 && <div className="commission-best">Best month: ${fmtNum(bestMonth)} — ${fmtNum(bestMonth - commission)} away</div>
            )}
          </div>
        )}

        {/* Mini stats */}
        <div className="stats-row">
          {stats.map(s => (
            <div key={s.label} className="stat-tile">
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Next Up */}
        {nextUp.length > 0 && (
          <div className="section-block">
            <div className="section-header section-header--minor">Next Up</div>
            {nextUp.map(lead => (
              <LeadListItem key={lead.id} lead={lead} onClick={() => openView(lead)} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
