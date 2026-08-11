import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api.js";
import Navbar from "../components/Navbar/Navbar";
import { useToast } from "../context/ToastContext";
import { formatDate, formatTime, formatCurrency } from "../utils/format";
import "../styles/MyBookings.css";

const FALLBACK_POSTER =
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchBookings = async () => {
    try {
      const { data } = await api.get("/my/bookings");
      setBookings(data);
    } catch (err) {
      showToast(
        err.response?.data?.error || "Failed to load bookings.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (id) => {
    try {
      await api.delete(`/bookings/${id}`);
      showToast("Booking cancelled.", "success");
      fetchBookings();
    } catch (err) {
      showToast(
        err.response?.data?.error || "Failed to cancel booking.",
        "error"
      );
    }
  };

  return (
    <>
      <Navbar />

      <main className="bookings-page">
        <h1>My Bookings</h1>

        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <h2>No bookings yet</h2>
            <p>Browse films and reserve your seats.</p>
            <Link to="/" className="browse-link">
              Browse Films
            </Link>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => {
              const showtime = booking.showtime;
              const seats = booking.bookingSeats
                .map((s) => s.seatLabel)
                .join(", ");

              return (
                <div key={booking.id} className="booking-card">
                  <img
                    src={showtime.movie.posterUrl || FALLBACK_POSTER}
                    alt={showtime.movie.title}
                    className="booking-poster"
                    onError={(e) => {
                      e.target.src = FALLBACK_POSTER;
                    }}
                  />

                  <div className="booking-card-info">
                    <h2>{showtime.movie.title}</h2>
                    <p>
                      {formatDate(showtime.startTime)} •{" "}
                      {formatTime(showtime.startTime)}
                    </p>
                    <p>
                      {showtime.screen.theater.name} • {showtime.screen.name}
                    </p>
                    <p className="booking-seats">Seats: {seats}</p>

                    <span className={`status-badge ${booking.status}`}>
                      {booking.status}
                    </span>

                    <p className="booking-ref">
                      Ref: #BK-{String(booking.id).padStart(5, "0")}
                    </p>
                  </div>

                  <div className="booking-card-side">
                    <p className="booking-total">
                      {formatCurrency(booking.totalCost)}
                    </p>

                    {booking.status === "held" && (
                      <button
                        className="cancel-btn"
                        onClick={() => cancelBooking(booking.id)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}

export default MyBookings;
