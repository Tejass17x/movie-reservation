import React, { useState, useEffect } from 'react';
import { Calendar, Film, User, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../utils/api.js';
import { useToast } from '../context/ToastContext.jsx';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterMovie, setFilterMovie] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const { showToast } = useToast();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
      };
      if (filterMovie) params.movie_id = filterMovie;
      if (filterDate) params.date = filterDate;
      if (filterStatus) params.status = filterStatus;

      const response = await api.get('/admin/bookings', { params });
      setBookings(response.data.bookings);
      setTotalPages(response.data.totalPages || 1);
      setTotalItems(response.data.total || 0);
    } catch (err) {
      console.error('Fetch bookings error:', err);
      showToast('Failed to retrieve bookings report.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMovies = async () => {
    try {
      const response = await api.get('/admin/movies');
      setMovies(response.data);
    } catch (err) {
      console.error('Fetch movies dropdown error:', err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, filterMovie, filterDate, filterStatus]);

  useEffect(() => {
    fetchMovies();
  }, []);

  // Reset page when filters change
  const handleMovieChange = (val) => {
    setFilterMovie(val);
    setPage(1);
  };

  const handleDateChange = (val) => {
    setFilterDate(val);
    setPage(1);
  };

  const handleStatusChange = (val) => {
    setFilterStatus(val);
    setPage(1);
  };

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(val);
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Bookings Ledger</h1>
          <p>Read-only transaction log and seating assignments (managed by transactional desk)</p>
        </div>
      </div>

      {/* Filter Options */}
      <div className="filter-bar">
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Film size={16} className="text-gold" />
            <select
              className="form-input"
              value={filterMovie}
              onChange={(e) => handleMovieChange(e.target.value)}
              style={{ width: '200px', padding: '0.5rem 1rem', background: '#1a1a1a', borderRadius: '20px' }}
            >
              <option value="">All Movies</option>
              {movies.map((m) => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={16} className="text-gold" />
            <input
              type="date"
              className="form-input"
              value={filterDate}
              onChange={(e) => handleDateChange(e.target.value)}
              style={{ width: '160px', padding: '0.5rem 1rem', background: '#1a1a1a', borderRadius: '20px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tag size={16} className="text-gold" />
            <select
              className="form-input"
              value={filterStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              style={{ width: '160px', padding: '0.5rem 1rem', background: '#1a1a1a', borderRadius: '20px' }}
            >
              <option value="">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {(filterMovie || filterDate || filterStatus) && (
            <button
              className="chip"
              onClick={() => {
                setFilterMovie('');
                setFilterDate('');
                setFilterStatus('');
                setPage(1);
              }}
              style={{ height: '38px', alignSelf: 'center' }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Bookings Table */}
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer Info</th>
                  <th>Movie</th>
                  <th>Screening & Screen</th>
                  <th>Seats</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Transacted On</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <span className="text-muted" style={{ fontFamily: 'monospace' }}>
                        #BK-{String(b.id).padStart(5, '0')}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <strong>{b.user?.name}</strong>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>{b.user?.email}</span>
                      </div>
                    </td>
                    <td>
                      <strong>{b.showtime?.movie?.title}</strong>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{formatDateTime(b.showtime?.startTime)}</span>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                          {b.showtime?.screen?.theater?.name} ({b.showtime?.screen?.name})
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="chip-filters" style={{ gap: '0.25rem' }}>
                        {b.bookingSeats.map((seat) => (
                          <span 
                            key={seat.id} 
                            style={{ 
                              padding: '0.15rem 0.4rem', 
                              backgroundColor: '#1c1c1c', 
                              fontSize: '0.75rem', 
                              border: '1px solid #333',
                              borderRadius: '4px',
                              color: '#d4a94a'
                            }}
                          >
                            {seat.seatLabel}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ color: '#d4a94a', fontWeight: 500 }}>
                      {formatCurrency(b.totalCost)}
                    </td>
                    <td>
                      <span className={`badge badge-${b.status}`}>
                        {b.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>
                      {formatDateTime(b.createdAt)}
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                      No transaction records found matching your query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="pagination">
              <span className="pagination-text">
                Showing entries { (page - 1) * limit + 1 } - { Math.min(page * limit, totalItems) } of { totalItems }
              </span>
              <div className="pagination-controls">
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={page === 1}
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  <ChevronLeft size={14} />
                  <span>Prev</span>
                </button>
                <span className="pagination-text" style={{ alignSelf: 'center', margin: '0 0.5rem' }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  <span>Next</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Bookings;
