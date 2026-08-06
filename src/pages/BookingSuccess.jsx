import Navbar from "../components/Navbar/Navbar";
import "../styles/BookingSuccess.css";
import BookingReference from "../components/BookingReference/BookingReference";
import BookingDetails from "../components/BookingDetails/BookingDetails";
import SuccessButtons from "../components/SuccessButtons/SuccessButtons";

function BookingSuccess() {
  const bookingId = Math.random()
    .toString(36)
    .substring(2, 10)
    .toUpperCase();

  return (

    <>
      <Navbar />

      <div className="success-page">

        <div className="success-card">

          <div className="success-icon">
            ✓
          </div>

          <h1>
            Booking Confirmed!
          </h1>
          <BookingReference
            bookingId={bookingId}
          />
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