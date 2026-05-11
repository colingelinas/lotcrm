import { useState } from 'react'
import { STATUSES, SOURCES, TEMPERATURES, STATUS_COLORS, TEMP_COLORS } from '../data/demo.js'

const ACTIVITY_TYPES = ['Note', 'Call', 'Email', 'Text', 'Visit']

export default function LeadModal({ state, onClose, onSave, onDelete, onEdit, onAddActivity }) {
  const { mode, lead } = state
  const isView = mode === 'view'
  const isNew = mode === 'new'

  const [form, setForm] = useState({ ...lead })
  const [activityText, setActivityText] = useState('')
  const [activityType, setActivityType] = useState('Note')
  const [activeTab, setActiveTab] = useState('details')
  const [confirmDelete, setConfirmDelete] = useState(false)

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleSave() {
    if (!form.first.trim() && !form.last.trim()) return
    onSave(form)
  }

  function handleAddActivity() {
    if (!activityText.trim()) return
    onAddActivity(lead.id, { type: activityType, text: activityText })
    setActivityText('')
  }

  function formatDate(iso) {
    if (!iso) return ''
    return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">
            {isNew ? 'New Lead' : `${lead.first} ${lead.last}`}
            {!isView && !isNew && <span className="modal-editing-badge">Editing</span>}
          </div>
          <div className="modal-header-actions">
            {isView && (
              <button className="btn-secondary" onClick={() => onEdit(lead)}>Edit</button>
            )}
            <button className="modal-close" onClick={onClose}>&#x2715;</button>
          </div>
        </div>

        {!isNew && (
          <div className="modal-tabs">
            <button className={activeTab === 'details' ? 'tab active' : 'tab'} onClick={() => setActiveTab('details')}>Details</button>
            <button className={activeTab === 'activity' ? 'tab active' : 'tab'} onClick={() => setActiveTab('activity')}>
              Activity
              {lead.activityLog?.length > 0 && <span className="badge">{lead.activityLog.length}</span>}
            </button>
          </div>
        )}

        <div className="modal-body">
          {(isNew || activeTab === 'details') && (
            <div className="form-grid">
              <Field label="First Name" required>
                {isView
                  ? <span>{lead.first}</span>
                  : <input value={form.first} onChange={e => set('first', e.target.value)} placeholder="First name" />
                }
              </Field>
              <Field label="Last Name" required>
                {isView
                  ? <span>{lead.last}</span>
                  : <input value={form.last} onChange={e => set('last', e.target.value)} placeholder="Last name" />
                }
              </Field>
              <Field label="Phone">
                {isView
                  ? <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                  : <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(555) 000-0000" type="tel" />
                }
              </Field>
              <Field label="Email">
                {isView
                  ? <a href={`mailto:${lead.email}`}>{lead.email}</a>
                  : <input value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" type="email" />
                }
              </Field>
              <Field label="Vehicle of Interest" wide>
                {isView
                  ? <span>{lead.vehicle}</span>
                  : <input value={form.vehicle} onChange={e => set('vehicle', e.target.value)} placeholder="2024 Ford F-150 XLT" />
                }
              </Field>
              <Field label="Budget">
                {isView
                  ? <span>{lead.budget ? '$' + Number(lead.budget).toLocaleString() : '—'}</span>
                  : <input value={form.budget} onChange={e => set('budget', e.target.value)} placeholder="50000" type="number" />
                }
              </Field>
              <Field label="Trade-In">
                {isView
                  ? <span>{lead.tradeIn || '—'}</span>
                  : <input value={form.tradeIn} onChange={e => set('tradeIn', e.target.value)} placeholder="2019 Chevy Silverado" />
                }
              </Field>
              <Field label="Financing">
                {isView
                  ? <span>{lead.financing ? 'Yes' : 'No'}</span>
                  : <label className="checkbox-label">
                      <input type="checkbox" checked={form.financing} onChange={e => set('financing', e.target.checked)} />
                      Needs financing
                    </label>
                }
              </Field>
              <Field label="Source">
                {isView
                  ? <span>{lead.source}</span>
                  : <select value={form.source} onChange={e => set('source', e.target.value)}>
                      {SOURCES.map(s => <option key={s}>{s}</option>)}
                    </select>
                }
              </Field>
              <Field label="Status">
                {isView
                  ? <StatusBadge status={lead.status} />
                  : <select value={form.status} onChange={e => set('status', e.target.value)}>
                      {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                }
              </Field>
              <Field label="Temperature">
                {isView
                  ? <TempBadge temp={lead.temperature} />
                  : <select value={form.temperature} onChange={e => set('temperature', e.target.value)}>
                      {TEMPERATURES.map(t => <option key={t}>{t}</option>)}
                    </select>
                }
              </Field>
              <Field label="Follow-up Date">
                {isView
                  ? <span>{lead.followUpDate || '—'}</span>
                  : <input type="date" value={form.followUpDate} onChange={e => set('followUpDate', e.target.value)} />
                }
              </Field>
              <Field label="Follow-up Time">
                {isView
                  ? <span>{lead.followUpTime || '—'}</span>
                  : <input type="time" value={form.followUpTime} onChange={e => set('followUpTime', e.target.value)} />
                }
              </Field>
              <Field label="Notes" wide>
                {isView
                  ? <span className="notes-text">{lead.notes || '—'}</span>
                  : <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} placeholder="Notes about this lead..." />
                }
              </Field>
            </div>
          )}

          {!isNew && activeTab === 'activity' && (
            <div className="activity-panel">
              <div className="activity-add">
                <select value={activityType} onChange={e => setActivityType(e.target.value)} className="activity-type-select">
                  {ACTIVITY_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                <input
                  className="activity-input"
                  value={activityText}
                  onChange={e => setActivityText(e.target.value)}
                  placeholder="Log an activity..."
                  onKeyDown={e => e.key === 'Enter' && handleAddActivity()}
                />
                <button className="btn-primary" onClick={handleAddActivity}>Log</button>
              </div>
              <div className="activity-log">
                {[...(lead.activityLog || [])].reverse().map(entry => (
                  <div key={entry.id} className="activity-entry">
                    <div className="activity-meta">
                      <span className={`activity-type-tag activity-${entry.type?.toLowerCase()}`}>{entry.type}</span>
                      <span className="activity-date">{formatDate(entry.date)}</span>
                    </div>
                    <div className="activity-body">{entry.text}</div>
                  </div>
                ))}
                {(!lead.activityLog || lead.activityLog.length === 0) && (
                  <div className="empty-col">No activity yet.</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {!isView && (
            <>
              <button className="btn-primary" onClick={handleSave}>
                {isNew ? 'Create Lead' : 'Save Changes'}
              </button>
              <button className="btn-ghost" onClick={onClose}>Cancel</button>
            </>
          )}
          {!isNew && (
            <div className="footer-danger">
              {confirmDelete
                ? <>
                    <span>Delete this lead?</span>
                    <button className="btn-danger" onClick={() => onDelete(lead.id)}>Yes, Delete</button>
                    <button className="btn-ghost" onClick={() => setConfirmDelete(false)}>Cancel</button>
                  </>
                : <button className="btn-danger-ghost" onClick={() => setConfirmDelete(true)}>Delete Lead</button>
              }
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, children, wide, required }) {
  return (
    <div className={`field ${wide ? 'field-wide' : ''}`}>
      <label className="field-label">{label}{required && <span className="required">*</span>}</label>
      <div className="field-value">{children}</div>
    </div>
  )
}


function StatusBadge({ status }) {
  return <span className="badge-pill" style={{ background: STATUS_COLORS[status] + '22', color: STATUS_COLORS[status] }}>{status}</span>
}
function TempBadge({ temp }) {
  return <span className="badge-pill" style={{ background: TEMP_COLORS[temp] + '22', color: TEMP_COLORS[temp] }}>{temp}</span>
}
