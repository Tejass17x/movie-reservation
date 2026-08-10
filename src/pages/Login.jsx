import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function handleLogin() {
    if (email.trim() === "") {
      setError("Email is required");
      return;
    }

    navigate("/");
  }
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Sign In</h1>

        <div className="tabs">
          <button className="active">Sign In</button>

          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>

        <label>EMAIL ADDRESS</label>

        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
        />

        {error && <p className="error">{error}</p>}

        <div className="demo-box">
          <p>Demo accounts — click to autofill:</p>

          <span>Member — Alex Rivera</span>

          <span>Admin — Morgan Adeyemi</span>
        </div>

        <button className="submit-btn" onClick={handleLogin}>
          Sign In
        </button>

        <Link to="/">
          <p className="cancel">Cancel</p>
        </Link>
      </div>
    </div>
  );
}

export default Login;
