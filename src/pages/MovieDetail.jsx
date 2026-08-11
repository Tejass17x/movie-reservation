import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api.js";
import Navbar from "../components/Navbar/Navbar";
import { useBooking } from "../context/BookingContext";
import { formatDate, formatTime, formatCurrency } from "../utils/format";
import "../styles/MovieDetail.css";

const FALLBACK_POSTER =
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500";

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectMovieAndShowtime } = useBooking();

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const { data } = await api.get(`/movies/${id}/showtimes`);
        if (!cancelled) {
          setMovie(data.movie);
          setShowtimes(data.showtimes);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.error || "Failed to load movie details.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleBook = (showtime) => {
    selectMovieAndShowtime(movie, showtime);
    navigate("/seat-selection");
  };

  return (
    <>
      <Navbar />
      <main className="movie-detail">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {loading && (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        )}

        {error && <p className="detail-error">{error}</p>}

        {!loading && !error && movie && (
          <>
            <div className="detail-hero">
              <div className="detail-poster">
                <img
                  src={movie.posterUrl || FALLBACK_POSTER}
                  alt={movie.title}
                  onError={(e) => {
                    e.target.src = FALLBACK_POSTER;
                  }}
                />
              </div>

              <div className="detail-info">
                <span className="detail-rating">{movie.rating || "NR"}</span>
                <h1>{movie.title}</h1>
                <p className="detail-meta">
                  {movie.genre} · {movie.durationMinutes}m
                </p>
                {movie.description && (
                  <p className="detail-description">{movie.description}</p>
                )}
              </div>
            </div>

            <section className="showtimes-section">
              <h2>Select a Showtime</h2>

              {showtimes.length === 0 ? (
                <p className="empty-showtimes">
                  No upcoming showtimes for this film.
                </p>
              ) : (
                <div className="showtime-list">
                  {showtimes.map((showtime) => (
                    <div key={showtime.id} className="showtime-card">
                      <div className="showtime-date">
                        <span className="date-label">
                          {formatDate(showtime.startTime)}
                        </span>
                        <span className="time-label">
                          {formatTime(showtime.startTime)}
                        </span>
                      </div>

                      <div className="showtime-screen">
                        <strong>{showtime.screen.theater.name}</strong>
                        <span>{showtime.screen.name}</span>
                      </div>

                      <div className="showtime-price">
                        {formatCurrency(showtime.price)}
                      </div>

                      <button
                        className="book-btn"
                        onClick={() => handleBook(showtime)}
                      >
                        Book →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
}

export default MovieDetail;
