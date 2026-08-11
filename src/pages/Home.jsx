import { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import MovieCard from "../components/MovieCard/MovieCard";
import movies from "../data/movies";
import "../styles/Home.css";
import hero from "../assets/hero.png";

function Home() {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

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
            placeholder="Search by title or director..."
            className="search-box"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="genres">
            <button
              className={selectedGenre === "All" ? "active" : ""}
              onClick={() => setSelectedGenre("All")}
            >
              All
            </button>

            <button
              className={selectedGenre === "Sci-Fi" ? "active" : ""}
              onClick={() => setSelectedGenre("Sci-Fi")}
            >
              Sci-Fi
            </button>

            <button
              className={selectedGenre === "Thriller" ? "active" : ""}
              onClick={() => setSelectedGenre("Thriller")}
            >
              Thriller
            </button>

            <button
              className={selectedGenre === "Drama" ? "active" : ""}
              onClick={() => setSelectedGenre("Drama")}
            >
              Drama
            </button>

            <button
              className={selectedGenre === "Action" ? "active" : ""}
              onClick={() => setSelectedGenre("Action")}
            >
              Action
            </button>

            <button
              className={selectedGenre === "Comedy" ? "active" : ""}
              onClick={() => setSelectedGenre("Comedy")}
            >
              Comedy
            </button>

            <button
              className={selectedGenre === "Horror" ? "active" : ""}
              onClick={() => setSelectedGenre("Horror")}
            >
              Horror
            </button>
          </div>
        </section>

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
