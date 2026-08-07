import { useEffect, useMemo, useState } from 'react'
import { Search, Eye, XCircle, CheckCircle, Clock } from 'lucide-react'
import { getBookings, updateBooking } from '../api/bookings'
import '../styles/bookings.css'

const statusColors = {
  Confirmed: 'badge-success',
  Pending: 'badge-warning',
  Cancelled: 'badge-danger',
  Refunded: 'badge-info',
}

export default function Bookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [movieFilter, setMovieFilter] = useState('')
  const [theaterFilter, setTheaterFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')

  useEffect(() => {
    setLoading(true)
    getBookings().then((res) => {
      setBookings(res)
      setLoading(false)
    })
  }, [])

  const movieOptions = useMemo(
    () => [...new Set(bookings.map((b) => b.movie).filter(Boolean))],
    [bookings]
  )
  const theaterOptions = useMemo(
    () => [...new Set(bookings.map((b) => b.theater).filter(Boolean))],
    [bookings]
  )

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return bookings.filter((b) => {
      const matchesQuery =
        term === '' ||
        b.bookingId.toLowerCase().includes(term) ||
        b.movie.toLowerCase().includes(term) ||
        b.customer.toLowerCase().includes(term) ||
        b.theater.toLowerCase().includes(term)
      const matchesStatus = !statusFilter || b.status === statusFilter
      const matchesMovie = !movieFilter || b.movie === movieFilter
      const matchesTheater = !theaterFilter || b.theater === theaterFilter
      const matchesDate = !dateFilter || b.date === dateFilter
      return matchesQuery && matchesStatus && matchesMovie && matchesTheater && matchesDate
    })
  }, [bookings, query, statusFilter, movieFilter, theaterFilter, dateFilter])

  async function handleCancel(id) {
    const updated = await updateBooking(id, { status: 'Cancelled' })
    setBookings((s) => s.map((b) => (b.id === id ? updated : b)))
  }

  async function handleConfirm(id) {
    const updated = await updateBooking(id, { status: 'Confirmed' })
    setBookings((s) => s.map((b) => (b.id === id ? updated : b)))
  }

  return (
    <div className="bookings-page">
      <div className="bookings-header">
        <h2>Bookings Management</h2>
        <p className="bookings-subtitle">View and manage all cinema ticket bookings</p>
      </div>

      <div className="bookings-filters">
        <div className="filter-group">
          <Search size={16} />
          <input
            placeholder="Search by ID, movie, customer, theater..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Refunded">Refunded</option>
        </select>
        <select value={movieFilter} onChange={(e) => setMovieFilter(e.target.value)}>
          <option value="">All Movies</option>
          {movieOptions.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select value={theaterFilter} onChange={(e) => setTheaterFilter(e.target.value)}>
          <option value="">All Theaters</option>
          {theaterOptions.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      <div className="bookings-summary">
        <span>Total: <strong>{bookings.length}</strong> bookings</span>
        <span>Showing: <strong>{filtered.length}</strong> filtered</span>
        <span>Confirmed: <strong>{bookings.filter((b) => b.status === 'Confirmed').length}</strong></span>
        <span>Pending: <strong>{bookings.filter((b) => b.status === 'Pending').length}</strong></span>
      </div>

      <div className="table-wrap">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Movie</th>
              <th>Theater</th>
              <th>Screen</th>
              <th>Date</th>
              <th>Time</th>
              <th>Seats</th>
              <th>Amount</th>
              <th>Customer</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={11}>
                  <div className="loading-state">
                    <div className="spinner" />
                    <p>Loading bookings...</p>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={11}>
                  <div className="empty-state">
                    <h4>No bookings found</h4>
                    <p>Try adjusting your search or filter criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((b) => (
                <tr key={b.id}>
                  <td className="booking-id">{b.bookingId}</td>
                  <td className="booking-movie">{b.movie}</td>
                  <td>{b.theater}</td>
                  <td>{b.screen}</td>
                  <td>{b.date}</td>
                  <td>{b.time}</td>
                  <td>{b.seats}</td>
                  <td className="booking-amount">${b.amount.toFixed(2)}</td>
                  <td>
                    <div className="customer-info">
                      <span className="customer-name">{b.customer}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${statusColors[b.status] || 'badge-info'}`}>
                      {b.status === 'Confirmed' && <CheckCircle size={12} />}
                      {b.status === 'Pending' && <Clock size={12} />}
                      {b.status === 'Cancelled' && <XCircle size={12} />}
                      {b.status}
                    </span>
                  </td>
                  <td className="actions">
                    {b.status === 'Pending' && (
                      <>
                        <button
                          className="btn btn-sm"
                          title="Confirm"
                          onClick={() => handleConfirm(b.id)}
                        >
                          <CheckCircle size={14} />
                        </button>
                        <button
                          className="btn btn-sm danger"
                          title="Cancel"
                          onClick={() => handleCancel(b.id)}
                        >
                          <XCircle size={14} />
                        </button>
                      </>
                    )}
                    {b.status === 'Confirmed' && (
                      <button
                        className="btn btn-sm danger"
                        title="Cancel Booking"
                        onClick={() => handleCancel(b.id)}
                      >
                        <XCircle size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
