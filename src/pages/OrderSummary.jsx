import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import CountdownTimer from "../components/CountdownTimer/CountdownTimer";
import Navbar from "../components/Navbar/Navbar";
import { formatDate, formatTime, formatCurrency } from "../utils/format";
import "../styles/OrderSummary.css";

const FALLBACK_POSTER =
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500";

function OrderSummary() {
  const { selectedSeats, movie, showtime } = useBooking();
  const navigate = useNavigate();

  if (!movie || !showtime) {
    return (
      <>
        <Navbar />
        <div className="order-summary">
          <p className="edit-link" onClick={() => navigate("/")}>
            ← Browse Films
          </p>
        </div>
      </>
    );
  }

  const subtotal = selectedSeats.length * showtime.price;
  const serviceFee = subtotal * 0.05;
  const total = subtotal + serviceFee;

  return (
    <>
      <Navbar />

      <div className="order-summary">
        <p className="edit-link" onClick={() => navigate("/seat-selection")}>
          ← Edit Seats
        </p>

        <div className="summary-header">
          <h1>Order Summary</h1>
          <CountdownTimer />
        </div>

        <div className="summary-card">
          <div className="movie-info">
            <img
              src={movie.posterUrl || FALLBACK_POSTER}
              alt={movie.title}
              className="movie-poster"
              onError={(e) => {
                e.target.src = FALLBACK_POSTER;
              }}
            />

            <div className="movie-details">
              <h2>{movie.title}</h2>
              <p>{showtime.screen.theater.name}</p>
              <p>
                {formatDate(showtime.startTime)} • {formatTime(showtime.startTime)}
              </p>
            </div>
          </div>

          <hr />

          <div className="price-details">
            <div>
              <span>Seats</span>
              <span>{selectedSeats.join(", ")}</span>
            </div>

            <div className="summary-row">
              <span>
                {selectedSeats.length} × {formatCurrency(showtime.price)}
              </span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            <div>
              <span>Service Fee</span>
              <span>{formatCurrency(serviceFee)}</span>
            </div>

            <div className="total-row">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <button
            className="payment-btn"
            onClick={() => navigate("/payment")}
          >
            Proceed to Payment →
          </button>
        </div>
      </div>
    </>
  );
}

export default OrderSummary;
