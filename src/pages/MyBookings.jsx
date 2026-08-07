import Navbar from "../components/Navbar/Navbar";
import "../styles/MyBookings.css";

function MyBookings() {
  return (
    <>
      <Navbar />

      <main className="bookings-page">
        <h1>My Bookings</h1>

        <div className="empty-state">
          <h2>No bookings yet</h2>
          <p>Browse films and reserve your seats.</p>
        </div>
      </main>
    </>
  );
}

export default MyBookings;