import Navbar from "../components/Navbar/Navbar";
import "../styles/Profile.css";

function Profile() {
  return (
    <>
      <Navbar />

      <main className="profile-page">
        <div className="profile-card">
          <h1>My Profile</h1>

          <div className="profile-field">
            <label>FULL NAME</label>
            <input type="text" value="Alex Rivera" readOnly />
          </div>

          <div className="profile-field">
            <label>EMAIL ADDRESS</label>
            <input type="email" value="alex@example.com" readOnly />
          </div>

          <div className="profile-field">
            <label>ACCOUNT ROLE</label>
            <input type="text" value="Member" readOnly />
          </div>

          <button>Edit Profile</button>
        </div>
      </main>
    </>
  );
}

export default Profile;