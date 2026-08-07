import { useEffect, useMemo, useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import ConfirmDialog from '../components/movies/ConfirmDialog'
import ShowtimeForm from '../components/showtimes/ShowtimeForm'
import '../styles/showtimes.css'

const STORAGE_KEY = 'showtimes_frontend_module_v1'
const seedShowtimes = [
  {
    id: 'st1',
    movie: 'Nebula Nights',
    theater: 'Grand Cinema Plaza',
    screen: 'Screen 1',
    date: '2025-12-05',
    startTime: '18:00',
    endTime: '21:00',
    language: 'English',
    format: 'IMAX',
    standardPrice: 15,
    vipPrice: 25,
    status: 'Active',
  },
  {
    id: 'st2',
    movie: 'Romance by the Lake',
    theater: 'Riverside Screens',
    screen: 'Screen 2',
    date: '2025-12-08',
    startTime: '20:00',
    endTime: '22:00',
    language: 'English',
    format: '2D',
    standardPrice: 12,
    vipPrice: 20,
    status: 'Upcoming',
  },
]

function loadShowtimes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedShowtimes
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : seedShowtimes
  } catch (error) {
    return seedShowtimes
  }
}

function saveShowtimes(showtimes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(showtimes))
}

export default function Showtimes() {
  const [showtimes, setShowtimes] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [movieFilter, setMovieFilter] = useState('')
  const [theaterFilter, setTheaterFilter] = useState('')
  const [screenFilter, setScreenFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirm, setConfirm] = useState(null)

  useEffect(() => {
    setLoading(true)
    const loaded = loadShowtimes()
    setShowtimes(loaded)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!loading) {
      saveShowtimes(showtimes)
    }
  }, [showtimes, loading])

  const movieOptions = useMemo(
    () => [...new Set(showtimes.map((item) => item.movie).filter(Boolean))],
    [showtimes],
  )
  const theaterOptions = useMemo(
    () => [...new Set(showtimes.map((item) => item.theater).filter(Boolean))],
    [showtimes],
  )
  const screenOptions = useMemo(
    () => [...new Set(showtimes.map((item) => item.screen).filter(Boolean))],
    [showtimes],
  )

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return showtimes.filter((item) => {
      const matchesQuery =
        term === '' ||
        item.movie.toLowerCase().includes(term) ||
        item.theater.toLowerCase().includes(term) ||
        item.screen.toLowerCase().includes(term)
      const matchesMovie = !movieFilter || item.movie === movieFilter
      const matchesTheater = !theaterFilter || item.theater === theaterFilter
      const matchesScreen = !screenFilter || item.screen === screenFilter
      const matchesDate = !dateFilter || item.date === dateFilter
      return matchesQuery && matchesMovie && matchesTheater && matchesScreen && matchesDate
    })
  }, [showtimes, query, movieFilter, theaterFilter, screenFilter, dateFilter])

  function handleAdd(payload) {
    const record = { id: `st${Date.now()}`, ...payload }
    setShowtimes((current) => [record, ...current])
    setShowForm(false)
  }

  function handleUpdate(id, payload) {
    setShowtimes((current) => current.map((item) => (item.id === id ? { ...item, ...payload } : item)))
    setEditing(null)
  }

  function handleDelete(id) {
    setShowtimes((current) => current.filter((item) => item.id !== id))
    setConfirm(null)
  }

  return (
    <div className="showtimes-page">
      <div className="showtimes-header">
        <div className="showtimes-filters">
          <input
            placeholder="Search movie, theater, or screen"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select value={movieFilter} onChange={(e) => setMovieFilter(e.target.value)}>
            <option value="">All Movies</option>
            {movieOptions.map((movie) => (
              <option key={movie} value={movie}>
                {movie}
              </option>
            ))}
          </select>
          <select value={theaterFilter} onChange={(e) => setTheaterFilter(e.target.value)}>
            <option value="">All Theaters</option>
            {theaterOptions.map((theater) => (
              <option key={theater} value={theater}>
                {theater}
              </option>
            ))}
          </select>
          <select value={screenFilter} onChange={(e) => setScreenFilter(e.target.value)}>
            <option value="">All Screens</option>
            {screenOptions.map((screen) => (
              <option key={screen} value={screen}>
                {screen}
              </option>
            ))}
          </select>
          <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
        </div>

        <button className="btn primary" onClick={() => setShowForm(true)}>
          <Plus /> Add Showtime
        </button>
      </div>

      <div className="showtimes-summary">
        Showing {filtered.length} of {showtimes.length} showtime{showtimes.length === 1 ? '' : 's'}
      </div>

      <div className="table-wrap">
        <table className="showtimes-table">
          <thead>
            <tr>
              <th>Movie</th>
              <th>Theater</th>
              <th>Screen</th>
              <th>Date</th>
              <th>Start</th>
              <th>End</th>
              <th>Language</th>
              <th>Format</th>
              <th>Standard</th>
              <th>VIP</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={12}>Loading showtimes...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={12}>No showtimes found.</td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id}>
                  <td>{item.movie}</td>
                  <td>{item.theater}</td>
                  <td>{item.screen}</td>
                  <td>{item.date}</td>
                  <td>{item.startTime}</td>
                  <td>{item.endTime}</td>
                  <td>{item.language}</td>
                  <td>{item.format}</td>
                  <td>${item.standardPrice}</td>
                  <td>${item.vipPrice}</td>
                  <td>{item.status}</td>
                  <td className="actions">
                    <button className="btn" onClick={() => setEditing(item)}>
                      <Edit />
                    </button>
                    <button className="btn danger" onClick={() => setConfirm(item)}>
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && <ShowtimeForm onClose={() => setShowForm(false)} onSubmit={handleAdd} />}
      {editing && (
        <ShowtimeForm showtime={editing} onClose={() => setEditing(null)} onSubmit={(data) => handleUpdate(editing.id, data)} />
      )}
      {confirm && (
        <ConfirmDialog
          title={`Delete showtime for ${confirm.movie}?`}
          onCancel={() => setConfirm(null)}
          onConfirm={() => handleDelete(confirm.id)}
        />
      )}
    </div>
  )
}
