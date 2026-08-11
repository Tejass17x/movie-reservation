import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useState } from "react";
import api from "../utils/api.js";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import "../styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const from = location.state?.from?.pathname || "/";

  const handleLogin = async () => {
    setError("");
    if (!email.trim() || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data.token, data.user);
      showToast(`Welcome back, ${data.user.name}!`, "success");
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

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

        <label>PASSWORD</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
        />

        {error && <p className="error">{error}</p>}

        <div className="demo-box">
          <p>Demo account — click to autofill:</p>

          <span
            onClick={() => {
              setEmail("alice@gmail.com");
              setPassword("user123");
              setError("");
            }}
          >
            Member — Alice Smith
          </span>
        </div>

        <button className="submit-btn" onClick={handleLogin} disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <Link to="/">
          <p className="cancel">Cancel</p>
        </Link>
      </div>
    </div>
  );
}

export default Login;
