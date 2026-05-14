import { useState } from 'react'
import LeadListItem from './LeadListItem.jsx'
import { STATUSES } from '../data/demo.js'

const FILTERS = ['All', ...STATUSES]
const TEMP_ORDER = { Hot: 0, Warm: 1, Cold: 2 }

export default function LeadsView({ leads, openView, openNew }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortBy, setSortBy] = useState('recent')

  const filtered = leads
    .filter(l => {
      if (statusFilter !== 'All' && l.status !== statusFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return [l.first, l.last, l.phone, l.email, l.vehicle].join(' ').toLowerCase().includes(q)
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'followup') {
        if (!a.followUpDate && !b.followUpDate) return 0
        if (!a.followUpDate) return 1
        if (!b.followUpDate) return -1
        const dc = a.followUpDate.localeCompare(b.followUpDate)
        return dc !== 0 ? dc : (a.followUpTime || '').localeCompare(b.followUpTime || '')
      }
      if (sortBy === 'hotness') {
        return (TEMP_ORDER[a.temperature] ?? 3) - (TEMP_ORDER[b.temperature] ?? 3)
      }
      return b.createdAt.localeCompare(a.createdAt)
    })

  return (
    <div>
      <div className="page-header">
        <span className="page-title">Leads</span>
        <button className="btn-icon" onClick={() => openNew()} title="New lead">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      <div className="view-body">
        <input
          className="search-bar"
          placeholder="Search by name, vehicle, phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="sort-tabs">
          {[
            { key: 'recent', label: 'Recent' },
            { key: 'followup', label: 'Follow-Up' },
            { key: 'hotness', label: 'Hotness' },
          ].map(s => (
            <button
              key={s.key}
              className={`sort-tab ${sortBy === s.key ? 'active' : ''}`}
              onClick={() => setSortBy(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="filter-scroll">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`filter-chip ${statusFilter === f ? 'active' : ''}`}
              onClick={() => setStatusFilter(f)}
            >
              {f}
              <span className="chip-count">
                {f === 'All' ? leads.length : leads.filter(l => l.status === f).length}
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          search || statusFilter !== 'All' ? (
            <div className="empty-minimal"><span>No results</span></div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-headline">No leads yet.</div>
              <div className="empty-state-sub">Every deal starts somewhere.</div>
              <button className="btn-primary" onClick={() => openNew()}>Add Your First Lead</button>
            </div>
          )
        ) : (
          <div className="lead-list">
            {filtered.map(lead => (
              <LeadListItem key={lead.id} lead={lead} onClick={() => openView(lead)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
