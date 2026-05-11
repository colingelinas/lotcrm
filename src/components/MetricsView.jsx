import { STATUSES } from '../data/demo.js'

const BLUE = '#4a9eff'

export default function MetricsView({ leads }) {
  const total = leads.length
  const sold = leads.filter(l => l.status === 'Sold').length
  const lost = leads.filter(l => l.status === 'Lost').length
  const active = total - sold - lost
  const conversionRate = total > 0 ? Math.round((sold / total) * 100) : 0
  const hotLeads = leads.filter(l => l.temperature === 'Hot').length
  const financing = leads.filter(l => l.financing).length

  const byStatus = STATUSES.map(s => ({
    status: s,
    count: leads.filter(l => l.status === s).length,
  }))
  const maxStatus = Math.max(...byStatus.map(s => s.count), 1)

  const bySrc = {}
  leads.forEach(l => { bySrc[l.source] = (bySrc[l.source] || 0) + 1 })
  const srcEntries = Object.entries(bySrc).sort((a, b) => b[1] - a[1])

  return (
    <div>
      <div className="page-header">
        <span className="page-title">Metrics</span>
      </div>

      <div className="view-body">
        <div className="section-block">
          <div className="section-header">Overview</div>
          <DataRow label="Total Leads" value={total} />
          <DataRow label="Active" value={active} />
          <DataRow label="Sold" value={sold} />
          <DataRow label="Lost" value={lost} />
          <DataRow label="Conversion Rate" value={`${conversionRate}%`} />
          <DataRow label="Hot Leads" value={hotLeads} />
          <DataRow label="Needs Financing" value={financing} />
        </div>

        <div className="section-block">
          <div className="section-header">Pipeline</div>
          {byStatus.map(({ status, count }) => (
            <div key={status} className="pipeline-row">
              <div className="pipeline-label">{status}</div>
              <div className="pipeline-bar-wrap">
                <div className="pipeline-bar" style={{ width: `${(count / maxStatus) * 100}%`, background: BLUE }} />
              </div>
              <div className="pipeline-count">{count}</div>
            </div>
          ))}
        </div>

        {srcEntries.length > 0 && (
          <div className="section-block">
            <div className="section-header">By Source</div>
            {srcEntries.map(([src, count]) => (
              <div key={src} className="pipeline-row">
                <div className="pipeline-label">{src}</div>
                <div className="pipeline-bar-wrap">
                  <div className="pipeline-bar" style={{ width: `${(count / total) * 100}%`, background: BLUE }} />
                </div>
                <div className="pipeline-count">{count}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function DataRow({ label, value, color }) {
  return (
    <div className="data-row">
      <span className="data-label">{label}</span>
      <span className="data-value" style={color ? { color } : {}}>{value}</span>
    </div>
  )
}
