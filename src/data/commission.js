const BEST_KEY = 'lotcrm_best_commission'

function isWeekday(d) { return d.getDay() !== 0 && d.getDay() !== 6 }

export function getMonthCommission(leads) {
  const now = new Date()
  const y = now.getFullYear(), m = now.getMonth()
  return leads
    .filter(l => {
      if (l.status !== 'Sold') return false
      const c = Number(l.commission)
      if (!c || c <= 0) return false
      // Parse as local time: split the ISO string to avoid UTC-vs-local mismatch
      const raw = l.createdAt || ''
      const [datePart] = raw.split('T')
      const [dy, dm] = (datePart || '').split('-').map(Number)
      return dy === y && dm - 1 === m
    })
    .reduce((sum, l) => sum + Number(l.commission), 0)
}

export function getWeekdaysInMonth() {
  const now = new Date()
  const y = now.getFullYear(), m = now.getMonth()
  const days = new Date(y, m + 1, 0).getDate()
  let n = 0
  for (let d = 1; d <= days; d++) if (isWeekday(new Date(y, m, d))) n++
  return n
}

export function getWeekdaysElapsed() {
  const now = new Date()
  const y = now.getFullYear(), m = now.getMonth(), today = now.getDate()
  let n = 0
  for (let d = 1; d <= today; d++) if (isWeekday(new Date(y, m, d))) n++
  return n
}

export function getBestMonth() {
  try { return Number(localStorage.getItem(BEST_KEY)) || 0 } catch { return 0 }
}

export function maybeUpdateBest(commission) {
  try {
    const stored = getBestMonth()
    if (commission > stored) { localStorage.setItem(BEST_KEY, String(commission)); return commission }
    return stored
  } catch { return 0 }
}
