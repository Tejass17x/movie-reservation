export default function MovieDetailsModal({ movie, onClose, onEdit }) {
  if (!movie) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="movie-details" onClick={(e)=>e.stopPropagation()}>
        <div className="details-left">
          <div className="poster-large" style={{backgroundImage:`url(${movie.poster})`}} />
        </div>
        <div className="details-right">
          <h2>{movie.title}</h2>
          <div className="meta">{movie.genre} • {movie.language} • {movie.format}</div>
          <p>{movie.description}</p>
          <ul className="details-list">
            <li><strong>Duration:</strong> {movie.duration} min</li>
            <li><strong>Release:</strong> {movie.releaseDate}</li>
            <li><strong>Certificate:</strong> {movie.certificate}</li>
            <li><strong>Rating:</strong> {movie.rating ? `★ ${movie.rating} / 10` : '—'}</li>
            <li><strong>Status:</strong> {movie.status}</li>
          </ul>
          <div className="modal-actions">
            <button className="btn" onClick={()=>onEdit(movie)}>Edit</button>
            <a className="btn primary" href={movie.trailer || '#'} target="_blank" rel="noreferrer">Watch Trailer</a>
          </div>
        </div>
      </div>
    </div>
  )
}
