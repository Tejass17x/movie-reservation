import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  LayoutDashboard, 
  Film, 
  Clapperboard, 
  CalendarRange, 
  Ticket, 
  LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>Aurelia</h2>
        <span>Cinema Back Office</span>
      </div>

      <nav style={{ flex: 1 }}>
        <ul className="sidebar-menu">
          <li className="sidebar-item">
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink 
              to="/movies" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Film size={20} />
              <span>Movies</span>
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink 
              to="/theaters" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Clapperboard size={20} />
              <span>Theaters</span>
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink 
              to="/showtimes" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <CalendarRange size={20} />
              <span>Showtimes</span>
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink 
              to="/bookings" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Ticket size={20} />
              <span>Bookings</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      {user && (
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-username">{user.name}</div>
            <div className="sidebar-role">{user.role}</div>
          </div>
          <button className="btn btn-secondary btn-block btn-sm" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
