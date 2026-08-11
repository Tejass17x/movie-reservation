import "./BookingDetails.css";
import { useBooking } from "../../context/BookingContext";
import { formatDate, formatTime, formatCurrency } from "../../utils/format";

function BookingDetails() {
  const { selectedSeats, movie, showtime } = useBooking();

  if (!movie || !showtime) return null;

  const subtotal = selectedSeats.length * showtime.price;
  const serviceFee = subtotal * 0.05;
  const total = subtotal + serviceFee;

  return (
    <div className="booking-details">
      <div className="detail-row">
        <span>Film</span>
        <strong>{movie.title}</strong>
      </div>

      <div className="detail-row">
        <span>Date & Time</span>
        <strong>
          {formatDate(showtime.startTime)} • {formatTime(showtime.startTime)}
        </strong>
      </div>

      <div className="detail-row">
        <span>Seats</span>
        <strong>{selectedSeats.join(", ")}</strong>
      </div>

      <div className="detail-row">
        <span>Subtotal</span>
        <strong>{formatCurrency(subtotal)}</strong>
      </div>

      <div className="detail-row">
        <span>Service Fee</span>
        <strong>{formatCurrency(serviceFee)}</strong>
      </div>

      <hr />

      <div className="detail-row total">
        <span>Total Charged</span>
        <strong>{formatCurrency(total)}</strong>
      </div>
    </div>
  );
}

export default BookingDetails;
