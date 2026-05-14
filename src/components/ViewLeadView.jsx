import { useState } from 'react'
import { STATUS_COLORS, TEMP_COLORS } from '../data/demo.js'
import { BackIcon } from './icons.jsx'

const ACTIVITY_TYPES = ['Note', 'Call', 'Email', 'Text', 'Visit']
const TEMPS = ['Hot', 'Warm', 'Cold']

export default function ViewLeadView({ lead, onBack, onEdit, onAddActivity, onUpdateLead }) {
  const [activeTab, setActiveTab] = useState('details')
  const [activityType, setActivityType] = useState('Note')
  const [activityText, setActivityText] = useState('')
  const [tempOpen, setTempOpen] = useState(false)

  const statusColor = STATUS_COLORS[lead.status] || '#484f58'
  const tempColor = TEMP_COLORS[lead.temperature] || '#484f58'

  function handleLog() {
    if (!activityText.trim()) return
    onAddActivity(lead.id, { type: activityType, text: activityText })
    setActivityText('')
  }

  function handleTempChange(newTemp) {
    setTempOpen(false)
    if (newTemp === lead.temperature) return
    onAddActivity(lead.id, { type: 'Note', text: `Temperature updated: ${lead.temperature} → ${newTemp}` })
    onUpdateLead({ ...lead, temperature: newTemp })
  }

  function formatDate(iso) {
    if (!iso) return ''
    return new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
    })
  }

  const followUpDisplay = lead.followUpDate
    ? `${lead.followUpDate}${lead.followUpTime ? ' · ' + lead.followUpTime : ''}`
    : null

  return (
    <div className="view-screen">
      {/* Header */}
      <div className="form-screen-header">
        <button className="back-btn" onClick={onBack}>
          <BackIcon /> Back
        </button>
        <span className="form-screen-title">{lead.first} {lead.last}</span>
        <button className="header-save-btn" onClick={onEdit}>Edit</button>
      </div>

      {/* Hero */}
      <div className="lead-hero" style={{ borderTopColor: statusColor }}>
        <div className="lead-hero-top">
          <div className="lead-hero-name">
            {lead.first} {lead.last}
          </div>
          <span className="lead-hero-temp" style={{ color: tempColor }}>●</span>
        </div>
        <div className="lead-hero-badges">
          <span className="badge-pill" style={{ background: statusColor + '22', color: statusColor }}>
            {lead.status}
          </span>
          <div className="temp-popover-wrap">
            {tempOpen && <div className="temp-backdrop" onClick={() => setTempOpen(false)} />}
            <button
              className="badge-pill temp-badge-btn"
              style={{ background: tempColor + '22', color: tempColor }}
              onClick={() => setTempOpen(o => !o)}
            >
              {lead.temperature} ▾
            </button>
            {tempOpen && (
              <div className="temp-popover">
                {TEMPS.map(t => (
                  <button
                    key={t}
                    className={`temp-popover-opt${t === lead.temperature ? ' temp-popover-opt--active' : ''}`}
                    style={{ color: TEMP_COLORS[t] }}
                    onClick={() => handleTempChange(t)}
                  >
                    <span className="temp-popover-dot" style={{ background: TEMP_COLORS[t] }} />
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {lead.vehicle && (
          <div className="lead-hero-vehicle">{lead.vehicle}</div>
        )}
        {(lead.phone || lead.email) && (
          <div className="lead-hero-contact">
            {lead.phone && (
              <a href={`tel:${lead.phone}`} className="lead-contact-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7 12.8 12.8 0 00.7 2.8 2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5 12.8 12.8 0 002.8.7A2 2 0 0122 16.9z"/>
                </svg>
                {lead.phone}
              </a>
            )}
            {lead.email && (
              <a href={`mailto:${lead.email}`} className="lead-contact-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                {lead.email}
              </a>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="view-tabs">
        <button
          className={`view-tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
        <button
          className={`view-tab ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          Activity
          {lead.activityLog?.length > 0 && (
            <span className="view-tab-badge">{lead.activityLog.length}</span>
          )}
        </button>
      </div>

      {/* Body */}
      <div className="view-screen-body">
        {activeTab === 'details' && (
          <div className="detail-sections">
            <button className="view-edit-cta" onClick={onEdit}>EDIT LEAD</button>
            <DetailSection label="Vehicle">
              <DetailRow label="Vehicle" value={lead.vehicle} />
              <DetailRow label="Budget" value={lead.budget ? '$' + Number(lead.budget).toLocaleString() : null} />
              <DetailRow label="Trade-In" value={lead.tradeIn} />
              <DetailRow label="Financing" value={lead.financing ? 'Yes' : 'No'} />
            </DetailSection>

            <DetailSection label="Lead Info">
              <DetailRow label="Source" value={lead.source} />
              <DetailRow label="Status" value={lead.status} valueColor={statusColor} />
              <DetailRow label="Temperature" value={lead.temperature} valueColor={tempColor} />
            </DetailSection>

            <DetailSection label="Follow-Up">
              <DetailRow label="Scheduled" value={followUpDisplay} />
            </DetailSection>

            {lead.notes && (
              <DetailSection label="Notes">
                <p className="detail-notes">{lead.notes}</p>
              </DetailSection>
            )}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="activity-section">
            <div className="activity-add-row">
              <select
                className="activity-type-select"
                value={activityType}
                onChange={e => setActivityType(e.target.value)}
              >
                {ACTIVITY_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
              <input
                className="activity-input"
                value={activityText}
                onChange={e => setActivityText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLog()}
                placeholder="Log an activity..."
              />
              <button className="btn-primary" onClick={handleLog}>Log</button>
            </div>

            <div className="activity-log">
              {[...(lead.activityLog || [])].reverse().map(entry => (
                <div key={entry.id} className="activity-entry">
                  <div className="activity-meta">
                    <span className={`activity-type-tag activity-${entry.type?.toLowerCase()}`}>
                      {entry.type}
                    </span>
                    <span className="activity-date">{formatDate(entry.date)}</span>
                  </div>
                  <div className="activity-body">{entry.text}</div>
                </div>
              ))}
              {(!lead.activityLog || lead.activityLog.length === 0) && (
                <div className="empty-state" style={{ paddingTop: 32 }}>
                  <div className="empty-title">No activity yet</div>
                  <div className="empty-sub">Log a call, note, or email above</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function DetailSection({ label, children }) {
  return (
    <div className="detail-section">
      <div className="detail-section-label">{label}</div>
      {children}
    </div>
  )
}

function DetailRow({ label, value, valueColor }) {
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className="detail-value" style={valueColor ? { color: valueColor, fontWeight: 600 } : {}}>
        {value || '—'}
      </span>
    </div>
  )
}
