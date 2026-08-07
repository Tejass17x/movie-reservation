import { NavLink } from 'react-router-dom'
import { Home, Film, MapPin, Tv, Calendar, Grid, Ticket, BarChart2, Settings, Menu } from 'lucide-react'

const links = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/movies', label: 'Movies', icon: Film },
  { to: '/theaters', label: 'Theaters', icon: MapPin },
  { to: '/screens', label: 'Screens', icon: Tv },
  { to: '/showtimes', label: 'Showtimes', icon: Calendar },
  { to: '/seats', label: 'Seat Configuration', icon: Grid },
  { to: '/bookings', label: 'Bookings', icon: Ticket },
  { to: '/analytics', label: 'Analytics', icon: BarChart2 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand">
          <div className="logo" />
          <div className="title">Cinema Admin</div>
        </div>
        <button className="close-btn" onClick={onClose} aria-label="Close">
          <Menu />
        </button>
      </div>

      <nav className="nav">
        {links.map((l) => {
          const Icon = l.icon
          return (
            <NavLink
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              key={l.to}
            >
              <span className="icon">
                <Icon size={18} />
              </span>
              <span className="label">{l.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <small>© Cinema</small>
      </div>
    </aside>
  )
}
