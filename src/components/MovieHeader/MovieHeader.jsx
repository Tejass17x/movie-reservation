import "./MovieHeader.css";

function MovieHeader({ movie }) {
  return (
    <div className="movie-header">

      <button className="back-btn">
        ← Back
      </button>

      <h1>{movie.title}</h1>

      <p>
        {movie.theatre}
        <span> • </span>

        {movie.date}

        <span> • </span>

        {movie.time}

        <span className="price">
          {" "}• ${movie.price} / seat
        </span>

      </p>

    </div>
  );
}

export default MovieHeader;