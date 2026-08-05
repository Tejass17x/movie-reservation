import { useContext } from "react";
import { BookingContext } from "../../context/BookingContext";
function CountdownTimer() {
  const { timeLeft } = useContext(BookingContext);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 20px",
        border: "1px solid #d4a017",
        borderRadius: "10px",
        background: "#fff8e6",
        color: "#b7791f",
        fontWeight: "bold"
      }}
    >
      🕒 Seats held for{" "}
      {String(minutes).padStart(2, "0")}:
      {String(seconds).padStart(2, "0")}
    </div>
  );
}

export default CountdownTimer;