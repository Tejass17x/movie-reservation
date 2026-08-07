import { useState, useEffect } from 'react'
import { Save, Moon, Sun, Eye, Lock, Bell, Mail, Smartphone, CreditCard, Globe, Clock, Percent } from 'lucide-react'
import '../styles/settings.css'

const SETTINGS_KEY = 'admin_settings_v1'

const defaults = {
  general: {
    cinemaName: 'Grand Cinema',
    address: '123 Main Street, Metropolis, CA 90210',
    phone: '+1-555-123-4567',
    email: 'info@grandcinema.com',
    website: 'www.grandcinema.com',
  },
  cinemaInfo: {
    timezone: 'America/New_York',
    currency: 'USD',
    taxRate: '8.5',
    bookingFee: '2.50',
  },
  bookingSettings: {
    advanceBookingDays: '30',
    cancellationPolicy: 'flexible',
    maxTicketsPerBooking: '10',
    enableOnlineBooking: true,
    enableSeatSelection: true,
  },
  notificationSettings: {
    emailNotifications: true,
    smsAlerts: false,
    marketingEmails: false,
    bookingConfirmation: true,
    cancellationAlerts: true,
    promotionalOffers: false,
  },
  appearance: {
    theme: 'dark',
    compactView: false,
    reducedMotion: false,
  },
  account: {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
  },
}

function loadAll() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return JSON.parse(JSON.stringify(defaults))
    const parsed = JSON.parse(raw)
    // merge so any new keys in defaults are picked up
    return {
      general: { ...defaults.general, ...parsed.general },
      cinemaInfo: { ...defaults.cinemaInfo, ...parsed.cinemaInfo },
      bookingSettings: { ...defaults.bookingSettings, ...parsed.bookingSettings },
      notificationSettings: { ...defaults.notificationSettings, ...parsed.notificationSettings },
      appearance: { ...defaults.appearance, ...parsed.appearance },
      account: { ...defaults.account, ...parsed.account },
    }
  } catch {
    return JSON.parse(JSON.stringify(defaults))
  }
}

function saveAll(data) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(data))
}

export default function Settings() {
  const stored = loadAll()
  const [general, setGeneral] = useState(stored.general)
  const [cinemaInfo, setCinemaInfo] = useState(stored.cinemaInfo)
  const [bookingSettings, setBookingSettings] = useState(stored.bookingSettings)
  const [notificationSettings, setNotificationSettings] = useState(stored.notificationSettings)
  const [appearance, setAppearance] = useState(stored.appearance)
  const [account, setAccount] = useState(stored.account)
  const [saved, setSaved] = useState(false)
  const [activeSection, setActiveSection] = useState('general')

  // Persist whenever any settings group changes
  useEffect(() => {
    saveAll({ general, cinemaInfo, bookingSettings, notificationSettings, appearance, account })
  }, [general, cinemaInfo, bookingSettings, notificationSettings, appearance, account])

  function handleSave() {
    saveAll({ general, cinemaInfo, bookingSettings, notificationSettings, appearance, account })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const sections = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'cinema', label: 'Cinema Info', icon: CreditCard },
    { id: 'booking', label: 'Booking', icon: Clock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Eye },
    { id: 'account', label: 'Account', icon: Lock },
  ]

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div>
          <h2>Settings</h2>
          <p className="settings-subtitle">Manage your cinema administration preferences</p>
        </div>
        <button className="btn primary" onClick={handleSave}>
          <Save size={16} /> Save Changes
        </button>
      </div>

      {saved && <div className="toast success">Settings saved successfully!</div>}

      <div className="settings-layout">
        <nav className="settings-nav">
          {sections.map((sec) => {
            const Icon = sec.icon
            return (
              <button
                key={sec.id}
                className={`settings-nav-item ${activeSection === sec.id ? 'active' : ''}`}
                onClick={() => setActiveSection(sec.id)}
              >
                <Icon size={16} />
                <span>{sec.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="settings-content">
          {/* General Settings */}
          {activeSection === 'general' && (
            <div className="settings-section">
              <h3>General Settings</h3>
              <div className="settings-form">
                <div className="form-group">
                  <label>Cinema Name</label>
                  <input
                    type="text"
                    value={general.cinemaName}
                    onChange={(e) => setGeneral({ ...general, cinemaName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={general.address}
                    onChange={(e) => setGeneral({ ...general, address: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      value={general.phone}
                      onChange={(e) => setGeneral({ ...general, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={general.email}
                      onChange={(e) => setGeneral({ ...general, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    value={general.website}
                    onChange={(e) => setGeneral({ ...general, website: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Cinema Information */}
          {activeSection === 'cinema' && (
            <div className="settings-section">
              <h3>Cinema Information</h3>
              <div className="settings-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Timezone</label>
                    <select
                      value={cinemaInfo.timezone}
                      onChange={(e) => setCinemaInfo({ ...cinemaInfo, timezone: e.target.value })}
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Asia/Kolkata">India Standard Time (IST)</option>
                      <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Currency</label>
                    <select
                      value={cinemaInfo.currency}
                      onChange={(e) => setCinemaInfo({ ...cinemaInfo, currency: e.target.value })}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Tax Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={cinemaInfo.taxRate}
                      onChange={(e) => setCinemaInfo({ ...cinemaInfo, taxRate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Booking Fee ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={cinemaInfo.bookingFee}
                      onChange={(e) => setCinemaInfo({ ...cinemaInfo, bookingFee: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Booking Settings */}
          {activeSection === 'booking' && (
            <div className="settings-section">
              <h3>Booking Settings</h3>
              <div className="settings-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Advance Booking Days</label>
                    <input
                      type="number"
                      value={bookingSettings.advanceBookingDays}
                      onChange={(e) => setBookingSettings({ ...bookingSettings, advanceBookingDays: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Max Tickets Per Booking</label>
                    <input
                      type="number"
                      value={bookingSettings.maxTicketsPerBooking}
                      onChange={(e) => setBookingSettings({ ...bookingSettings, maxTicketsPerBooking: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Cancellation Policy</label>
                  <select
                    value={bookingSettings.cancellationPolicy}
                    onChange={(e) => setBookingSettings({ ...bookingSettings, cancellationPolicy: e.target.value })}
                  >
                    <option value="flexible">Flexible (Free cancellation up to 24h before)</option>
                    <option value="moderate">Moderate (50% refund up to 24h before)</option>
                    <option value="strict">Strict (No cancellations)</option>
                  </select>
                </div>
                <div className="toggle-group">
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-label">Enable Online Booking</span>
                      <span className="toggle-desc">Allow customers to book tickets online</span>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={bookingSettings.enableOnlineBooking}
                        onChange={(e) => setBookingSettings({ ...bookingSettings, enableOnlineBooking: e.target.checked })}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </div>
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-label">Enable Seat Selection</span>
                      <span className="toggle-desc">Let customers choose specific seats</span>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={bookingSettings.enableSeatSelection}
                        onChange={(e) => setBookingSettings({ ...bookingSettings, enableSeatSelection: e.target.checked })}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeSection === 'notifications' && (
            <div className="settings-section">
              <h3>Notification Settings</h3>
              <div className="settings-form">
                <div className="toggle-group">
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-label">
                        <Mail size={16} /> Email Notifications
                      </span>
                      <span className="toggle-desc">Receive email notifications for bookings</span>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailNotifications}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </div>
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-label">
                        <Smartphone size={16} /> SMS Alerts
                      </span>
                      <span className="toggle-desc">Send SMS alerts for booking updates</span>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notificationSettings.smsAlerts}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, smsAlerts: e.target.checked })}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </div>
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-label">
                        <Bell size={16} /> Booking Confirmation
                      </span>
                      <span className="toggle-desc">Send confirmation when booking is made</span>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notificationSettings.bookingConfirmation}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, bookingConfirmation: e.target.checked })}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </div>
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-label">
                        <XCircle size={16} /> Cancellation Alerts
                      </span>
                      <span className="toggle-desc">Notify on booking cancellations</span>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notificationSettings.cancellationAlerts}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, cancellationAlerts: e.target.checked })}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </div>
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-label">
                        <Mail size={16} /> Marketing Emails
                      </span>
                      <span className="toggle-desc">Receive promotional offers and updates</span>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notificationSettings.marketingEmails}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, marketingEmails: e.target.checked })}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </div>
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-label">
                        <Percent size={16} /> Promotional Offers
                      </span>
                      <span className="toggle-desc">Get notified about special promotions</span>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notificationSettings.promotionalOffers}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, promotionalOffers: e.target.checked })}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeSection === 'appearance' && (
            <div className="settings-section">
              <h3>Appearance</h3>
              <div className="settings-form">
                <div className="toggle-group">
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-label">
                        <Moon size={16} /> Dark Theme
                      </span>
                      <span className="toggle-desc">Use dark color scheme (recommended)</span>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={appearance.theme === 'dark'}
                        onChange={(e) => setAppearance({ ...appearance, theme: e.target.checked ? 'dark' : 'light' })}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </div>
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-label">
                        <Sun size={16} /> Compact View
                      </span>
                      <span className="toggle-desc">Reduce spacing for a denser layout</span>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={appearance.compactView}
                        onChange={(e) => setAppearance({ ...appearance, compactView: e.target.checked })}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </div>
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-label">
                        <Eye size={16} /> Reduced Motion
                      </span>
                      <span className="toggle-desc">Minimize animations and transitions</span>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={appearance.reducedMotion}
                        onChange={(e) => setAppearance({ ...appearance, reducedMotion: e.target.checked })}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account / Security */}
          {activeSection === 'account' && (
            <div className="settings-section">
              <h3>Account & Security</h3>
              <div className="settings-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={account.currentPassword}
                    onChange={(e) => setAccount({ ...account, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      value={account.newPassword}
                      onChange={(e) => setAccount({ ...account, newPassword: e.target.value })}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      value={account.confirmPassword}
                      onChange={(e) => setAccount({ ...account, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                <div className="toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-label">
                      <Lock size={16} /> Two-Factor Authentication
                    </span>
                    <span className="toggle-desc">Add an extra layer of security to your account</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={account.twoFactorEnabled}
                      onChange={(e) => setAccount({ ...account, twoFactorEnabled: e.target.checked })}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
