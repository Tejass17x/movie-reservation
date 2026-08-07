import { useState } from 'react'
import { Edit, Trash2, Eye } from 'lucide-react'

function Poster({ src, alt }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div
        className="poster poster-fallback"
        title={alt}
        aria-label={alt}
      />
    )
  }
  return (
    <img
      className="poster"
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  )
}

export default function MovieList({ movies, loading, onView, onEdit, onDelete }) {
  if (loading) return <div className="movies-empty">Loading...</div>
  if (!movies || movies.length === 0) return <div className="movies-empty">No movies found.</div>

  return (
    <div className="movie-grid">
      {movies.map((m) => (
        <div className="movie-card" key={m.id}>
          <Poster src={m.poster} alt={m.title} />
          <div className="info">
            <div className="title-row">
              <h4>{m.title}</h4>
              {m.rating ? <span className="rating-badge">★ {m.rating}</span> : null}
            </div>
            <div className="meta">{m.genre} • {m.language} • {m.format}</div>
            <p className="desc">{m.description}</p>
            <div className="card-actions">
              <button className="btn" onClick={()=>onView(m)}><Eye /></button>
              <button className="btn" onClick={()=>onEdit(m)}><Edit /></button>
              <button className="btn danger" onClick={()=>onDelete(m)}><Trash2 /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
