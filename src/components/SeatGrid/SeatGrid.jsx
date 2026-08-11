import "./SeatGrid.css";
import Seat from "../Seat/Seat";

function SeatGrid({ seats, screen, selectedSeats, toggleSeat }) {
  const rows = screen?.rows || 0;

  const rowLabels = Array.from({ length: rows }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  return (
    <div className="seat-grid">
      {rowLabels.map((row) => (
        <div key={row} className="seat-row">
          <span className="row-label">{row}</span>

          {seats
            .filter((seat) => seat.row === row)
            .map((seat) => (
              <Seat
                key={seat.id}
                seat={seat}
                isSelected={selectedSeats.includes(seat.id)}
                onClick={() => toggleSeat(seat.id)}
              />
            ))}
        </div>
      ))}
    </div>
  );
}

export default SeatGrid;
