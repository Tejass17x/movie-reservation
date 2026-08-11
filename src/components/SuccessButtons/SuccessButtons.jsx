import "./SuccessButtons.css";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../../context/BookingContext";

function SuccessButtons() {
  const navigate = useNavigate();
  const { clearBooking } = useBooking();

  const goTo = (path) => {
    clearBooking();
    navigate(path);
  };

  return (
    <div className="success-buttons">
      <button
        className="my-bookings-btn"
        onClick={() => goTo("/my-bookings")}
      >
        My Bookings
      </button>

      <button className="browse-btn" onClick={() => goTo("/")}>
        Browse Films
      </button>
    </div>
  );
}

export default SuccessButtons;
