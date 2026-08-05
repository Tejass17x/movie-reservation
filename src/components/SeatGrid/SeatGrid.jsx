import "./SeatGrid.css";
import Seat from "../Seat/Seat";
import seatData from "../../data/seatData";

function SeatGrid({ selectedSeats, toggleSeat }) {

  const rows = ["A", "B", "C", "D", "E", "F", "G"];

  return (

    <div className="seat-grid">

      {rows.map((row) => (

        <div
          key={row}
          className="seat-row"
        >

          <span className="row-label">
            {row}
          </span>

          {seatData
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