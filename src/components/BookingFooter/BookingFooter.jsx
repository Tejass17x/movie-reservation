import "./BookingFooter.css";

function BookingFooter({
  selectedSeats,
  totalPrice,
  onContinue
}) {
  return (
    <div className="booking-footer">

      <div className="booking-info">

        <div>
          <p className="label">Selected Seat</p>

          <h2>
            {selectedSeats.length === 0
              ? "None"
              : selectedSeats.join(", ")}
          </h2>
        </div>

        <div>
          <p className="label">Total</p>

          <h2>${totalPrice}</h2>
        </div>

      </div>

      <button
        className="continue-btn"
        disabled={selectedSeats.length === 0}
        onClick={onContinue}
      >
        Continue →
      </button>

    </div>
  );
}

export default BookingFooter;