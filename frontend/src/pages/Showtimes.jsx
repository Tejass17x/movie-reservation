import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, Film, DollarSign } from 'lucide-react';
import api from '../utils/api.js';
import { useToast } from '../context/ToastContext.jsx';
import Modal from '../components/Modal.jsx';

const Showtimes = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [filterMovie, setFilterMovie] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // Modals Toggles
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeShowtime, setActiveShowtime] = useState(null);

  // Form Fields State
  const [selectedMovieId, setSelectedMovieId] = useState('');
  const [selectedTheaterId, setSelectedTheaterId] = useState('');
  const [selectedScreenId, setSelectedScreenId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [price, setPrice] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const { showToast } = useToast();

  // Fetch showtimes list
  const fetchShowtimes = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterMovie) params.movie_id = filterMovie;
      if (filterDate) params.date = filterDate;

      const response = await api.get('/admin/showtimes', { params });
      setShowtimes(response.data);
    } catch (err) {
      console.error('Fetch showtimes error:', err);
      showToast('Failed to retrieve showtimes scheduling.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch movies and theaters list for dropdowns
  const fetchDropdownData = async () => {
    try {
      const [moviesRes, theatersRes] = await Promise.all([
        api.get('/admin/movies'),
        api.get('/admin/theaters')
      ]);
      setMovies(moviesRes.data);
      setTheaters(theatersRes.data);
    } catch (err) {
      console.error('Fetch dropdown data error:', err);
      showToast('Failed to load movie/theater options.', 'error');
    }
  };

  useEffect(() => {
    fetchShowtimes();
  }, [filterMovie, filterDate]);

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const resetForm = () => {
    setSelectedMovieId('');
    setSelectedTheaterId('');
    setSelectedScreenId('');
    setStartTime('');
    setPrice('');
    setFormErrors({});
    setActiveShowtime(null);
  };

  const openAddModal = () => {
    resetForm();
    if (movies.length > 0) setSelectedMovieId(movies[0].id.toString());
    if (theaters.length > 0) {
      setSelectedTheaterId(theaters[0].id.toString());
      if (theaters[0].screens.length > 0) {
        setSelectedScreenId(theaters[0].screens[0].id.toString());
      }
    }
    setIsFormOpen(true);
  };

  const openEditModal = (showtime) => {
    setActiveShowtime(showtime);
    setSelectedMovieId(showtime.movieId.toString());
    
    // Find screen's theater
    const screenId = showtime.screenId;
    let foundTheater = null;
    for (const t of theaters) {
      const match = t.screens.find(s => s.id === screenId);
      if (match) {
        foundTheater = t;
        break;
      }
    }

    if (foundTheater) {
      setSelectedTheaterId(foundTheater.id.toString());
    }
    setSelectedScreenId(screenId.toString());

    // Format ISO date String to fit datetime-local field (YYYY-MM-DDThh:mm)
    const localDate = new Date(showtime.startTime);
    const tzOffset = localDate.getTimezoneOffset() * 60000;
    const localISODate = new Date(localDate.getTime() - tzOffset).toISOString().slice(0, 16);
    
    setStartTime(localISODate);
    setPrice(parseFloat(showtime.price).toString());
    setFormErrors({});
    setIsFormOpen(true);
  };

  const openDeleteModal = (showtime) => {
    setActiveShowtime(showtime);
    setIsDeleteOpen(true);
  };

  const handleTheaterChange = (theaterIdStr) => {
    setSelectedTheaterId(theaterIdStr);
    const theater = theaters.find(t => t.id.toString() === theaterIdStr);
    if (theater && theater.screens.length > 0) {
      setSelectedScreenId(theater.screens[0].id.toString());
    } else {
      setSelectedScreenId('');
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!selectedMovieId) errors.movieId = 'Please select a movie';
    if (!selectedTheaterId) errors.theaterId = 'Please select a theater';
    if (!selectedScreenId) errors.screenId = 'Please select a screen';
    if (!startTime) errors.startTime = 'Start date and time is required';
    
    const pr = parseFloat(price);
    if (!price) {
      errors.price = 'Price is required';
    } else if (isNaN(pr) || pr <= 0) {
      errors.price = 'Price must be a positive number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      movieId: parseInt(selectedMovieId),
      screenId: parseInt(selectedScreenId),
      startTime: new Date(startTime).toISOString(),
      price: parseFloat(price)
    };

    try {
      if (activeShowtime) {
        await api.put(`/admin/showtimes/${activeShowtime.id}`, payload);
        showToast('Showtime updated successfully.', 'success');
      } else {
        await api.post('/admin/showtimes', payload);
        showToast('Showtime scheduled successfully.', 'success');
      }
      setIsFormOpen(false);
      resetForm();
      fetchShowtimes();
    } catch (err) {
      console.error('Submit showtime error:', err);
      const errMsg = err.response?.data?.error || 'Failed to save showtime scheduling.';
      showToast(errMsg, 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!activeShowtime) return;
    try {
      await api.delete(`/admin/showtimes/${activeShowtime.id}`);
      showToast('Showtime deleted successfully.', 'success');
      setIsDeleteOpen(false);
      setActiveShowtime(null);
      fetchShowtimes();
    } catch (err) {
      console.error('Delete showtime error:', err);
      showToast('Failed to delete showtime.', 'error');
    }
  };

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      weekday: 'short',
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

  // Get screens of currently selected theater in form modal
  const activeTheaterScreens = theaters.find(t => t.id.toString() === selectedTheaterId)?.screens || [];

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Showtimes Schedule</h1>
          <p>Schedule movie screenings across theater screens</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          <span>Add Showtime</span>
        </button>
      </div>

      {/* Filter Options */}
      <div className="filter-bar">
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Film size={16} className="text-gold" />
            <select
              className="form-input"
              value={filterMovie}
              onChange={(e) => setFilterMovie(e.target.value)}
              style={{ width: '220px', padding: '0.5rem 1rem', background: '#1a1a1a', borderRadius: '20px' }}
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
              onChange={(e) => setFilterDate(e.target.value)}
              style={{ width: '180px', padding: '0.5rem 1rem', background: '#1a1a1a', borderRadius: '20px' }}
            />
            {filterDate && (
              <button 
                className="chip" 
                onClick={() => setFilterDate('')}
                style={{ height: '38px', padding: '0.5rem 0.8rem' }}
              >
                Clear Date
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Showtimes Table */}
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Movie Title</th>
                <th>Theater</th>
                <th>Screen</th>
                <th>Screening Time</th>
                <th>Ticket Price</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {showtimes.map((s) => (
                <tr key={s.id}>
                  <td>
                    <strong>{s.movie?.title}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#666' }}>{s.movie?.durationMinutes} mins</div>
                  </td>
                  <td>{s.screen?.theater?.name}</td>
                  <td>{s.screen?.name}</td>
                  <td>{formatDateTime(s.startTime)}</td>
                  <td style={{ color: '#d4a94a', fontWeight: 500 }}>
                    {formatCurrency(s.price)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="action-buttons" style={{ justifyContent: 'center' }}>
                      <button 
                        className="btn btn-secondary btn-sm" 
                        title="Edit Showtime"
                        onClick={() => openEditModal(s)}
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        className="btn btn-danger btn-sm" 
                        title="Delete Showtime"
                        onClick={() => openDeleteModal(s)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {showtimes.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                    No showtimes scheduled matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Showtime Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={activeShowtime ? 'Modify Showtime Settings' : 'Schedule New Showtime'}
      >
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label className="form-label">Select Movie</label>
            <select
              className="form-input"
              value={selectedMovieId}
              onChange={(e) => setSelectedMovieId(e.target.value)}
              style={{ appearance: 'auto' }}
            >
              <option value="" disabled>Choose a film...</option>
              {movies.map(m => (
                <option key={m.id} value={m.id}>{m.title} ({m.durationMinutes} mins)</option>
              ))}
            </select>
            {formErrors.movieId && <div className="form-error">{formErrors.movieId}</div>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Select Theater Venue</label>
              <select
                className="form-input"
                value={selectedTheaterId}
                onChange={(e) => handleTheaterChange(e.target.value)}
                style={{ appearance: 'auto' }}
              >
                <option value="" disabled>Choose theater...</option>
                {theaters.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              {formErrors.theaterId && <div className="form-error">{formErrors.theaterId}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Select Screen</label>
              <select
                className="form-input"
                value={selectedScreenId}
                onChange={(e) => setSelectedScreenId(e.target.value)}
                style={{ appearance: 'auto' }}
                disabled={activeTheaterScreens.length === 0}
              >
                {activeTheaterScreens.length === 0 ? (
                  <option value="">No screens configured</option>
                ) : (
                  activeTheaterScreens.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.rows * s.columns} seats)</option>
                  ))
                )}
              </select>
              {formErrors.screenId && <div className="form-error">{formErrors.screenId}</div>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Date & Start Time</label>
              <input
                type="datetime-local"
                className="form-input"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              {formErrors.startTime && <div className="form-error">{formErrors.startTime}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Ticket Price (USD)</label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 14.50"
                  style={{ paddingLeft: '2rem' }}
                />
              </div>
              {formErrors.price && <div className="form-error">{formErrors.price}</div>}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {activeShowtime ? 'Save Changes' : 'Schedule Showtime'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Showtime Deletion"
        size="sm"
      >
        <div style={{ marginBottom: '1.5rem' }}>
          Are you sure you want to permanently remove this showtime on screen <strong>{activeShowtime?.screen?.name}</strong>?
          <p style={{ marginTop: '0.5rem', color: '#ef4444', fontSize: '0.85rem' }}>
            Warning: This action will cascade delete all bookings associated with this showtime!
          </p>
        </div>
        <div className="modal-footer" style={{ border: 'none', paddingTop: 0 }}>
          <button type="button" className="btn btn-secondary" onClick={() => setIsDeleteOpen(false)}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm}>
            Delete Showtime
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Showtimes;
