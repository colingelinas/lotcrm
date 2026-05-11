const KEY = 'lotcrm_streak'

function dateStr(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function isWeekday(d) { return d.getDay() !== 0 && d.getDay() !== 6 }

function prevWeekday(str) {
  const [y, m, d] = str.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  do { date.setDate(date.getDate() - 1) } while (!isWeekday(date))
  return dateStr(date)
}

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} }
}

export function readStreak() {
  const { count = 0, lastDate = null } = load()
  if (!count || !lastDate) return 0
  const today = dateStr()
  // If today is a weekday and last activity was before the most recent past weekday, streak broke
  if (isWeekday(new Date()) && lastDate < prevWeekday(today)) {
    localStorage.setItem(KEY, JSON.stringify({ count: 0, lastDate }))
    return 0
  }
  return count
}

export function recordStreakActivity() {
  const now = new Date()
  if (!isWeekday(now)) return
  const today = dateStr(now)
  const { count = 0, lastDate = null } = load()
  if (lastDate === today) return
  const newCount = lastDate === prevWeekday(today) ? count + 1 : 1
  localStorage.setItem(KEY, JSON.stringify({ count: newCount, lastDate: today }))
}
