import Navbar from "../components/Navbar/Navbar";
import MovieCard from "../components/MovieCard/MovieCard";
import movies from "../data/movies";
import "../styles/Home.css";
import hero from "../assets/hero.png";

function Home() {
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
          />

          <div className="genres">
            <button className="active">All</button>
            <button>Sci-Fi</button>
            <button>Thriller</button>
            <button>Drama</button>
            <button>Action</button>
            <button>Comedy</button>
            <button>Horror</button>
          </div>
        </section>

        <section className="movie-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </section>
      </main>
    </>
  );
}

export default Home;
