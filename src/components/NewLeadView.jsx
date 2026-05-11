import { useState } from 'react'
import LeadFormBody from './LeadFormBody.jsx'
import { BackIcon } from './icons.jsx'

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export default function NewLeadView({ prefillStatus, onSave, onBack }) {
  const [form, setForm] = useState({
    id: newId(),
    first: '', last: '', phone: '', email: '',
    vehicle: '', budget: '', tradeIn: '', commission: '', financing: false,
    source: 'Walk-in', status: prefillStatus || 'New', temperature: 'Warm',
    notes: '', followUpDate: '', followUpTime: '',
    activityLog: [], createdAt: new Date().toISOString(),
  })

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const canSave = form.first.trim() || form.last.trim()

  return (
    <div className="form-screen">
      <div className="form-screen-header">
        <button className="back-btn" onClick={onBack}>
          <BackIcon /> Back
        </button>
        <span className="form-screen-title">New Lead</span>
        <div className="form-screen-header-spacer" />
      </div>

      <div className="form-screen-body">
        <LeadFormBody form={form} set={set} autoFocusFirst />
      </div>

      <div className="form-screen-footer">
        <button
          className={`cta-btn ${!canSave ? 'cta-btn-disabled' : ''}`}
          onClick={() => canSave && onSave(form)}
          disabled={!canSave}
        >
          Create Lead
        </button>
        {!canSave && <p className="form-hint">Enter a first or last name to continue</p>}
      </div>
    </div>
  )
}
