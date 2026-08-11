import { useNavigate } from "react-router-dom";
import { formatDate, formatTime, formatCurrency } from "../../utils/format";
import "./MovieHeader.css";

function MovieHeader({ movie, showtime }) {
  const navigate = useNavigate();

  const theaterName = showtime?.screen?.theater?.name || "";
  const screenName = showtime?.screen?.name || "";

  return (
    <div className="movie-header">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h1>{movie.title}</h1>

      <p>
        {theaterName}
        {screenName && (
          <>
            <span> • </span>
            {screenName}
          </>
        )}
        <span> • </span>
        {formatDate(showtime.startTime)}
        <span> • </span>
        {formatTime(showtime.startTime)}
        <span className="price"> • {formatCurrency(showtime.price)} / seat</span>
      </p>
    </div>
  );
}

export default MovieHeader;
