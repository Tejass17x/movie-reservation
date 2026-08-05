import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        <span className="gold">CINÉ</span>VAULT
      </div>

      <div className="nav-links">
        <a href="/">Films</a>
        <a href="/my-bookings">My Bookings</a>
      </div>

      <div className="user-section">
        <div>
          <h4>Alex Rivera</h4>
          <span>Member</span>
        </div>

        <button>Sign out</button>
      </div>

    </nav>
  );
}

export default Navbar;