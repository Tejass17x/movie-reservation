import { useState } from "react";
import SeatGrid from "../components/SeatGrid/SeatGrid";
import SeatLegend from "../components/SeatLegend/SeatLegend";
import { useContext } from "react";
import { BookingContext } from "../context/BookingContext";
import { useNavigate } from "react-router-dom";
import "../styles/SeatSelection.css";
import Navbar from "../components/Navbar/Navbar";
import MovieHeader from "../components/MovieHeader/MovieHeader";
import BookingFooter from "../components/BookingFooter/BookingFooter";
import CountdownTimer from "../components/CountdownTimer/CountdownTimer";
import ScreenCurve from "../components/ScreenCurve/ScreenCurve";


function SeatSelection() {

  // Stores all selected seats
  const { selectedSeats, setSelectedSeats, movie } =
  useContext(BookingContext);

const navigate = useNavigate();

  // Runs whenever a seat is clicked
  const toggleSeat = (seatId) => {

    if (selectedSeats.includes(seatId)) {

      // Remove seat if already selected
      setSelectedSeats(
        selectedSeats.filter((seat) => seat !== seatId)
      );

    } else {

      // Add seat if not selected
      setSelectedSeats([
        ...selectedSeats,
        seatId
      ]);

    }

  };

  return (
    <>
    <Navbar />
    <div className="seat-selection">
  
      <div className="movie-header">
      <MovieHeader movie={movie}/>
      </div>
  
      <ScreenCurve />
      <SeatGrid
        selectedSeats={selectedSeats}
        toggleSeat={toggleSeat}
      />
  
      <SeatLegend />
  
      <div className="booking-info">

  <div className="booking-left">

    {selectedSeats.length === 0 ? (

      <p className="footer-message">
        Click seats to select them
      </p>

    ) : (

      <>
        <h3>
          {selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""}:{" "}
          <span>{selectedSeats.join(", ")}</span>
        </h3>

        <p>
          Total:
          <span> ${selectedSeats.length * movie.price}</span>
        </p>
      </>

    )}

  </div>

  <button
    className="continue-btn"
    disabled={selectedSeats.length === 0}
    onClick={() => navigate("/order-summary")}
  >
    Continue →
  </button>

</div>
    </div>
    </>
  );
}

export default SeatSelection;