import { STATUSES } from '../data/demo.js'
import LeadCard from './LeadCard.jsx'

export default function KanbanBoard({ leads, followUpFilter, searchQuery, onCardClick, onAddLead, onMoveStatus }) {
  const today = new Date().toISOString().slice(0, 10)
  const tomorrow = (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10) })()

  function filterLeads(lead) {
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const haystack = [lead.first, lead.last, lead.phone, lead.email, lead.vehicle].join(' ').toLowerCase()
      if (!haystack.includes(q)) return false
    }
    if (followUpFilter === 'Today') return lead.followUpDate === today
    if (followUpFilter === 'Overdue') return lead.followUpDate && lead.followUpDate < today
    if (followUpFilter === 'Tomorrow') return lead.followUpDate === tomorrow
    return true
  }

  return (
    <div className="board">
      {STATUSES.map(status => {
        const col = leads.filter(l => l.status === status && filterLeads(l))
        return (
          <div key={status} className={`column column-${status.replace(/\s/g, '-').toLowerCase()}`}>
            <div className="column-header">
              <span className="column-title">{status}</span>
              <span className="column-count">{leads.filter(l => l.status === status).length}</span>
            </div>
            <div className="column-cards">
              {col.map(lead => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onClick={() => onCardClick(lead)}
                  onMoveStatus={onMoveStatus}
                />
              ))}
              {col.length === 0 && (
                <div className="empty-col">No leads</div>
              )}
            </div>
            <button className="add-card-btn" onClick={() => onAddLead(status)}>+ Add Lead</button>
          </div>
        )
      })}
    </div>
  )
}
