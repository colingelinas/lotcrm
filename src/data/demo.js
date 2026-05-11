export const STATUSES = [
  'New',
  'Contacted',
  'Appointment Set',
  'Test Drive',
  'Negotiating',
  'Sold',
  'Lost',
]

export const SOURCES = [
  'Walk-in',
  'Marketplace',
  'AutoTrader',
  'Website',
  'Referral',
  'Phone',
  'Other',
]

export const TEMPERATURES = ['Hot', 'Warm', 'Cold']

export const STATUS_COLORS = {
  'New': '#484f58',
  'Contacted': '#6b7685',
  'Appointment Set': '#4a9eff',
  'Test Drive': '#4a9eff',
  'Negotiating': '#4a9eff',
  'Sold': '#e6edf3',
  'Lost': '#484f58',
}

export const TEMP_COLORS = { Hot: '#e6edf3', Warm: '#4a9eff', Cold: '#484f58' }

export function todayStr() { return new Date().toISOString().slice(0, 10) }
export function tomorrowStr() {
  const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10)
}
export function yesterdayStr() {
  const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10)
}
function daysAgo(n) {
  const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10)
}

export const demoLeads = [
  {
    id: '1',
    first: 'James', last: 'Mitchell',
    phone: '(555) 201-4488', email: 'jmitchell@email.com',
    vehicle: '2024 Ford F-150 XLT',
    budget: 55000, tradeIn: '2019 Chevy Silverado', financing: true,
    source: 'AutoTrader', status: 'Appointment Set', temperature: 'Hot',
    notes: 'Very interested, wants crew cab and tow package. Pre-approved at 7.9%.',
    followUpDate: daysAgo(3), followUpTime: '10:00',
    activityLog: [
      { id: 'a1', date: yesterdayStr() + 'T09:15:00', type: 'Note', text: 'Lead came in from AutoTrader — 2024 F-150.' },
      { id: 'a2', date: yesterdayStr() + 'T14:30:00', type: 'Call', text: 'Called James, confirmed interest. Scheduled appointment for tomorrow at 10am.' },
    ],
    createdAt: yesterdayStr() + 'T09:15:00',
  },
  {
    id: '2',
    first: 'Sarah', last: 'Okonkwo',
    phone: '(555) 384-9921', email: 'sokonkwo@gmail.com',
    vehicle: '2023 Honda CR-V EX',
    budget: 38000, tradeIn: '', financing: false,
    source: 'Website', status: 'Negotiating', temperature: 'Warm',
    notes: 'Cash buyer. Wants moon roof and heated seats. Close to deal at $36,500.',
    followUpDate: daysAgo(2), followUpTime: '14:00',
    activityLog: [
      { id: 'b1', date: yesterdayStr() + 'T11:00:00', type: 'Note', text: 'Submitted inquiry via website for CR-V.' },
      { id: 'b2', date: yesterdayStr() + 'T13:45:00', type: 'Email', text: 'Sent brochure and pricing sheet.' },
      { id: 'b3', date: todayStr() + 'T09:00:00', type: 'Call', text: 'Counter-offered at $36,500. She wants to think overnight.' },
    ],
    createdAt: yesterdayStr() + 'T11:00:00',
  },
  {
    id: '3',
    first: 'Derek', last: 'Flanagan',
    phone: '(555) 773-0055', email: 'dflanagan@work.net',
    vehicle: '2022 Toyota Camry SE',
    budget: 28000, tradeIn: '2017 Nissan Altima', financing: true,
    source: 'Referral', status: 'Contacted', temperature: 'Cold',
    notes: 'Referred by James Mitchell. Early stages, not sure on budget yet.',
    followUpDate: tomorrowStr(), followUpTime: '11:30',
    activityLog: [
      { id: 'c1', date: todayStr() + 'T08:30:00', type: 'Note', text: 'Derek called in — referred by James Mitchell. Interested in a sedan under $30k.' },
    ],
    createdAt: todayStr() + 'T08:30:00',
  },
  {
    id: '4',
    first: 'Priya', last: 'Sharma',
    phone: '(555) 618-3302', email: 'psharma@gmail.com',
    vehicle: '2024 Tesla Model Y',
    budget: 52000, tradeIn: '', financing: false,
    source: 'Website', status: 'Test Drive', temperature: 'Hot',
    notes: 'Loves the Model Y. Came in for a test drive today, very impressed. Likely to close this week.',
    followUpDate: daysAgo(1), followUpTime: '15:30',
    activityLog: [
      { id: 'd1', date: daysAgo(2) + 'T10:00:00', type: 'Note', text: 'Inquired about Model Y via website.' },
      { id: 'd2', date: yesterdayStr() + 'T16:00:00', type: 'Call', text: 'Confirmed test drive for today at 3:30pm.' },
    ],
    createdAt: daysAgo(2) + 'T10:00:00',
  },
  {
    id: '5',
    first: 'Kevin', last: 'Walsh',
    phone: '(555) 490-7713', email: 'kwalsh@outlook.com',
    vehicle: '2023 Chevy Equinox LT',
    budget: 32000, tradeIn: '2018 Ford Focus', financing: true,
    source: 'Phone', status: 'New', temperature: 'Warm',
    notes: 'Called in asking about Equinox inventory. First-time buyer. Needs low monthly payment.',
    followUpDate: tomorrowStr(), followUpTime: '09:00',
    activityLog: [
      { id: 'e1', date: todayStr() + 'T11:45:00', type: 'Call', text: 'Inbound call about Equinox. Set follow-up for tomorrow 9am.' },
    ],
    createdAt: todayStr() + 'T11:45:00',
  },
  {
    id: '6',
    first: 'Maria', last: 'Chen',
    phone: '(555) 255-8840', email: 'mchen@company.com',
    vehicle: '2024 Acura MDX A-Spec',
    budget: 62000, tradeIn: '2020 Honda Pilot', financing: false,
    source: 'Walk-in', status: 'Sold', temperature: 'Hot',
    notes: 'Walked in knowing exactly what she wanted. Clean deal, cash. Delivered same day.',
    commission: 1200,
    followUpDate: '', followUpTime: '',
    activityLog: [
      { id: 'f1', date: daysAgo(3) + 'T13:00:00', type: 'Visit', text: 'Walk-in, requested Acura MDX A-Spec in Majestic Black.' },
      { id: 'f2', date: daysAgo(3) + 'T14:30:00', type: 'Note', text: 'Test drove, loved it. Starting paperwork.' },
      { id: 'f3', date: daysAgo(3) + 'T16:00:00', type: 'Note', text: 'SOLD. Cash deal. $61,200 out the door.' },
    ],
    createdAt: daysAgo(3) + 'T13:00:00',
  },
  {
    id: '7',
    first: 'Tyler', last: 'Brooks',
    phone: '(555) 332-6619', email: 'tbrooks@gmail.com',
    vehicle: '2021 Jeep Grand Cherokee',
    budget: 42000, tradeIn: '2016 Dodge Ram', financing: true,
    source: 'Marketplace',  status: 'Lost', temperature: 'Cold',
    notes: 'Went to another dealer. Said they were $800 cheaper. Logged for future re-engagement.',
    followUpDate: '', followUpTime: '',
    activityLog: [
      { id: 'g1', date: daysAgo(4) + 'T09:00:00', type: 'Note', text: 'Marketplace lead on Grand Cherokee.' },
      { id: 'g2', date: daysAgo(4) + 'T15:00:00', type: 'Call', text: 'Spoke with Tyler. He is shopping around.' },
      { id: 'g3', date: daysAgo(2) + 'T10:00:00', type: 'Call', text: 'Tyler went with Crestview Jeep. $800 difference on trade.' },
    ],
    createdAt: daysAgo(4) + 'T09:00:00',
  },
]
