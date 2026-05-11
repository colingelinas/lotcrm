import { STATUSES, TEMP_COLORS, STATUS_COLORS } from '../data/demo.js'

export default function LeadCard({ lead, onClick, onMoveStatus }) {
  const today = new Date().toISOString().slice(0, 10)
  const isOverdue = lead.followUpDate && lead.followUpDate < today && !['Sold','Lost'].includes(lead.status)
  const isToday = lead.followUpDate === today

  function formatFollowUp(date, time) {
    if (!date) return null
    const d = new Date(date + 'T00:00:00')
    const label = date === today ? 'Today' : date < today ? 'Overdue' : 'Tomorrow'
    return `${label}${time ? ' ' + time : ''}`
  }

  const currentIndex = STATUSES.indexOf(lead.status)

  return (
    <div
      className={`card ${isOverdue ? 'card-overdue' : ''}`}
      onClick={onClick}
      style={{ borderLeft: `4px solid ${STATUS_COLORS[lead.status] || '#ccc'}` }}
    >
      <div className="card-top">
        <span className="card-name">{lead.first} {lead.last}</span>
        <span className="card-temp" style={{ color: TEMP_COLORS[lead.temperature] }}>&#9679;</span>
      </div>
      <div className="card-vehicle">{lead.vehicle || 'No vehicle'}</div>
      {lead.budget && (
        <div className="card-budget">${Number(lead.budget).toLocaleString()}</div>
      )}
      {lead.followUpDate && (
        <div className={`card-followup ${isOverdue ? 'followup-overdue' : isToday ? 'followup-today' : ''}`}>
          {formatFollowUp(lead.followUpDate, lead.followUpTime)}
        </div>
      )}
      <div className="card-footer">
        <span className="card-source">{lead.source}</span>
        <div className="card-move" onClick={e => e.stopPropagation()}>
          {currentIndex > 0 && (
            <button className="move-btn" title={STATUSES[currentIndex - 1]} onClick={() => onMoveStatus(lead.id, STATUSES[currentIndex - 1])}>&#8592;</button>
          )}
          {currentIndex < STATUSES.length - 1 && (
            <button className="move-btn" title={STATUSES[currentIndex + 1]} onClick={() => onMoveStatus(lead.id, STATUSES[currentIndex + 1])}>&#8594;</button>
          )}
        </div>
      </div>
    </div>
  )
}
