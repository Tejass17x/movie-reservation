import { Link } from "react-router-dom";
import "../styles/Register.css";

function Register() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>

        <div className="tabs">
          <Link to="/login">
            <button>Sign In</button>
          </Link>

          <button className="active">Register</button>
        </div>

        <label>FULL NAME</label>
        <input type="text" placeholder="Your name" />

        <label>EMAIL ADDRESS</label>
        <input type="email" placeholder="you@example.com" />

        <label>ACCOUNT ROLE</label>

        <div className="role-buttons">
          <button className="active">Member</button>
          <button>Administrator</button>
        </div>

        <button className="submit-btn">
          Create Account
        </button>

        <Link to="/">
          <p className="cancel">Cancel</p>
        </Link>
      </div>
    </div>
  );
}

export default Register;