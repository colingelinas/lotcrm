import { useState } from 'react'
import { STATUSES } from '../data/demo.js'

const BLUE = '#4a9eff'

function fmtMoney(n) { return '$' + Math.round(n).toLocaleString('en-US') }

function getMonthBounds() {
  const now = new Date()
  return { y: now.getFullYear(), m: now.getMonth() }
}

function getWeekStart() {
  const d = new Date()
  const day = d.getDay()
  const monday = new Date(d)
  monday.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
  monday.setHours(0, 0, 0, 0)
  return monday.toISOString().slice(0, 10)
}

export default function MetricsView({ leads }) {
  const [period, setPeriod] = useState('month')

  const { y, m } = getMonthBounds()
  const weekStart = getWeekStart()

  function inPeriod(lead) {
    const raw = (lead.createdAt || '').slice(0, 10)
    if (period === 'month') {
      const [dy, dm] = raw.split('-').map(Number)
      return dy === y && dm - 1 === m
    }
    return raw >= weekStart
  }

  const periodLeads = leads.filter(inPeriod)
  const periodSold = periodLeads.filter(l => l.status === 'Sold')
  const periodCommission = periodSold.reduce((s, l) => s + (Number(l.commission) || 0), 0)
  const periodCloseRate = periodLeads.length > 0
    ? Math.round((periodSold.length / periodLeads.length) * 100)
    : null

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

  const bySrc = {}
  leads.forEach(l => { bySrc[l.source] = (bySrc[l.source] || 0) + 1 })
  const srcEntries = Object.entries(bySrc).sort((a, b) => b[1] - a[1])

  return (
    <div>
      <div className="page-header">
        <span className="page-title">Metrics</span>
      </div>

      <div className="view-body">
        <div className="sort-tabs">
          {[['week', 'This Week'], ['month', 'This Month']].map(([key, label]) => (
            <button
              key={key}
              className={`sort-tab ${period === key ? 'active' : ''}`}
              onClick={() => setPeriod(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="metrics-hero">
          <div className="metrics-hero-stat">
            <div
              className="metrics-hero-value"
              style={{ color: periodCommission > 0 ? BLUE : 'var(--text-tertiary)' }}
            >
              {periodCommission > 0 ? fmtMoney(periodCommission) : '—'}
            </div>
            <div className="metrics-hero-label">Commission</div>
          </div>
          <div className="metrics-hero-divider" />
          <div className="metrics-hero-stat">
            <div
              className="metrics-hero-value"
              style={{ color: periodCloseRate !== null && periodCloseRate > 0 ? 'var(--text)' : 'var(--text-tertiary)' }}
            >
              {periodCloseRate !== null ? `${periodCloseRate}%` : '—'}
            </div>
            <div className="metrics-hero-label">Close Rate</div>
          </div>
        </div>

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
                <div
                  className="pipeline-bar"
                  style={{ width: `${total > 0 ? (count / total) * 100 : 0}%`, background: BLUE }}
                />
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
                  <div
                    className="pipeline-bar"
                    style={{ width: `${(count / total) * 100}%`, background: BLUE }}
                  />
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
