import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import '../styles/admin.css'

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // close mobile menu on navigation
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <div className="admin-root">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="main-area">
        <Topbar onToggle={() => setMobileOpen((s) => !s)} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
