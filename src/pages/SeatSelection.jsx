import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import { useBooking } from "../context/BookingContext";
import { useToast } from "../context/ToastContext";
import Navbar from "../components/Navbar/Navbar";
import MovieHeader from "../components/MovieHeader/MovieHeader";
import SeatGrid from "../components/SeatGrid/SeatGrid";
import SeatLegend from "../components/SeatLegend/SeatLegend";
import CountdownTimer from "../components/CountdownTimer/CountdownTimer";
import ScreenCurve from "../components/ScreenCurve/ScreenCurve";
import "../styles/SeatSelection.css";

function SeatSelection() {
  const {
    movie,
    showtime,
    selectedSeats,
    toggleSeat,
    setSelectedSeats,
    placeHold,
    timeLeft,
  } = useBooking();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [seats, setSeats] = useState([]);
  const [screen, setScreen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [holding, setHolding] = useState(false);

  const fetchSeats = useCallback(async () => {
    if (!showtime) return;
    try {
      const { data } = await api.get(`/showtimes/${showtime.id}/seats`);
      setSeats(data.seats);
      setScreen(data.showtime.screen);
      // Preserve the user's existing hold if no new selection yet
      setSelectedSeats((prev) =>
        prev.length > 0 ? prev : data.mySeats || []
      );
    } catch (err) {
      showToast(
        err.response?.data?.error || "Failed to load seats.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [showtime, setSelectedSeats, showToast]);

  useEffect(() => {
    if (!showtime) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchSeats();
  }, [fetchSeats, showtime]);

  const handleContinue = async () => {
    if (selectedSeats.length === 0) return;
    setHolding(true);
    try {
      await placeHold();
      navigate("/order-summary");
    } catch (err) {
      const msg =
        err.response?.data?.error || err.message || "Unable to hold seats.";
      showToast(msg, "error");
      setSelectedSeats([]);
      fetchSeats();
    } finally {
      setHolding(false);
    }
  };

  if (!movie || !showtime) {
    return (
      <>
        <Navbar />
        <div className="seat-selection">
          <p className="footer-message">
            No movie or showtime selected.{" "}
            <Link to="/">Browse films</Link> to book seats.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="seat-selection">
        <MovieHeader movie={movie} showtime={showtime} />

        <ScreenCurve />

        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <SeatGrid
            seats={seats}
            screen={screen}
            selectedSeats={selectedSeats}
            toggleSeat={toggleSeat}
          />
        )}

        <SeatLegend />

        <div className="booking-info">
          <div className="booking-left">
            {timeLeft > 0 && <CountdownTimer />}

            {selectedSeats.length === 0 ? (
              <p className="footer-message">Click seats to select them</p>
            ) : (
              <>
                <h3>
                  {selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""}:
                  <span> {selectedSeats.join(", ")}</span>
                </h3>
                <p>
                  Total:
                  <span> ${(selectedSeats.length * showtime.price).toFixed(2)}</span>
                </p>
              </>
            )}
          </div>

          <button
            className="continue-btn"
            disabled={selectedSeats.length === 0 || holding}
            onClick={handleContinue}
          >
            {holding ? "Holding..." : "Continue →"}
          </button>
        </div>
      </div>
    </>
  );
}

export default SeatSelection;
