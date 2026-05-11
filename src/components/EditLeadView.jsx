import { useState } from 'react'
import LeadFormBody from './LeadFormBody.jsx'
import { BackIcon } from './icons.jsx'

export default function EditLeadView({ lead, onSave, onBack, onDelete }) {
  const [form, setForm] = useState({ ...lead })
  const [confirmDelete, setConfirmDelete] = useState(false)

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const name = [lead.first, lead.last].filter(Boolean).join(' ') || 'Edit Lead'

  return (
    <div className="form-screen">
      <div className="form-screen-header">
        <button className="back-btn" onClick={onBack}>
          <BackIcon /> Cancel
        </button>
        <span className="form-screen-title">{name}</span>
        <button
          className="header-save-btn"
          onClick={() => onSave(form)}
        >
          Save
        </button>
      </div>

      <div className="form-screen-body">
        <LeadFormBody form={form} set={set} />
      </div>

      <div className="form-screen-footer">
        <button className="cta-btn" onClick={() => onSave(form)}>
          Save Changes
        </button>
        {confirmDelete ? (
          <div className="delete-confirm-row">
            <span className="delete-confirm-label">Delete this lead?</span>
            <button className="btn-danger-sm" onClick={() => onDelete(lead.id)}>Delete</button>
            <button className="btn-ghost-sm" onClick={() => setConfirmDelete(false)}>Cancel</button>
          </div>
        ) : (
          <button className="delete-trigger" onClick={() => setConfirmDelete(true)}>
            Delete Lead
          </button>
        )}
      </div>
    </div>
  )
}
