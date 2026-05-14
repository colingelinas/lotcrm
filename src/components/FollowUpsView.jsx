import LeadListItem from './LeadListItem.jsx'
import { todayStr, tomorrowStr } from '../data/demo.js'

export default function FollowUpsView({ leads, openView, openNew }) {
  const today = todayStr()
  const tomorrow = tomorrowStr()

  const active = leads.filter(l => !['Sold', 'Lost'].includes(l.status))

  const sections = [
    {
      id: 'overdue',
      label: 'Overdue',
      accent: '#e53e3e',
      items: active
        .filter(l => l.followUpDate && l.followUpDate < today)
        .sort((a, b) => a.followUpDate.localeCompare(b.followUpDate)),
    },
    {
      id: 'today',
      label: 'Today',
      accent: '#4a9eff',
      items: active
        .filter(l => l.followUpDate === today)
        .sort((a, b) => (a.followUpTime || '').localeCompare(b.followUpTime || '')),
    },
    {
      id: 'tomorrow',
      label: 'Tomorrow',
      accent: '#6366f1',
      items: active
        .filter(l => l.followUpDate === tomorrow)
        .sort((a, b) => (a.followUpTime || '').localeCompare(b.followUpTime || '')),
    },
  ]

  const totalUrgent = sections[0].items.length + sections[1].items.length

  const withFollowUp = active.filter(l => l.followUpDate)
  const done = withFollowUp.filter(l => !['New', 'Contacted'].includes(l.status))
  const progress = withFollowUp.length > 0 ? (done.length / withFollowUp.length) * 100 : 0

  const isEmpty = sections.every(s => s.items.length === 0)

  return (
    <div>
      <div className="page-header">
        <span className="page-title">Follow-Ups</span>
        {totalUrgent > 0 && (
          <span className="page-badge-danger">{totalUrgent} due</span>
        )}
      </div>

      <div className="view-body">
        {withFollowUp.length > 0 && (
          <div className="followup-progress-wrap">
            <div className="followup-progress-label">{done.length} of {withFollowUp.length} complete</div>
            <div className="followup-progress-bar-bg">
              <div className="followup-progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {isEmpty ? (
          <div className="empty-state">
            <div className="empty-state-headline">You're clear.</div>
            <div className="empty-state-sub">Go find your next deal.</div>
          </div>
        ) : (
          sections.map(section => section.items.length > 0 && (
            <div key={section.id} className="section-block">
              <div className="section-header" style={{ color: section.accent, borderColor: section.accent + '33' }}>
                <span>{section.label}</span>
                <span className="section-count" style={{ background: section.accent + '22', color: section.accent }}>
                  {section.items.length}
                </span>
              </div>
              {section.items.map(lead => (
                <LeadListItem key={lead.id} lead={lead} onClick={() => openView(lead)} />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
