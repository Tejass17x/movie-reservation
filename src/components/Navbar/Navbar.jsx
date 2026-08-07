import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <span className="gold">CINÉ</span>VAULT
      </div>

      <div className="nav-links">
        <Link to="/">Films</Link>
      </div>

      <Link to="/login">
        <button className="signin-btn">Sign In</button>
      </Link>
    </nav>
  );
}

export default Navbar;
