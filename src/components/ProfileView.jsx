export default function ProfileView() {
  return (
    <div>
      <div className="page-header">
        <span className="page-title">Profile</span>
      </div>

      <div className="view-body">
        <div className="profile-avatar">
          <div className="avatar-circle">CG</div>
          <div className="avatar-name">Colin Gelinas</div>
          <div className="avatar-role">Sales Consultant</div>
        </div>

        <div className="section-block">
          <div className="section-header">Account</div>
          <div className="settings-row">
            <span>Dealership</span>
            <span className="settings-value">My Dealership</span>
          </div>
          <div className="settings-row">
            <span>Email</span>
            <span className="settings-value">colin.gelinas1@gmail.com</span>
          </div>
          <div className="settings-row">
            <span>Role</span>
            <span className="settings-value">Sales Consultant</span>
          </div>
        </div>

        <div className="section-block">
          <div className="section-header">Preferences</div>
          <div className="settings-row settings-toggle">
            <span>Push Notifications</span>
            <div className="toggle active" />
          </div>
          <div className="settings-row settings-toggle">
            <span>Follow-up Reminders</span>
            <div className="toggle active" />
          </div>
          <div className="settings-row settings-toggle">
            <span>Daily Summary</span>
            <div className="toggle" />
          </div>
        </div>

        <div className="section-block">
          <div className="section-header">App</div>
          <div className="settings-row">
            <span>Version</span>
            <span className="settings-value">1.0.0</span>
          </div>
          <div className="settings-row">
            <span>Data</span>
            <span className="settings-value">Local only</span>
          </div>
        </div>

        <button className="btn-secondary-full">Sign Out</button>
      </div>
    </div>
  )
}
