import { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import MovieCard from "../components/MovieCard/MovieCard";
import api from "../utils/api.js";
import "../styles/Home.css";
import hero from "../assets/hero.png";

const GENRES = ["All", "Sci-Fi", "Thriller", "Drama", "Action", "Comedy", "Horror"];

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  useEffect(() => {
    let cancelled = false;

    const fetchMovies = async () => {
      try {
        const { data } = await api.get("/movies");
        if (!cancelled) setMovies(data);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.error || "Failed to load movies.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMovies();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesGenre =
      selectedGenre === "All" || movie.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <>
      <Navbar />

      <main className="home">
        <section
          className="hero"
          style={{
            backgroundImage: `linear-gradient(rgba(10,9,19,.75), rgba(10,9,19,.9)), url(${hero})`,
          }}
        >
          <p className="subtitle">NOW SHOWING</p>
          <h1>This Week's Films</h1>
        </section>

        <section className="search-filter">
          <input
            type="text"
            placeholder="Search by title..."
            className="search-box"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="genres">
            {GENRES.map((genre) => (
              <button
                key={genre}
                className={selectedGenre === genre ? "active" : ""}
                onClick={() => setSelectedGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </section>

        {loading && (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        )}

        {error && <p className="detail-error">{error}</p>}

        {!loading && !error && filteredMovies.length === 0 && (
          <p className="empty-showtimes">No films found.</p>
        )}

        <section className="movie-grid">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </section>
      </main>
    </>
  );
}

export default Home;
