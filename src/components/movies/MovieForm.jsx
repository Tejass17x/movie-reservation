import { useState, useRef } from 'react'

const GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Drama',
  'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller',
]

const LANGUAGES = [
  'English', 'Hindi', 'Telugu', 'Tamil', 'Kannada',
  'Malayalam', 'Bengali', 'Marathi', 'Punjabi', 'French', 'Spanish',
]

const CERTIFICATES = ['U', 'UA', 'PG', 'PG-13', 'R', 'A', 'S']
const FORMATS = ['2D', '3D', 'IMAX']
const STATUSES = ['Upcoming', 'Now Showing', 'Archived']

const empty = {
  title: '', description: '', genre: GENRES[0], language: LANGUAGES[0],
  duration: '', rating: '', releaseDate: '', certificate: CERTIFICATES[0],
  format: FORMATS[0], trailer: '', status: STATUSES[0],
}

export default function MovieForm({ movie, onClose, onSubmit }) {
  const [form, setForm] = useState(movie ? { ...movie } : empty)
  const [posterPreview, setPosterPreview] = useState(movie?.poster || '')
  const fileRef = useRef(null)

  function change(e) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target.result
      setPosterPreview(dataUrl)
      setForm((s) => ({ ...s, poster: dataUrl }))
    }
    reader.readAsDataURL(file)
  }

  function submit(e) {
    e.preventDefault()
    if (!form.title) return alert('Title required')
    onSubmit({ ...form })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="movie-form" onSubmit={submit} onClick={(e) => e.stopPropagation()}>
        <h3>{movie ? 'Edit Movie' : 'Add Movie'}</h3>

        {/* Poster Upload with Preview */}
        <div className="poster-upload" onClick={() => fileRef.current?.click()}>
          {posterPreview ? (
            <img src={posterPreview} alt="Poster preview" className="poster-preview" />
          ) : (
            <div className="poster-placeholder">
              <span className="upload-icon">+</span>
              <small>Upload Poster</small>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} hidden />
        </div>

        <label>Title<input name="title" value={form.title} onChange={change} /></label>
        <label>Description<textarea name="description" value={form.description} onChange={change} /></label>

        <div className="row">
          <label>Genre<select name="genre" value={form.genre} onChange={change}>{GENRES.map((g) => <option key={g}>{g}</option>)}</select></label>
          <label>Language<select name="language" value={form.language} onChange={change}>{LANGUAGES.map((l) => <option key={l}>{l}</option>)}</select></label>
        </div>

        <div className="row">
          <label>Duration (min)<input name="duration" value={form.duration} onChange={change} /></label>
          <label>Rating (0–10)<input type="number" min="0" max="10" step="0.1" name="rating" value={form.rating} onChange={change} /></label>
        </div>

        <div className="row">
          <label>Release Date<input type="date" name="releaseDate" value={form.releaseDate} onChange={change} /></label>
          <label>Certificate<select name="certificate" value={form.certificate} onChange={change}>{CERTIFICATES.map((c) => <option key={c}>{c}</option>)}</select></label>
        </div>

        <div className="row">
          <label>Format<select name="format" value={form.format} onChange={change}>{FORMATS.map((f) => <option key={f}>{f}</option>)}</select></label>
          <label>Status<select name="status" value={form.status} onChange={change}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></label>
        </div>

        <label>Trailer URL<input name="trailer" value={form.trailer} onChange={change} /></label>

        <div className="form-actions">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn primary">Save</button>
        </div>
      </form>
    </div>
  )
}
