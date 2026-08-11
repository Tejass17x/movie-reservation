import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <span className="gold">CINÉ</span>VAULT
      </div>

      <div className="nav-links">
        <Link to="/">Films</Link>
      </div>

      {isAuthenticated && user ? (
        <div className="user-section">
          <Link to="/my-bookings" className="user-link">
            My Bookings
          </Link>
          <Link to="/profile" className="user-link">
            Profile
          </Link>
          <div className="user-meta">
            <h4>{user.name}</h4>
            <span>{user.role}</span>
          </div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="user-section">
          <Link to="/register" className="user-link">
            Register
          </Link>
          <Link to="/login" className="signin-link">
            <button className="signin-btn">Sign In</button>
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
