import "./BookingReference.css";

function BookingReference({ bookingId }) {
  return (
    <div className="booking-reference">

      <p className="reference-label">
        BOOKING REFERENCE
      </p>

      <h1 className="reference-id">
        {bookingId}
      </h1>

    </div>
  );
}

export default BookingReference;