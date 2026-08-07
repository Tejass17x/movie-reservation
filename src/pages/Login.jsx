import { Link } from "react-router-dom";
import "../styles/Login.css";

function Login() {
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
        />

        <div className="demo-box">
          <p>Demo accounts — click to autofill:</p>

          <span>Member — Alex Rivera</span>

          <span>Admin — Morgan Adeyemi</span>
        </div>

        <button className="submit-btn">
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