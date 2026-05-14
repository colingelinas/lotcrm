import { useState, useEffect, useRef } from 'react'
import BottomNav from './components/BottomNav.jsx'
import DashboardView from './components/DashboardView.jsx'
import LeadsView from './components/LeadsView.jsx'
import FollowUpsView from './components/FollowUpsView.jsx'
import MetricsView from './components/MetricsView.jsx'
import ProfileView from './components/ProfileView.jsx'
import NewLeadView from './components/NewLeadView.jsx'
import EditLeadView from './components/EditLeadView.jsx'
import ViewLeadView from './components/ViewLeadView.jsx'
import FollowUpFlowView from './components/FollowUpFlowView.jsx'
import FastAddSheet from './components/FastAddSheet.jsx'
import FastAddConfirm from './components/FastAddConfirm.jsx'
import { demoLeads } from './data/demo.js'

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export default function App() {
  const [leads, setLeads] = useState(demoLeads)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [viewLeadId, setViewLeadId] = useState(null)
  const [newLeadStatus, setNewLeadStatus] = useState(null)
  const [editLeadData, setEditLeadData] = useState(null)
  const [followUpFlow, setFollowUpFlow] = useState(null)
  const [fastAddOpen, setFastAddOpen] = useState(false)
  const [fastAddConfirm, setFastAddConfirm] = useState(null)
  const [fabVisible, setFabVisible] = useState(true)
  const [fabPopping, setFabPopping] = useState(false)
  const [navDir, setNavDir] = useState('tab')
  const lastScrollY = useRef(0)

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY
      const delta = y - lastScrollY.current
      if (Math.abs(delta) > 4) {
        setFabVisible(delta < 0 || y < 80)
        lastScrollY.current = y
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setFabVisible(true)
    lastScrollY.current = 0
    window.scrollTo(0, 0)
  }, [activeTab])

  function handleTabChange(tab) {
    setNavDir('tab')
    setActiveTab(tab)
  }

  function handleFabClick() {
    setFabPopping(true)
    setFastAddOpen(true)
  }

  function openNew(prefillStatus = 'New') {
    setNavDir('fwd')
    setNewLeadStatus(prefillStatus)
  }

  function openView(lead) {
    setNavDir('fwd')
    setViewLeadId(lead.id)
  }

  function openEdit(lead) {
    setNavDir('fwd')
    setViewLeadId(null)
    setEditLeadData(lead)
  }

  function createLead(lead) {
    setLeads(prev => [...prev, lead])
    setNavDir('back')
    setNewLeadStatus(null)
  }

  function updateLead(lead) {
    setLeads(prev => prev.map(l => l.id === lead.id ? lead : l))
    setNavDir('back')
    setEditLeadData(null)
    setViewLeadId(lead.id)
  }

  function updateLeadData(lead) {
    setLeads(prev => prev.map(l => l.id === lead.id ? lead : l))
  }

  function fastCreateLead({ first, last, phone }) {
    const lead = {
      id: newId(),
      first, last, phone,
      email: '', vehicle: '', budget: '', tradeIn: '', commission: '',
      financing: false, source: 'Other',
      status: 'New', temperature: 'Cold',
      notes: '', followUpDate: '', followUpTime: '',
      activityLog: [], createdAt: new Date().toISOString(),
    }
    setLeads(prev => [...prev, lead])
    setFastAddOpen(false)
    setFabPopping(false)
    setFastAddConfirm(lead)
  }

  function deleteLead(id) {
    setLeads(prev => prev.filter(l => l.id !== id))
    setNavDir('back')
    setEditLeadData(null)
    setViewLeadId(null)
  }

  function addActivity(leadId, entry) {
    setLeads(prev => prev.map(l =>
      l.id === leadId
        ? { ...l, activityLog: [...l.activityLog, { id: newId(), date: new Date().toISOString(), ...entry }] }
        : l
    ))
  }

  const viewProps = { leads, openView, openNew, openEdit }

  // New lead screen
  if (newLeadStatus !== null) {
    return (
      <div className="app-wrap" data-nav={navDir}>
        <NewLeadView
          prefillStatus={newLeadStatus}
          onSave={createLead}
          onBack={() => { setNavDir('back'); setNewLeadStatus(null) }}
        />
      </div>
    )
  }

  // Edit lead screen
  if (editLeadData !== null) {
    return (
      <div className="app-wrap" data-nav={navDir}>
        <EditLeadView
          lead={editLeadData}
          onSave={updateLead}
          onBack={() => { setNavDir('back'); setEditLeadData(null); setViewLeadId(editLeadData.id) }}
          onDelete={deleteLead}
        />
      </div>
    )
  }

  // View lead screen
  if (viewLeadId !== null) {
    const lead = leads.find(l => l.id === viewLeadId)
    if (!lead) { setViewLeadId(null); return null }
    return (
      <div className="app-wrap" data-nav={navDir}>
        <ViewLeadView
          lead={lead}
          onBack={() => { setNavDir('back'); setViewLeadId(null) }}
          onEdit={() => openEdit(lead)}
          onAddActivity={addActivity}
          onUpdateLead={updateLeadData}
        />
      </div>
    )
  }

  // Follow-up flow
  if (followUpFlow !== null) {
    return (
      <div className="app-wrap" data-nav={navDir}>
        <FollowUpFlowView
          flowLeads={followUpFlow}
          onUpdateLead={updateLeadData}
          onBack={() => { setNavDir('back'); setFollowUpFlow(null) }}
          onDone={() => { setNavDir('back'); setFollowUpFlow(null) }}
        />
      </div>
    )
  }

  // Main tabbed app
  return (
    <div className="app-wrap" data-nav={navDir}>
      <div className="screen">
        {activeTab === 'dashboard' && (
          <DashboardView
            {...viewProps}
            goToFollowUps={(leads) => { setNavDir('fwd'); setFollowUpFlow(leads) }}
            goToLeads={() => handleTabChange('leads')}
          />
        )}
        {activeTab === 'leads' && <LeadsView {...viewProps} />}
        {activeTab === 'followups' && <FollowUpsView {...viewProps} />}
        {activeTab === 'metrics' && <MetricsView leads={leads} />}
        {activeTab === 'profile' && <ProfileView />}
      </div>
      <BottomNav active={activeTab} onChange={handleTabChange} leads={leads} />
      {!['metrics', 'profile'].includes(activeTab) && (
        <div className="fab-container">
          <button
            className={`fab${fabVisible ? '' : ' fab-hidden'}${fabPopping ? ' fab--popping' : ''}`}
            onClick={handleFabClick}
            onAnimationEnd={() => setFabPopping(false)}
            aria-label="Add lead"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      )}
      {fastAddOpen && (
        <FastAddSheet onAdd={fastCreateLead} onClose={() => { setFastAddOpen(false); setFabPopping(false) }} />
      )}
      {fastAddConfirm && (
        <FastAddConfirm
          lead={fastAddConfirm}
          onAddDetails={() => { const l = fastAddConfirm; setFastAddConfirm(null); openEdit(l) }}
          onDismiss={() => setFastAddConfirm(null)}
        />
      )}
    </div>
  )
}
