import { TEMP_COLORS, todayStr } from '../data/demo.js'

const TEMP_BAR = { Hot: '#e6edf3', Warm: '#4a9eff', Cold: 'transparent' }

export default function LeadListItem({ lead, onClick, showFollowUp = true }) {
  const today = todayStr()
  const isOverdue = lead.followUpDate && lead.followUpDate < today
  const isToday = lead.followUpDate === today

  function followUpLabel() {
    if (!lead.followUpDate) return null
    const time = lead.followUpTime || ''
    if (isOverdue) return `Overdue${time ? ' · ' + time : ''}`
    if (isToday) return `Today${time ? ' · ' + time : ''}`
    return `Tomorrow${time ? ' · ' + time : ''}`
  }

  const fuLabel = showFollowUp ? followUpLabel() : null

  return (
    <div className="lead-item" onClick={onClick}>
      <div
        className="lead-item-bar"
        style={{ background: TEMP_BAR[lead.temperature] || 'transparent' }}
      />
      <div className="lead-item-body">
        <div className="lead-item-top">
          <span className="lead-item-name">{lead.first} {lead.last}</span>
          <span
            className="lead-item-temp"
            style={{ color: TEMP_COLORS[lead.temperature] }}
            title={lead.temperature}
          >&#9679;</span>
        </div>
        <div className="lead-item-vehicle">{lead.vehicle || 'No vehicle'}</div>
        <div className="lead-item-meta">
          <span className="lead-item-status">{lead.status}</span>
          {fuLabel && (
            <span className="lead-item-followup">· {fuLabel}</span>
          )}
        </div>
      </div>
      <div className="lead-item-chevron">›</div>
    </div>
  )
}
