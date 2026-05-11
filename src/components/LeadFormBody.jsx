import { STATUSES, SOURCES, TEMPERATURES, TEMP_COLORS } from '../data/demo.js'

export default function LeadFormBody({ form, set, autoFocusFirst }) {
  return (
    <>
      <FormSection label="Contact">
        <FormField label="First Name">
          <input
            value={form.first}
            onChange={e => set('first', e.target.value)}
            placeholder="First name"
            autoFocus={!!autoFocusFirst}
          />
        </FormField>
        <FormField label="Last Name">
          <input
            value={form.last}
            onChange={e => set('last', e.target.value)}
            placeholder="Last name"
          />
        </FormField>
        <FormField label="Phone">
          <input
            type="tel"
            value={form.phone}
            onChange={e => set('phone', e.target.value)}
            placeholder="(555) 000-0000"
          />
        </FormField>
        <FormField label="Email">
          <input
            type="email"
            value={form.email}
            onChange={e => set('email', e.target.value)}
            placeholder="email@example.com"
          />
        </FormField>
      </FormSection>

      <FormSection label="Vehicle">
        <FormField label="Vehicle of Interest">
          <input
            value={form.vehicle}
            onChange={e => set('vehicle', e.target.value)}
            placeholder="2024 Ford F-150 XLT"
          />
        </FormField>
        <FormField label="Budget">
          <div className="input-prefix-wrap">
            <span className="input-prefix">$</span>
            <input
              type="number"
              value={form.budget}
              onChange={e => set('budget', e.target.value)}
              placeholder="50,000"
              className="has-prefix"
            />
          </div>
        </FormField>
        <FormField label="Trade-In">
          <input
            value={form.tradeIn}
            onChange={e => set('tradeIn', e.target.value)}
            placeholder="2019 Chevy Silverado (optional)"
          />
        </FormField>
        <FormField label="Financing">
          <label className="fs-checkbox">
            <input
              type="checkbox"
              checked={form.financing}
              onChange={e => set('financing', e.target.checked)}
            />
            <span className="fs-checkbox-box" />
            Needs financing
          </label>
        </FormField>
      </FormSection>

      <FormSection label="Lead Info">
        <FormField label="Source">
          <div className="select-wrap">
            <select value={form.source} onChange={e => set('source', e.target.value)}>
              {SOURCES.map(s => <option key={s}>{s}</option>)}
            </select>
            <span className="select-arrow">›</span>
          </div>
        </FormField>
        <FormField label="Status">
          <div className="select-wrap">
            <select value={form.status} onChange={e => set('status', e.target.value)}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
            <span className="select-arrow">›</span>
          </div>
        </FormField>
        <FormField label="Commission">
          <div className="input-prefix-wrap">
            <span className="input-prefix">$</span>
            <input
              type="number"
              value={form.commission ?? ''}
              onChange={e => set('commission', e.target.value)}
              placeholder="0"
              className="has-prefix"
            />
          </div>
        </FormField>
        <FormField label="Temperature">
          <div className="temp-picker">
            {TEMPERATURES.map(t => (
              <button
                key={t}
                type="button"
                className={`temp-option ${form.temperature === t ? 'active' : ''}`}
                style={form.temperature === t ? {
                  background: TEMP_COLORS[t] + '22',
                  borderColor: TEMP_COLORS[t],
                  color: TEMP_COLORS[t],
                } : {}}
                onClick={() => set('temperature', t)}
              >
                <span className="temp-dot" style={{ background: TEMP_COLORS[t] }} />
                {t}
              </button>
            ))}
          </div>
        </FormField>
      </FormSection>

      <FormSection label="Follow-Up">
        <div className="field-row">
          <FormField label="Date">
            <input
              type="date"
              value={form.followUpDate}
              onChange={e => set('followUpDate', e.target.value)}
            />
          </FormField>
          <FormField label="Time">
            <input
              type="time"
              value={form.followUpTime}
              onChange={e => set('followUpTime', e.target.value)}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection label="Notes">
        <textarea
          value={form.notes}
          onChange={e => set('notes', e.target.value)}
          placeholder="Notes about this lead..."
          rows={4}
          className="fs-textarea"
        />
      </FormSection>
    </>
  )
}

export function FormSection({ label, children }) {
  return (
    <div className="fs-section">
      <div className="fs-section-label">{label}</div>
      {children}
    </div>
  )
}

export function FormField({ label, children }) {
  return (
    <div className="fs-field">
      <label className="fs-field-label">{label}</label>
      {children}
    </div>
  )
}
