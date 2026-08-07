import { Bell, Search, Menu } from 'lucide-react'

export default function Topbar({ onToggle, title = 'Dashboard' }) {
  return (
    <header className="topbar">
      <div className="left">
        <button className="hamburger" onClick={onToggle} aria-label="Open menu">
          <Menu />
        </button>
        <div className="page-title">{title}</div>
      </div>
      <div className="right">
        <button className="icon-btn">
          <Search />
        </button>
        <button className="icon-btn">
          <Bell />
        </button>
        <div className="avatar" aria-hidden />
      </div>
    </header>
  )
}
