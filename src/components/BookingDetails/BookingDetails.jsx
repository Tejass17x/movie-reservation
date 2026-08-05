import "./BookingDetails.css";
import { useContext } from "react";
import { BookingContext } from "../../context/BookingContext";

function BookingDetails() {

  const { selectedSeats, movie } = useContext(BookingContext);

  const subtotal = selectedSeats.length * movie.price;
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
        <strong>{movie.date} • {movie.time}</strong>
      </div>

      <div className="detail-row">
        <span>Seats</span>
        <strong>{selectedSeats.join(", ")}</strong>
      </div>

      <div className="detail-row">
        <span>Subtotal</span>
        <strong>${subtotal.toFixed(2)}</strong>
      </div>

      <div className="detail-row">
        <span>Service Fee</span>
        <strong>${serviceFee.toFixed(2)}</strong>
      </div>

      <hr />

      <div className="detail-row total">
        <span>Total Charged</span>
        <strong>${total.toFixed(2)}</strong>
      </div>

    </div>

  );
}

export default BookingDetails;