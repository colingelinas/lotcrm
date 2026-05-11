import { useState, useRef, useEffect } from 'react'

export default function FastAddSheet({ onAdd, onClose }) {
  const [first, setFirst] = useState('')
  const [last, setLast]   = useState('')
  const [phone, setPhone] = useState('')
  const firstRef = useRef(null)

  useEffect(() => { firstRef.current?.focus() }, [])

  const canAdd = first.trim().length > 0

  function handleAdd() {
    if (!canAdd) return
    onAdd({ first: first.trim(), last: last.trim(), phone: phone.trim() })
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleAdd()
  }

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet-panel" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-title">New Lead</div>
        <div className="sheet-fields">
          <input
            ref={firstRef}
            className="sheet-input"
            placeholder="First Name"
            value={first}
            onChange={e => setFirst(e.target.value)}
            onKeyDown={handleKey}
          />
          <input
            className="sheet-input"
            placeholder="Last Name"
            value={last}
            onChange={e => setLast(e.target.value)}
            onKeyDown={handleKey}
          />
          <input
            className="sheet-input"
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            onKeyDown={handleKey}
          />
        </div>
        <button
          className={`sheet-add-btn${!canAdd ? ' sheet-add-btn--disabled' : ''}`}
          onClick={handleAdd}
          disabled={!canAdd}
        >
          ADD LEAD
        </button>
      </div>
    </div>
  )
}
