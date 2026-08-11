import "./MovieCard.css";

function MovieCard({ movie }) {
  return (
    <div className="movie-card">
      <div className="movie-image">
        <img src={movie.image} alt={movie.title} />
        <span className="rating">{movie.rating}</span>
      </div>

      <h3>{movie.title}</h3>

      <p>
        {movie.genre} · {movie.duration}
      </p>
    </div>
  );
}

export default MovieCard;