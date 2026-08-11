import { Link } from "react-router-dom";
import "./MovieCard.css";

const FALLBACK_POSTER =
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500";

function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie.id}`} className="movie-card-link">
      <div className="movie-card">
        <div className="movie-image">
          <img
            src={movie.posterUrl || FALLBACK_POSTER}
            alt={movie.title}
            onError={(e) => {
              e.target.src = FALLBACK_POSTER;
            }}
          />
          <span className="rating">{movie.rating || "NR"}</span>
        </div>

        <h3>{movie.title}</h3>

        <p>
          {movie.genre} · {movie.durationMinutes}m
        </p>
      </div>
    </Link>
  );
}

export default MovieCard;
