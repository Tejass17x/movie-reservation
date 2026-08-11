import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import "../styles/Profile.css";

function Profile() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast("Logged out.", "success");
    navigate("/");
  };

  if (!user) return null;

  return (
    <>
      <Navbar />

      <main className="profile-page">
        <div className="profile-card">
          <h1>My Profile</h1>

          <div className="profile-field">
            <label>FULL NAME</label>
            <input type="text" value={user.name} readOnly />
          </div>

          <div className="profile-field">
            <label>EMAIL ADDRESS</label>
            <input type="email" value={user.email} readOnly />
          </div>

          <div className="profile-field">
            <label>ACCOUNT ROLE</label>
            <input type="text" value={user.role} readOnly />
          </div>

          <button onClick={handleLogout}>Logout</button>
        </div>
      </main>
    </>
  );
}

export default Profile;
