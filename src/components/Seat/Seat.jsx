import "./Seat.css";

function Seat({ seat, isSelected, onClick }) {
 
  let status = seat.status;

  if (isSelected) {
    status = "selected";
  }

  const canClick =
    seat.status === "available" || isSelected;

  return (
    <button
      className={`seat ${status}`}
      onClick={canClick ? onClick : undefined}
    />
  );

}

export default Seat;