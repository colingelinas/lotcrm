export default function FastAddConfirm({ lead, onAddDetails, onDismiss }) {
  return (
    <div className="sheet-overlay" onClick={onDismiss}>
      <div className="sheet-panel" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="confirm-name">{lead.first} {lead.last}</div>
        <div className="confirm-headline">Lead added.</div>
        <div className="confirm-sub">Want to fill in details?</div>
        <div className="confirm-actions">
          <button className="cta-btn" onClick={onAddDetails}>YES, ADD DETAILS</button>
          <button className="confirm-later-btn" onClick={onDismiss}>NO, DO IT LATER</button>
        </div>
      </div>
    </div>
  )
}
