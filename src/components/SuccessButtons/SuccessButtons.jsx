import "./SuccessButtons.css";
import { useNavigate } from "react-router-dom";

function SuccessButtons() {

  const navigate = useNavigate();

  return (

    <div className="success-buttons">

      <button
        className="my-bookings-btn"
        onClick={() => navigate("/my-bookings")}
      >
        My Bookings
      </button>

      <button
        className="browse-btn"
        onClick={() => navigate("/")}
      >
        Browse Films
      </button>

    </div>

  );

}

export default SuccessButtons;