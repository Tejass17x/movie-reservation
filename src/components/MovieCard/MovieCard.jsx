import "./MovieCard.css";

function MovieCard({ movie }) {
  return (
    <div className="movie-card">
      <img src={movie.image} alt={movie.title} />

      <div className="movie-info">
        <span>{movie.rating}</span>
        <h3>{movie.title}</h3>
      </div>
    </div>
  );
}

export default MovieCard;