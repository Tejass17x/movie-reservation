import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const navigate = useNavigate();

  function handleRegister() {
    setNameError("");
    setEmailError("");

    let valid = true;

    if (name.trim() === "") {
      setNameError("Full name is required");
      valid = false;
    }

    if (email.trim() === "") {
      setEmailError("Email is required");
      valid = false;
    }

    if (!valid) return;

    navigate("/login");
  }
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
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setNameError("");
          }}
        />

        {nameError && <p className="error">{nameError}</p>}

        <label>EMAIL ADDRESS</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError("");
          }}
        />

        {emailError && <p className="error">{emailError}</p>}

        <label>ACCOUNT ROLE</label>

        <div className="role-buttons">
          <button
            type="button"
            className={role === "Member" ? "active" : ""}
            onClick={() => setRole("Member")}
          >
            Member
          </button>

          <button
            type="button"
            className={role === "Administrator" ? "active" : ""}
            onClick={() => setRole("Administrator")}
          >
            Administrator
          </button>
        </div>

        <button className="submit-btn" onClick={handleRegister}>
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
