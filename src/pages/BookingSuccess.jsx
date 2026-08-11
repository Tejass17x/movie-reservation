import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import "../styles/BookingSuccess.css";
import BookingReference from "../components/BookingReference/BookingReference";
import BookingDetails from "../components/BookingDetails/BookingDetails";
import SuccessButtons from "../components/SuccessButtons/SuccessButtons";
import { useBooking } from "../context/BookingContext";

function BookingSuccess() {
  const { lastBooking } = useBooking();

  // Context is lost after a hard refresh on this page
  if (!lastBooking) {
    return <Navigate to="/" replace />;
  }

  const bookingId = `#BK-${String(lastBooking.id).padStart(5, "0")}`;

  return (
    <>
      <Navbar />

      <div className="success-page">
        <div className="success-card">
          <div className="success-icon">✓</div>

          <h1>Booking Confirmed!</h1>

          <BookingReference bookingId={bookingId} />

          <BookingDetails />

          <p className="success-text">
            Your tickets have been successfully booked.
          </p>

          <SuccessButtons />
        </div>
      </div>
    </>
  );
}

export default BookingSuccess;
