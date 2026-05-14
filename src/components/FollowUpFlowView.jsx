import { useState, useEffect } from 'react'
import { tomorrowStr } from '../data/demo.js'
import { recordStreakActivity } from '../data/streak.js'
import { BackIcon } from './icons.jsx'

function daysFromNow(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

function thisFriday() {
  const d = new Date()
  const toFri = ((5 - d.getDay()) + 7) % 7 || 7
  d.setDate(d.getDate() + toFri)
  return d.toISOString().slice(0, 10)
}

const QUICK = [
  { label: 'Tomorrow',  sub: '9:00 AM',     getDate: () => tomorrowStr(),   time: '09:00' },
  { label: 'In 2 Days', sub: '9:00 AM',     getDate: () => daysFromNow(2), time: '09:00' },
  { label: 'This Week', sub: 'Fri 9:00 AM', getDate: () => thisFriday(),   time: '09:00' },
]

const OUTCOME_ACTIVITY = {
  spoke:      { type: 'Call', text: 'Spoke to them' },
  voicemail:  { type: 'Call', text: 'Left voicemail' },
  'no-answer': { type: 'Call', text: 'No answer' },
}

export default function FollowUpFlowView({ flowLeads, onUpdateLead, onBack, onDone }) {
  const [idx, setIdx]               = useState(0)
  const [completed, setCompleted]   = useState(0)
  const [exiting, setExiting]       = useState(false)
  const [outcome, setOutcome]       = useState(null)
  const [currentLead, setCurrentLead] = useState(null)
  const [showCustom, setShowCustom] = useState(false)
  const [customDate, setCustomDate] = useState('')
  const [customTime, setCustomTime] = useState('09:00')
  const [showCheck, setShowCheck]   = useState(false)

  const isDone   = idx >= flowLeads.length
  const lead     = isDone ? null : (currentLead ?? flowLeads[idx])
  const progress = Math.round((idx / flowLeads.length) * 100)

  useEffect(() => {
    if (isDone) {
      const t = setTimeout(onDone, 1500)
      return () => clearTimeout(t)
    }
  }, [isDone])

  function advance(didSet) {
    if (exiting) return
    if (didSet) {
      setShowCheck(true)
      setTimeout(() => setShowCheck(false), 450)
    }
    setExiting(true)
    if (didSet) setCompleted(c => c + 1)
    setTimeout(() => {
      setIdx(i => i + 1)
      setExiting(false)
      setOutcome(null)
      setCurrentLead(null)
      setShowCustom(false)
      setCustomDate('')
      setCustomTime('09:00')
    }, 210)
  }

  function handleOutcome(type) {
    recordStreakActivity()
    const entry = OUTCOME_ACTIVITY[type]
    const base = flowLeads[idx]
    let updated = base
    if (entry) {
      const newActivity = { id: Date.now().toString(36), date: new Date().toISOString(), ...entry }
      updated = { ...base, activityLog: [...(base.activityLog || []), newActivity] }
      onUpdateLead(updated)
    }
    setCurrentLead(updated)
    setOutcome(type)
  }

  function handleQuick(opt) {
    onUpdateLead({ ...lead, followUpDate: opt.getDate(), followUpTime: opt.time })
    advance(true)
  }

  function handleCustomSave() {
    if (!customDate) return
    onUpdateLead({ ...lead, followUpDate: customDate, followUpTime: customTime })
    advance(true)
  }

  if (isDone) {
    return (
      <div className="flow-screen">
        <div className="flow-done">
          <div className="flow-done-check">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="flow-done-title">DONE FOR NOW</div>
          <div className="flow-done-sub">
            {completed} of {flowLeads.length} follow-up{flowLeads.length !== 1 ? 's' : ''} updated
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flow-screen">
      {/* Header */}
      <div className="form-screen-header">
        <button className="back-btn" onClick={onBack}><BackIcon /> Back</button>
        <span className="form-screen-title">Follow-Ups</span>
        <div className="form-screen-header-spacer" />
      </div>

      {/* Progress bar + counter */}
      <div className="flow-progress-bg">
        <div className="flow-progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="flow-counter">{idx + 1} of {flowLeads.length}</div>

      {/* Lead card */}
      <div className={`flow-lead-card${exiting ? ' flow-exit' : ''}`} key={idx}>
        {showCheck && (
          <div className="flow-check-flash">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
        <div className="flow-lead-name">{lead.first} {lead.last}</div>
        {lead.vehicle && <div className="flow-lead-vehicle">{lead.vehicle}</div>}
        <div className="flow-lead-status-tag">{lead.status}</div>
        {lead.notes && (
          <div className="flow-lead-notes">
            {lead.notes.length > 110 ? lead.notes.slice(0, 110) + '…' : lead.notes}
          </div>
        )}

        {/* Contact strip */}
        <div className="flow-contact-strip">
          {lead.phone && (
            <a href={`tel:${lead.phone}`} className="flow-contact-btn" aria-label="Call">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7 12.8 12.8 0 00.7 2.8 2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5 12.8 12.8 0 002.8.7A2 2 0 0122 16.9z" />
              </svg>
            </a>
          )}
          {lead.phone && (
            <a href={`sms:${lead.phone}`} className="flow-contact-btn" aria-label="Text">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </a>
          )}
          {lead.email && (
            <a href={`mailto:${lead.email}`} className="flow-contact-btn" aria-label="Email">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Outcome buttons */}
      {!outcome ? (
        <div className="flow-outcomes">
          <button className="flow-outcome-btn flow-outcome-primary" onClick={() => handleOutcome('spoke')}>SPOKE TO THEM</button>
          <button className="flow-outcome-btn flow-outcome-surface" onClick={() => handleOutcome('voicemail')}>LEFT VOICEMAIL</button>
          <button className="flow-outcome-btn flow-outcome-surface" onClick={() => handleOutcome('no-answer')}>NO ANSWER</button>
          <button className="flow-outcome-skip" onClick={() => advance(false)}>SKIP</button>
        </div>
      ) : (
        /* Follow-up options */
        <div className="flow-body">
          <div className="flow-section-label">Set Next Follow-Up</div>

          {!showCustom ? (
            <>
              <div className="flow-quick-list">
                {QUICK.map(opt => (
                  <button
                    key={opt.label}
                    className="flow-quick-btn"
                    onClick={() => handleQuick(opt)}
                    disabled={exiting}
                  >
                    <span className="flow-quick-label">{opt.label}</span>
                    <span className="flow-quick-sub">{opt.sub}</span>
                  </button>
                ))}
              </div>
              <button className="flow-custom-trigger" onClick={() => setShowCustom(true)}>
                Custom date &amp; time
              </button>
            </>
          ) : (
            <div className="flow-custom-wrap">
              <div className="flow-custom-fields">
                <input
                  type="date"
                  className="flow-input"
                  value={customDate}
                  onChange={e => setCustomDate(e.target.value)}
                />
                <input
                  type="time"
                  className="flow-input"
                  value={customTime}
                  onChange={e => setCustomTime(e.target.value)}
                />
              </div>
              <button
                className={`cta-btn${!customDate ? ' cta-btn-disabled' : ''}`}
                onClick={handleCustomSave}
                disabled={!customDate}
              >
                Set Follow-Up
              </button>
              <button className="flow-back-link" onClick={() => setShowCustom(false)}>
                ← Quick options
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
